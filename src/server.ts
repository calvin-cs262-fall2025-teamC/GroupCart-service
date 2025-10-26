import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
import groupCartRouter from "./routes";

/* SWAGGER SETUP */

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "GroupCart",
      version: "0.1.0",
      description: "GroupCart backend service",
    },
  },
  apis: [path.join(__dirname, "routes.js")], // Absolute path
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use('/api', groupCartRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
