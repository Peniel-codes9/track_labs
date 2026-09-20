const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const spec = yaml.load(fs.readFileSync(path.join(__dirname, "openapi.yaml"), "utf8"));

const router = express.Router();

router.get("/api-docs.json", function (req, res) {
  res.json(spec);
});

// withCredentials so the browser actually sends the session cookie with
// "Try it out" requests — without this, every protected operation in the UI
// would look logged-out no matter what.
router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(spec, {
    swaggerOptions: {
      requestInterceptor: function (req) {
        req.credentials = "include";
        return req;
      },
    },
  })
);

module.exports = router;
