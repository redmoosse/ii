const express = require('express');
const router = express.Router();
const { handleQuestionHttp } = require('../controllers/modelController');
const verifyJWT = require('../utils/verifyJWT');

/**
 * @swagger
 * /model/predict:
 *   post:
 *     summary: Get answer from BioBERT ML
 *     security:
 *       - bearerAuth: []
 *     tags: [Model]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "I felt a sharp pain in the lower abdomen on the right side, which increases with movement. My temperature has risen to 38.2°C, nausea but no vomiting. It started last night, but today the pain is worse."
 *     responses:
 *       200:
 *         description: Succesful answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 diagnosis:
 *                   type: string
 *                 doctorType:
 *                   type: string
 *                 timeSpan:
 *                   type: string
 *       401:
 *          description: Missing Authorization header
 *       403:
 *          description: Invalid or expired token
 */
router.post('/question', verifyJWT, handleQuestionHttp);

router.get('/info', verifyJWT, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

module.exports = router;
