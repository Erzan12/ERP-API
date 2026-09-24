require("dotenv/config");
const { defineConfig, env } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    // local dev
    url: env.DATABASE_URL,
    //  production
    // url: env("DIRECT_URL"),
  },
});