const some = require("lodash.some");
const slash = require("slash");

/**
 * Indicate if the event should be filtered.
 *
 * @param {Array<Object>} accumulator The accumulator.
 * @param {Object} event The event to filter.
 * @param {Array<Object>} queue The events queue.
 * @return {Boolean} Returns `true` if the event should be filtered, else `false`.
 */
function shouldFilterEvent(accumulator, event, queue) {
  if (some(accumulator, event)) {
    return false;
  }

  if (event.action === "created") {
    // If the file is deleted after being created
    if (some(queue, { action: "deleted", path: event.path })) {
      return false;
    }
  }

  if (event.action === "modified") {
    // If the file is created after being modified
    if (some(accumulator, { action: "created", path: event.path })) {
      return false;
    }

    // If the file is deleted after being modified
    if (some(accumulator, { action: "deleted", path: event.path })) {
      return false;
    }

    // If the file is renamed after being modified
    if (some(queue, { action: "renamed", oldPath: event.path })) {
      return false;
    }

    // If the file is deleted after being modified
    if (some(queue, { action: "deleted", path: event.path })) {
      return false;
    }
  }

  return true;
}

/**
 * Filter an event collection.
 *
 * @param {Array<Object>} events The events to filter.
 * @return {Array<Object>} The filtered events.
 */
function filterEvents(events) {
  const accumulator = [];
  const queue = events.slice();

  for (const event of events) {
    if (shouldFilterEvent(accumulator, queue.shift(), queue)) {
      accumulator.push(event);
    }
  }

  return accumulator;
}

/**
 * Normalize an event collection.
 *
 * @param {Array<Object>} events The events to normalize.
 * @return {Array<Object>} The normalized events.
 */
function normalizeEvents(events) {
  return events.map(event => {
    event.path = slash(event.path);

    if (event.oldPath) {
      event.oldPath = slash(event.oldPath);
    }

    return event;
  });
}

exports.shouldFilterEvent = shouldFilterEvent;
exports.filterEvents = filterEvents;
exports.normalizeEvents = normalizeEvents;
