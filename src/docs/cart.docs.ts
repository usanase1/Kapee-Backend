/**
 * @openapi
 * /api-v1/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, productId, quantity]
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated cart object
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Server error
 * /api-v1/cart/{userId}:
 *   get:
 *     tags: [Cart]
 *     summary: Get a user's cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart object
 *       500:
 *         description: Server error
 * /api-v1/cart/{userId}/clear:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear a user's cart
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared
 *       500:
 *         description: Server error
 */
export {};