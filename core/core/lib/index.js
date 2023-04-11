'use strict';

module.exports = core;

const path = require('path');
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

let args, config;

function core(params) {
  // 捕获堆栈信息，只打印出message
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    log.verbose('debug', 'test debug log')
  } catch (error) {
    log.error(error.message)
  }
}
/**
 * @description 获取环境变量
 * 1. 通过 .env 的方式
 * 2. 通过挂载到 process.env 上去共享（推荐）
 */
function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (Utils.pathExistsSync(dotenvPath)) {
    dotenv.config({path: dotenvPath});
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig(params) {
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig.cliHome = path.join(userHome, constant.DEFAULT_CLI_HOME);
    process.env.CLI_HOME = cliConfig.cliHome;
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
/** 如果传入 --debug 则进入 debug 模式 */
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