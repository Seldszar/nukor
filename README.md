# Nukor

> Creates and focuses a high-frequency field of microwaves, literally cooking the target from within.

Nukor is a simple file watcher built on the top of [@atom/watcher](https://www.npmjs.com/package/@atom/watcher) with a filtering module which removes duplicated events.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Installation

```bash
npm install nukor --save
```

## Usage

### Create a watcher, start and listen changes by calling `watchPath()`

```javascript
const { watchPath } = require('nukor');

// Create a new watcher, start and listen changes
const watcher = await watchPath('/path/to/watch', {}, events => {
  // ...
});

// Stop the watcher
watcher.stop();
```

### Create a watcher by calling `createWatcher()`

```javascript
const { Watcher } = require('nukor');

// Create a new watcher
const watcher = createWatcher('/path/to/watch');

// Listen to change events
watcher.on('change', events => {
  // ...
});

// Start the watcher
await watcher.start();

// Stop the watcher
watcher.stop();
```

### Create a watcher by instantiating a `Watcher` class

```javascript
const { Watcher } = require('nukor');

// Create a new watcher
const watcher = new Watcher('/path/to/watch');

// Listen to change events
watcher.on('change', events => {
  // ...
});

// Start the watcher
await watcher.start();

// Stop the watcher
watcher.stop();
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
