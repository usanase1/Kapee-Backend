/**
 * @openapi
 * /api-v1/user/userRegistration:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user and send email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullname, email, password]
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               userRole:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User created, verification code sent
 *       400:
 *         description: Validation error or user exists
 *       500:
 *         description: Server error
 * /api-v1/user/userLogin:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 *       500:
 *         description: Server error
 * /api-v1/user/getAllUsers:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Users list
 *       400:
 *         description: Error fetching users
 * /api-v1/user/userLogout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user (invalidate token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: No token or invalid token
 *       500:
 *         description: Server error
 * /api-v1/user/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If account exists, email sent
 *       500:
 *         description: Server error
 * /api-v1/user/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, email, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 * /api-v1/user/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email with code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Server error
 * /api-v1/user/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If account exists, verification sent
 *       500:
 *         description: Server error
 */
export {};
