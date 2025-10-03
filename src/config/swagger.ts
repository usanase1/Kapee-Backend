import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Kapee API",
      version: "1.0.0",
      description: "API documentation for e-commerce backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  servers: [
    { url: "http://localhost:5000" },
    { url: "https://kapee-backend.onrender.com" }
  ],
  apis: [
    "./src/docs/*.docs.ts",      // dev
    "./dist/docs/*.docs.js"      // prod build
  ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };