// socketService.js
module.exports = {
    notifyNewBill(userId, billDetails) {
      io.to(userId).emit('newBill', billDetails);
    },
    notifyFineImposed(userId, fineDetails) {
      io.to(userId).emit('fineNotification', fineDetails);
    }
  };
  