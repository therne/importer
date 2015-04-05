/*
 * Importer - Helps you to import all sources in a given directory.
 * @author vista (Hyojun Kim)
 */
'use strict';

// Imports
var fs = require('fs');
var path = require('path');

// exports
module.exports = importerSync;
module.exports.async = importerAsync;
module.exports.express = importerExpress;

/**
 * Retrieves all sources in a given directory and calls handler.
 *
 * @param options Import options. (or module directory path)
 * @param {eachModule} [handler] Called when import each module.
 */
function importerSync(options, handler) {
    var modulePath, recursive = false, parent = '';

    if (typeof options === 'string') {
        modulePath = options;

    } else {
        modulePath = options.path;
        recursive = options.recursive || recursive;
        parent = options.parent || parent;
        if (!modulePath) throw new Error("module directory path must be given.");
    }

    // absolute path? or relevant path?
    if (modulePath.indexOf('/') != 0) {
        // relevant. join with parent module's path
        modulePath = path.join(path.dirname(module.parent.parent.filename), modulePath);
    }

    var files = fs.readdirSync(modulePath);
    for (var i in files) {
        var name = files[i];

        if (recursive && fs.lstatSync(path.join(modulePath, name)).isDirectory()) {
            importerSync({
                path: path.join(modulePath, name),
                recursive: true,
                parent: path.join(parent, name)
            }, handler);
            continue;
        }
        if (name.lastIndexOf('.js') != name.length - 3) continue;

        name = name.substring(0, name.lastIndexOf('.')); // remove ext
        var moduleObj = require(path.join(modulePath, name));
        if (handler) handler(moduleObj, path.join(parent, name));
    }
}

/**
 * Retrieves all sources in a given directory and calls handler.
 * NOTE: Asynchronus.
 *
 * @param options Import options. (or module directory path)
 * @param {eachModule} [handler] Called when import each module.
 */
function importerAsync(options, handler) {
    var modulePath, recursive = false, parent = '';

    if (typeof options === 'string') {
        modulePath = options;

    } else {
        modulePath = options.path;
        recursive = options.recursive || recursive;
        parent = options.parent || parent;
        if (!modulePath) throw new Error("module directory path must be given.");
    }

    // absolute path? or relevant path?
    if (modulePath.indexOf('/') != 0) {
        // relevant. join with parent module's path
        modulePath = path.join(path.dirname(module.parent.parent.filename), modulePath);
    }

    fs.readdir(modulePath, function(err, files) {
        files.forEach(function(name) {
            if (name.lastIndexOf('.js') != name.length - 3) return;

            if (recursive && fs.lstatSync(path.join(modulePath, name)).isDirectory()) {
                importerAsync({
                    path: path.join(modulePath, name),
                    recursive: true,
                    parent: path.join(parent, name)
                }, handler);
            }

            name = name.substring(0, name.lastIndexOf('.')); // remove ext
            var moduleObj = require(path.join(modulePath, name));
            if (handler) handler(moduleObj, path.join(parent, name));
        });
    });
}

/**
 * This handler is called when Importer imports each module object.
 * @callback eachModule
 * @param module Module object. (module.exports in module source)
 * @param name Module name. extension is excluded. (ex: foo.js -> "foo")
 */

/**
 * Use all modules in a directory as a express route.
 * NOTE: you need to export express.Router object in module.
 *
 * @param expressApp Express App Instance
 * @param options Import options. (or module directory path)
 *                 - path : The module directory path. (You can use relavant path)
 *                 - routePath : The path to connect route (default is '/')
 */
function importerExpress(expressApp, options) {
    var importTo = '/';
    if (typeof options === 'object') {
        importTo = options.routePath || importTo;
    }

    importerSync(options, function (router, name) {
        if (name === 'index') expressApp.use(importTo, router);
        expressApp.use(path.join(importTo, name), router);
    });
}

