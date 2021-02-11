/**
 * Retry Promise
 *
 * @param {() => Promise} fn
 * @param {(e: Error) => any} [onError=() => {}]
 * @param {number} [retry=2]
 */
const retryPromise = (fn, onError = () => {}, retry = 2) =>
  fn().catch(e => {
    if (retry <= 0) throw e;
    onError(e);
    return retryPromise(fn, onError, retry - 1);
  });

module.exports = retryPromise;
