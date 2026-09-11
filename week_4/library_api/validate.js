// Takes a Joi schema and returns an Express middleware that checks req.body
// against it before the controller runs.
function validate(schema) {
  return function (req, res, next) {
    const result = schema.validate(req.body, { abortEarly: false });

    if (result.error) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.details.map(function (d) {
            return d.message;
          }),
        },
      });
    }

    req.body = result.value;
    next();
  };
}

module.exports = validate;