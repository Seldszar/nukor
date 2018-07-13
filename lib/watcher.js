const { watchPath } = require("@atom/watcher");
const EventEmitter = require("events");
const defaults = require("lodash.defaults");
const throttle = require("lodash.throttle");
const helpers = require("./helpers");

/**
 * @typedef {Object} WatcherOptions
 * @property {Boolean} recursive Indicate if the watcher is recursive.
 * @property {Number} interval Interval between each change request.
 */

/**
 * A watcher.
 *
 * @class
 * @extends {EventEmitter}
 */
class Watcher extends EventEmitter {
  /**
   * Create a new watcher.
   *
   * @constructor
   * @param {String} basePath The base path to watch.
   * @param {WatcherOptions} [options] The watcher options.
   */
  constructor(basePath, options) {
    super();

    this.basePath = basePath;
    this.options = defaults(options, {
      recursive: true,
      interval: 500,
    });

    this._watcher = null;
    this._queuedEvents = [];

    this._enqueueEvents = events => {
      Array.prototype.push.apply(this._queuedEvents, events);
    };

    this._processQueue = () => {
      const events = helpers.normalizeEvents(
        helpers.filterEvents(this._queuedEvents.splice(0)),
      );

      if (events.length > 0) {
        this.emit("change", events);
      }
    };

    this._requestChange = throttle(this._processQueue, this.options.interval, {
      leading: false,
    });
  }

  /**
   * Start the watcher.
   *
   * @return {Promise}
   */
  async start() {
    this._watcher = await watchPath(this.basePath, this.options, events => {
      this._enqueueEvents(events);
      this._requestChange();
    });

    this._watcher.onDidError(error => {
      this.emit("error", error);
    });
  }

  /**
   * Stop the watcher.
   *
   * @return {Promise}
   */
  async stop() {
    if (this._watcher) {
      this._watcher.dispose();
      this._watcher = null;
    }
  }
}

module.exports = Watcher;
