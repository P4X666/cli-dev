'use strict';

module.exports = core;
/** 比对版本号的大小 */
const semver = require("semver");
const colors = require("colors");
const log = require("@cli-dev/log");

const pkg = require("../package.json");
const constant = require('./constant');

function core(params) {
  // 捕获堆栈信息，只打印出message
  try {
    checkPkgVersion();
    checkNodeVersion();
  } catch (error) {
    log().error(error.message)
  }
  
}
function checkNodeVersion() {
  // 获取当前Node版本号
  console.log(process.version);
  const currentNodeVersion = process.version;
  // 比对最低版本号
  if (!semver.gte(currentNodeVersion, constant.LOWEST_NODE_VERSION)) {
    throw new Error(colors.red(`cli-dev 需要安装 ${constant.LOWEST_NODE_VERSION} 以上版本的nodejs`))
  }
}
/** 检查版本号 */
function checkPkgVersion() {
  log().notice('cli', pkg.version);
}