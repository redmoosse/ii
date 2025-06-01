const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirects to Google for authentication
 *     description: Initiates the Google OAuth2.0 login process.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth 2.0 login page
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth. Returns a JWT token on success.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful authentication, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    //TODO maybe set coolie
    const token = generateToken(req.user);
    res.json({ token });
  }
);

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: OAuth failure redirect
 *     description: Called when OAuth authentication fails.
 *     tags:
 *       - Auth
 *     responses:
 *       401:
 *         description: Authorization failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Authorization failed
 */
router.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'Authorization failed' });
});

module.exports = router;
