const Watcher = require("./watcher");

/**
 * Create a new watcher.
 *
 * @param {String} basePath The base path to watch.
 * @param {WatcherOptions} [options] The watcher options.
 * @return {Watcher} The watcher.
 */
function createWatcher(basePath, options) {
  return new Watcher(basePath, options);
}

/**
 * Watch a path.
 *
 * @param {String} basePath The base path to watch.
 * @param {WatcherOptions} [options] The watcher options.
 * @param {Function} [callback] Function called when a change occurred.
 * @return {Promise<Watcher>} The watcher.
 */
function watchPath(basePath, options, callback) {
  const watcher = createWatcher(basePath, options);

  if (callback) {
    watcher.on("change", callback);
  }

  return watcher.start().then(() => {
    return watcher;
  });
}

exports.Watcher = Watcher;
exports.createWatcher = createWatcher;
exports.watchPath = watchPath;
