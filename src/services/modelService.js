const axios = require('axios')
const modelUrl = process.env.MODEL_HOST;
/**
 * Call our model through REST API and return answer
 * and sends a response back via return.
 * @param {object} data - The data payload to request BioBERT model
 */
async function callModelAPI(data) {
	try {
		const response = await axios.post(
			`http://${modelUrl}/process`,
			{
				text: data.text,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		return response.data
	} catch (error) {
		console.error('Error calling model BioBERT:', error.message)
		throw new Error('Error communicating with Python server')
	}
}

module.exports = { callModelAPI }
