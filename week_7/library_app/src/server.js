const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

async function start() {
  await connectDB();
  app.listen(env.PORT, function () {
    console.log("library-api listening on port " + env.PORT);
  });
}

start();
