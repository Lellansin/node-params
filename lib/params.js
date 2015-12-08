/*
 * Check parameters for async module
 */
exports.asyncCheck = function (struct) {
  var keys = Object.keys(struct);
  var constructor = getConstructor(struct, keys);
  var checks = getChecks(struct, keys);
  var errors = getErrors(struct, keys);

  return function (param, cb) {
    var result = {};
    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      var value = param[key];
      if (value) {
        if (value.constructor === constructor[key] && checks[key](value)) {
          result[key] = value;
        } else {
          return cb(errors[key]);
        }
      } else if (struct[key].required) {
        return cb(errors[key]);
      } else if (struct[key].default) {
        result[key] = struct[key].default;
      }
    }
    return cb(null, result);
  };
};

/*
 * Check parameters for promise 
 * (Need inner promise support, such as node v4.2)
 */
exports.promiseCheck = function (struct) {
  var keys = Object.keys(struct);
  var constructor = getConstructor(struct, keys);
  var checks = getChecks(struct, keys);
  var errors = getErrors(struct, keys);

  return function (param) {
    return new Promise(
      function (resolve, reject) {
        var result = {};
        for (var i = keys.length - 1; i >= 0; i--) {
          var key = keys[i];
          var value = param[key];
          if (value) {
            if (value.constructor === constructor[key] && checks[key](value)) {
              result[key] = value;
            } else {
              return reject(errors[key]);
            }
          } else if (struct[key].required) {
            return reject(errors[key]);
          } else if (struct[key].default) {
            result[key] = struct[key].default;
          }
        }
        return resolve(result);
      });
  };
};

var getConstructor = function (struct, keys) {
  var data = {};
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    if (struct[key].type) {
      data[key] = struct[key].type;
    } else {
      throw new Error('no type defined for key:' + key);
    }
  }
  return data;
};

var getChecks = function (struct, keys) {
  var data = {};
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    switch (struct[key].check.constructor) {
    case Function:
      data[key] = struct[key].check;
      break;
    case Array:
      data[key] = function (value) {
        return this.checkList.indexOf(value) >= 0;
      }.bind({
        checkList: struct[key].check
      });
      break;
    default:
      data[key] = function () {
        return true;
      };
    }
  }
  return data;
};

var getErrors = function (struct, keys) {
  var data = {};
  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    data[key] = struct[key].error || 'required param: ' + key;
  }
  return data;
};
