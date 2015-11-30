var MSG = {
  fileUploadRequest: 'fileUploadRequest',     // {roomName, file, requestId, userId}
  fileUploadRequested: 'fileUploadRequested', // {requestId, fileId}
  fileUpload: 'fileUpload',                   // {fileId, requestID}
  fileProgress: 'fileProgress',               // {fileId, percentage}
  fileUploaded: 'fileUploaded',               // {fileUrl, fileSize, fileName, fileId}
  fileDelete: 'fileDelete',                   // {roomName, fileName, fileId, userId, (boxId)}
  fileDeleted: 'fileDeleted',                 // {filename}
  connected: 'connected',                     // URL
  error: 'ccError'                // error
};

module.exports = MSG;
