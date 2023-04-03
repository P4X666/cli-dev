'use strict';

module.exports = log;

const npmlog = require("npmlog");

npmlog.level = process.env.LOG_LEVEL || 'info';
npmlog.heading = 'cli';
npmlog.headingStyle = { fg: 'red', bg: 'black' };
npmlog.addLevel('success', 2000, {fg: 'green', bold: true})

function log() {
  return npmlog;
}
