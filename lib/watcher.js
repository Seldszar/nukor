const { watchPath } = require("@atom/watcher");
const EventEmitter = require("events");
const defaults = require("lodash.defaults");
const throttle = require("lodash.throttle");
const helpers = require("./helpers");

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
   * @param {Object} [options] The watcher options.
   * @param {Boolean} [options.recursive=true] Indicate if the watcher is recursive.
   * @param {Number} [options.interval=500] Interval between each change request.
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
   * @return {Promise<void>}
   */
  async start() {
    this._watcher = await watchPath(this.basePath, this.options, events => {
      this._enqueueEvents(events);
      this._requestChange();
    });
  }

  /**
   * Stop the watcher.
   */
  stop() {
    if (this._watcher) {
      this._watcher.dispose();
      this._watcher = null;
    }
  }
}

module.exports = Watcher;
