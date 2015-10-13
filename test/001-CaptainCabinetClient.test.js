var should = require('should');
var socketStream = require('socket.io-stream');

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var FMC = require('../lib/');
var app = require('http').createServer();
var io = require('socket.io').listen(app);

var testFileLocation = 'test/test/test.txt';

var fileId;
var requestId;

var port = 3000;
var baseUrl = 'http://localhost';

/*global describe it before after*/

describe('CaptainCabinetClient tests', function tests() {
  this.timeout(5000);

  before(function setup() {
    app.listen(port);

    mkdirp(path.dirname(testFileLocation), function onFileCreated(err) {
      if(err) {
        throw new Error(err);
      }
      fs.writeFile(testFileLocation, 'test');
    });

    io.on('connection', function onConnected(socket) {
      socket.once('fileUploadRequest', function onFileUploadRequest(data) {
        fileId = Math.random();
        requestId = data.requestId;
        socket.emit('fileUploadRequested', {'error': null, 'fileId': fileId,
          'requestId': data.requestId });
      });
      socket.on('disconnect', function onDisconnect() {
        app.emit('disconnected');
      });

      socketStream(socket).once('fileUpload',
        function onFileUpload(stream, data) {
        var transfer = stream.pipe(fs.createWriteStream('testoutput.txt'));
        transfer.on('finish', function onFinish() {
          socket.emit('fileUploaded', {
            'fileUrl': 'http://file.com/file',
            'fileSize': 100,
            'fileName': 'testoutput.txt',
            'fileId': '12345',
            'boxId': '54321',
            'boxUrl': 'http://box.net/file'
          });
        });
      });
      socket.once('fileDelete', function onFileDelete(data) {
        socket.emit('fileDeleted', {'fileName': data.fileName});
      });
    });
  });

  after(function cleanup() {
    fs.unlink('testoutput.txt');
    fs.unlink(testFileLocation);
    app.close();
  });

  describe('file upload', function testFileUploadProcess() {
    var client;
    it('should connect to the server', function testConnect(done) {
      client = new FMC({'baseUrl': baseUrl,
        'port': port, 'debug': false});

      client.once('error', function onError(err) {
        should.not.exist(err);
      });

      client.once('connected', function onConnected() {
        done();
      });
    });

    it('should request a file upload', function testFileUploadRequest(done) {

      client.FileUploadRequest('test', testFileLocation, 'test');

      client.once('fileUploadRequested', function onFileUploadRequest(data) {
        done();
      });

      client.once('error', function onError(err) {
        should.not.exist(err);
      });

      client.once('CaptainCabinetError', function onError(err) {
        should.not.exist(err);
      });
    });

    it('should upload file', function testFileUpload(done) {

      client._FileUpload(requestId, fileId);

      client.once('error', function onError(err) {
        should.not.exist(err);
      });

      client.once('CaptainCabinetError', function onError(err) {
        should.not.exist(err);
      });

      client.once('fileUploaded', function onFileUploaded(data) {
        should.exist(data.fileUrl);
        should.exist(data.fileSize);
        should.exist(data.fileName);
        should.exist(data.fileId);
        should.exist(data.boxId);
        should.exist(data.boxUrl);
        done();
      });
    });

    it('should delete a file', function testFileDelete(done) {
      client.FileDelete('test', 'test', 'test', 'test', 'test');
      client.once('fileDeleted', function onFileDeleted(data) {
        should.exist(data.fileName);
        done();
      })
    });
  });
});
