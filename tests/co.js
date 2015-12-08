var co = require('co');
var should = require('should');
var check = require('../').promiseCheck;

describe('promiseCheck', function () {
  var struct = {
    name: {
      type: String,
      default: 'Alan',
      check: function (name) {
        return name.length > 0 && name.length < 16 && /^[a-zA-Z0-9]+$/.test(name);
      },
      error: 'INVALID_NAME'
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
      check: ['female', 'male'],
      error: 'INVALID_GENDER'
    },
    token: {
      type: String,
      required: true,
      check: function (token) {
        return token.length == 16;
      },
      error: 'INVALID_TOKEN'
    }
  };

  var getMsg = check(struct);

  it('should get default value', function (done) {
    var data = {
      token: '1234567812345678'
    };

    co(function* () {
      var msg = yield getMsg(data);

      msg.should.deepEqual({
        name: 'Alan',
        age: 22,
        gender: 'female',
        token: '1234567812345678'
      });

    }).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should get default age value', function (done) {
    var data = {
      name: 'John',
      gender: 'male',
      token: '1234567812345678'
    };

    co(function* () {
      var msg = yield getMsg(data);

      msg.should.deepEqual({
        name: 'John',
        age: 22,
        gender: 'male',
        token: '1234567812345678'
      });

    }).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should get default age value', function (done) {
    var data = {
      name: 'John',
      gender: 'male',
      token: '1234567812345678'
    };

    co(function* () {
      var msg = yield getMsg(data);

      msg.should.deepEqual({
        name: 'John',
        age: 22,
        gender: 'male',
        token: '1234567812345678'
      });

    }).then(function () {
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should get error INVALID_GENDER', function (done) {
    var data = {
      name: 'John',
      gender: 'middle', // invalid gender
      token: '1234567812345678'
    };

    co(function* () {
      var msg = yield getMsg(data);
    }).then(function () {
      // should not come here
    }, function (err) {
      if (err && err === 'INVALID_GENDER') {
        done();
      }
    });
  });

  it('should get error INVALID_TOKEN', function (done) {
    var data = {
      name: 'John',
      age: 22,
      gender: 'male'
    };

    co(function* () {
      var msg = yield getMsg(data);
    }).then(function () {
      // should not come here
    }, function (err) {
      if (err && err === 'INVALID_TOKEN') {
        done();
      }
    });
  });

  it('should get error', function (done) {
    var data = {
      token: 123 // invalid token
    };

    co(function* () {
      var msg = yield getMsg(data);
    }).then(function () {
      // should not come here
    }, function (err) {
      if (err && err === 'INVALID_TOKEN') {
        done();
      }
    });
  });

});
