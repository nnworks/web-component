const Validator = require('jsonschema').Validator;


class JsonValidator {

  constructor() {
    this.validator = new Validator();
  }

  validate(json, schema, module, throwMessage = false) {
    var result = this.validator.validate(json, schema);

    return new Result(result.errors, schema, module);
  }
}


module.exports = new JsonValidator();


class Result {
  constructor(errors, schema, module) {
    this.errors = errors;
    this.schema = schema;
    this.module = module;
  }

  createErrorMsg() {
    var message = "";
    for (let index = 0; index < this.errors.length; index++) {
      if (index > 0) {
        message += "\n";
      }
      message += "JSON schema validation for " + this.module +  " [" + this.schema.title + "] failed: " + this.errors[index].message;
    }

    return message;
  }

  getErrorMessage() {
    if (this.errors.length > 0) {
      return this.createErrorMsg();
    } else {
      return null;
    }
  }

  throwOnError() {
    if (this.errors.length > 0) {
      throw this.createErrorMsg();
    }
  }
}
