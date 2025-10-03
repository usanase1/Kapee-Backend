/**
 * @openapi
 * /api-v1/product/create:
 *   post:
 *     tags: [Products]
 *     summary: Create a product (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               rating:
 *                 type: number
 *               isOnSale:
 *                 type: boolean
 *               originalPrice:
 *                 type: number
 *               badge:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Server error
 * /api-v1/product/getAllProducts:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 * /api-v1/product/get/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product object
 *       404:
 *         description: Not found
 * /api-v1/product/edit/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *               isOnSale:
 *                 type: boolean
 *               originalPrice:
 *                 type: number
 *               badge:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 * /api-v1/product/delete/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Not found
 */
export {};