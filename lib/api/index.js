var MSG = {
  fileUploadRequest: 'fileUploadRequest',     // {roomName, file, requestId, userId}
  fileUploadRequested: 'fileUploadRequested', // {requestId, fileId}
  fileUpload: 'fileUpload',                   // {fileId, requestID}
  fileUploaded: 'fileUploaded',               // {fileUrl, fileSize, fileName, fileId}
  connected: 'connected',                     // URL
  error: 'ccError'                // error
};

module.exports = MSG;
