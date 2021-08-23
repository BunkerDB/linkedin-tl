require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    },
  },
};
