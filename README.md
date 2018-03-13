# Nukor

> Creates and focuses a high-frequency field of microwaves, literally cooking the target from within.

Nukor is a simple file watcher built on the top of [NSFW](https://www.npmjs.com/package/nsfw) with a filtering module which removes duplicated events.

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

```javascript
const nukor = require('nukor');

const rootPath = '/path/to/watch';
const watcher = nukor.createWatcher(rootPath, changes => {
  // ...
});

watcher.start();
```

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
