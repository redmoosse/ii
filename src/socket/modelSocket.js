const { handleQuestionSocket } = require('../controllers/modelController');

function registerModelHandlers(socket) {
  socket.on('question', async (data, callback) => {
    await handleQuestionSocket(data, callback);
  });
}

module.exports = { registerModelHandlers };