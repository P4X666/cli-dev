'use strict';

const axios = require('axios');
const urljoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUlr = urljoin(registryUrl, npmName);
  return axios.get(npmInfoUlr).then(response => {
    if (response.status === 200) {
      return response.data;
    }
    return null;
  }).catch(err => {
    return Promise.reject(err);
  })
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}
/** 从 npm 上获取所有的版本号 */
async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions)
  } else {
    return [];
  }
}
/** 找出所有符合的 versions */
function getSemverVersions(baseVersion, versions) {
  return versions
    .filter(version => semver.satisfies(version, `>${baseVersion}`))
    // 之所以进行排序，是为了防止未来 npm 返回的 versions 不是按照倒序排列的
    .sort((a, b) => semver.gt(b, a) ? 1 : -1);
}
/** 返回最新的 version */
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    // 因为是倒序排列的，所以第一个就是最新的version
    return newVersions[0];
  }
  return null;
}

module.exports = {
  getNpmSemverVersion
};