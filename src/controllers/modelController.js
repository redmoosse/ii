/**
 * Controllers for handling API requests, both REST and Socket.IO.
 * These controllers manage the flow of data between the request/event and the model service,
 * and format the appropriate response.
 */
const { callModelAPI } = require('../services/modelService');
//TODO: Data validation in separate function.

/**
 * Handles HTTP requests for ьmodel answers.
 * This controller processes incoming REST API requests, calls the model service,
 * and sends a JSON response back to the client.
 * @param {object} req - The Express request object, containing request parameters and body.
 * @param {object} res - The Express response object, used to send the response.
 */
async function handleQuestionHttp(req, res) {
  try {
    const data = req.body;
    const result = await callModelAPI(data?.text);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error in handlePredictionHttp:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Handles Socket.IO events for model answers.
 * This controller processes incoming Socket.IO data, calls the model service,
 * and sends a response back to the client via a callback.
 * @param {object} data - The data payload received from the Socket.IO client.
 * @param {function} callback - The callback function provided by Socket.IO to send a response back to the client.
 */
async function handleQuestionSocket(data, callback) {
  if(typeof callback !== 'function') return;
  
  try {
    const result = await callModelAPI(data);
    console.log(result)
    callback({ success: true, result });
  } catch (error) {
    callback({ success: false, message: error.message });
  }
}

module.exports = {
  handleQuestionHttp,
  handleQuestionSocket
};