const some = require('lodash.some');
const nsfw = require('nsfw');
const path = require('path');

/**
 * Indicate if the change should be filtered.
 *
 * @param {Array<Object>} accumulator The accumulator.
 * @param {Object} change The change to filter.
 * @param {Array<Object>} changes The collection of changes.
 * @return {Boolean} Returns `true` if the change should be filtered, else `false`.
 */
function shouldFilterChange(accumulator, change, changes) {
  if (some(accumulator, change)) {
    return false;
  }

  if (change.action === 'created') {
    if (some(changes, { action: 'renamed', oldPath: change.newPath })) {
      return false;
    }
  }

  if (change.action === 'deleted') {
    if (some(changes, { action: 'renamed', newPath: change.oldPath })) {
      return false;
    }
  }

  if (change.action === 'modified') {
    if (some(changes, { action: 'created', newPath: change.newPath })) {
      return false;
    }

    if (some(changes, { action: 'renamed', newPath: change.newPath })) {
      return false;
    }

    if (some(changes, { action: 'deleted', oldPath: change.newPath })) {
      return false;
    }
  }

  return true;
}

/**
 * Filter the given changes by rejecting useless ones.
 *
 * @param {Array<Object>} changes The changes to filter.
 * @return {Array<Object>} The filtered changes.
 */
function filterChanges(changes) {
  const accumulator = [];

  for (const change of changes) {
    if (shouldFilterChange(accumulator, change, changes)) {
      accumulator.push(change);
    }
  }

  return accumulator;
}

/**
 * Create a new watcher.
 *
 * @param {String} rootPath The path to watch.
 * @param {Function} onChange Function called after each change.
 * @param {Object} [options] The watcher options.
 * @return {Promise<Watcher>} The watcher instance.
 */
async function createWatcher(rootPath, onChange, options) {
  return nsfw(
    rootPath,
    events => {
      const changes = [];

      for (const event of events) {
        let action;
        let oldPath;
        let newPath;

        if (event.action === nsfw.actions.CREATED) {
          action = 'created';
          oldPath = null;
          newPath = path.join(event.directory, event.file);
        }

        if (event.action === nsfw.actions.DELETED) {
          action = 'deleted';
          oldPath = path.join(event.directory, event.file);
          newPath = null;
        }

        if (event.action === nsfw.actions.MODIFIED) {
          action = 'modified';
          oldPath = path.join(event.directory, event.file);
          newPath = path.join(event.directory, event.file);
        }

        if (event.action === nsfw.actions.RENAMED) {
          action = 'renamed';
          oldPath = path.join(event.directory, event.oldFile);
          newPath = path.join(event.directory, event.newFile);
        }

        changes.push({
          action,
          oldPath,
          newPath,
        });
      }

      onChange(filterChanges(changes));
    },
    options,
  );
}

exports.shouldFilterChange = shouldFilterChange;
exports.filterChanges = filterChanges;
exports.createWatcher = createWatcher;
