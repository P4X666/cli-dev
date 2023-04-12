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
      console.log(response.data, 'response.data');
      return response.data;
    }
  })
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

module.exports = {
  getNpmInfo
};