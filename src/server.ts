import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

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
      description:
        "GroupCart backend service",
    },
  },
  apis: ["./dist/routes.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs)
);

app.use('/api', groupCartRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
