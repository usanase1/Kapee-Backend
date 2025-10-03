/**
 * @openapi
 * /api-v1/categories/create:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       500:
 *         description: Server error
 * /api-v1/categories/:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
export {};