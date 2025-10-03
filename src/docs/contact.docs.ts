/**
 * @openapi
 * /api-v1/contact/create-contact:
 *   post:
 *     tags: [Contact]
 *     summary: Create a contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Contact message created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export {};