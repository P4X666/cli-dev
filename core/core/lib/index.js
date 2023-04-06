'use strict';

module.exports = core;
/** 比对版本号的大小 */
const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home"); 
// 最新版(5^)的使用的是ESModule，索性自己写在 Utils 中替代
// const pathExists = require('path-exists');
const log = require("@cli-dev/log");
const Utils = require("@cli-dev/utils");

const pkg = require("../package.json");
const constant = require('./constant');

let args;

function core(params) {
  // 捕获堆栈信息，只打印出message
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    log.verbose('debug', 'test debug log')
  } catch (error) {
    log.error(error.message)
  }
}

function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  process.env.LOG_LEVEL = args.debug ? 'verbose' : 'info';
  log.level = process.env.LOG_LEVEL; 
}
/** 如果没有主目录，则没法做后续的缓存操作 */
function checkUserHome() {
  if (!userHome || !Utils.pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在'))
  }
}
/** 检查用户是否具有root权限，如果是，则降权处理 */
function checkRoot() {
  console.log(process.geteuid);
  const rootCheck = require('root-check');
  rootCheck();
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
  log.notice('cli', pkg.version);
}