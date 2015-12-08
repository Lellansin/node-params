# node-params

Parameter check for specified strcuture.

## Async

```javascript
var async = require('async');
var paramsCheck = require('params').asyncCheck;

// Specified strcuture
var struct = {
  name: {
    type: String,  // Type check
    default: 'Alan', // default value provide
    check: function (name) { // Custom check function
      return name.length > 0 && name.length < 16 && /^[a-zA-Z0-9]+$/.test(name);
    },
    error: 'INVALID_NAME' // Custom error
  },
  age: {
    type: Number,
    default: 22,
    check: function (age) {
      return age > 0 && age < 120;
    },
    error: 'INVALID_AGE'
  },
  gender: {
    type: String,
    default: 'female',
    check: ['female', 'male'], // Enum check
    error: 'INVALID_GENDER'
  },
  token: {
    type: String,
    required: true, // Must exist
    check: function (token) {
      return token.length == 16;
    },
    error: 'INVALID_TOKEN'
  }
};

var getParams = paramsCheck(struct);

var data = {
  name: 'John',
  gender: 'male',
  token: '1234567812345678'
};

async.waterfall([
  function (cb) {
    getParams(data, cb);
  }
], function (err, params) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('params', params);
  /* {
      name: 'John',
      age: 22,
      gender: 'male',
      token: '1234567812345678'
    }
  */
});

```

## Co


```javascript
var co = require('co');
var paramsCheck = require('params').asyncCheck;

// Specified strcuture
var struct = {
  name: {
    type: String,  // Type check
    default: 'Alan', // default value provide
    check: function (name) { // Custom check function
      return name.length > 0 && name.length < 16 && /^[a-zA-Z0-9]+$/.test(name);
    },
    error: 'INVALID_NAME' // Custom error
  },
  age: {
    type: Number,
    default: 22,
    check: function (age) {
      return age > 0 && age < 120;
    },
    error: 'INVALID_AGE'
  },
  gender: {
    type: String,
    default: 'female',
    check: ['female', 'male'], // Enum check
    error: 'INVALID_GENDER'
  },
  token: {
    type: String,
    required: true, // Must exist
    check: function (token) {
      return token.length == 16;
    },
    error: 'INVALID_TOKEN'
  }
};

var getParams = paramsCheck(struct);

var data = {
  name: 'John',
  gender: 'male',
  token: '1234567812345678'
};

co(function* () {
  var params = yield getParams(data, cb);
  console.log(params);
  /* {
       name: 'John',
       age: 22,
       gender: 'male',
       token: '1234567812345678'
     }
   */

}).then(function() {
  console.log('over');
}, function (err, params) {
  console.error(err);
});

```
