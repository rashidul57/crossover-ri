// test/test-helper.js

// Load in our actual project
require('widgetProject');

// Dependencies
require('angular-mocks');
var chai = require('chai');
chai.use('sinon-chai');
chai.use('chai-as-promised');

var sinon = require('sinon');
var config = require('../config');
var url = "http://" + config.ip + ':' + config.port;

beforeEach(function() {
  // Create a new sandbox before each test
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  // Cleanup the sandbox to remove all the stubs
  this.sinon.restore();
});

module.exports = {
  rootUrl: url,
  expect: chai.expect
}