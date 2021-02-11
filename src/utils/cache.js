const _ = require('lodash');
const { _warn } = require('../utils/log');
const Cache = require('@actions/cache');

const paths = ['cache'];
const key = 'gc-cache-v1';
const restoreKeys = ['gc-cache-'];

module.exports = {
  restore: () =>
    Cache.restoreCache(paths, key, restoreKeys).catch(e => {
      _warn('缓存恢复失败');
      _warn(e);
    }),
  save: () =>
    Cache.saveCache(paths, key).catch(e => {
      _warn('缓存保存失败');
      _warn(e);
    }),
};

if (!process.env.CI) module.exports = _.mapValues(module.exports, () => async () => {});
