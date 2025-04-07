// socketService.js
let ioInstance;

module.exports = {
  init(io) {
    ioInstance = io;
  },

  notifyNewBill(userId, billDetails) {
    if (!ioInstance) return console.error('Socket.IO not initialized');
    ioInstance.to(userId).emit('newBill', billDetails);
  },

  notifyFineImposed(userId, fineDetails) {
    if (!ioInstance) return console.error('Socket.IO not initialized');
    ioInstance.to(userId).emit('fineNotification', fineDetails);
  }
};
