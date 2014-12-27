# node-importer

A node.js library that helps you to import (require) all sources in a given directory.

```
npm install --save node-importer
```

### importer (options, handler)
_Synchronously_ imports all sources in a given directory and calls handler.

* `options` (object || string): Import options. (or module directory path)
* `handler` (function): is called when import each module.

Option    | Description                             | Default
-------   | --------------------------------------- | ---------
path      | Directory to import sources             | -
recursive | Boolean value indicating recursive mode | false

* Example usage:
```
var importer = require('node-importer');

importer('modules/', function(module, name) {
    // foo.js : Hello world!
    console.log(name + '.js : ' + module.hello());
});
```

### importer.async (options, handler)
_Asynchronously_ imports all sources in a given directory and calls handler.

### importer.express (expressApp, options)
Use all modules in a directory as a express route. <br/>
***NOTE:*** you need to export express.Router object in module. ```module.exports = router;```

* `options` (object || string): Import options. (or module directory path)
* `handler` (function): is called when import each module.

Option    | Description                             | Default
-------   | --------------------------------------- | ---------
routePath | The path to connect routes.             | / (root)

* Example usage:
```
importer.express(app, 'routes/');
```

#### License: MIT
#### Author: [Hyojun Kim](http://github.com/retail3210)
