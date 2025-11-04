import express from "express";
import pgPromise from "pg-promise";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
import groupCartRouter from "./routes";

/* DATABASE SETUP */

const db = pgPromise()({
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT as string) || 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

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
