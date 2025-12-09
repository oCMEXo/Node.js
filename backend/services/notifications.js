let ioInstance = null;

function initNotifications(io) {
  ioInstance = io;
}

function sendNotification(payload) {
  if (ioInstance) {
    ioInstance.emit("notification", payload);
  }
}

module.exports = {
  initNotifications,
  sendNotification
};
