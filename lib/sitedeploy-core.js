/*
 * sitemodule-core
 * https://github.com/sitedeploy/core
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var q = require("q");
var fs = require("q-io/fs");
var path = require("path");
var crc32 = require('buffer-crc32');
/*
{ path: 'test/folder/vendor/jquery/jquery.js',
  stat: 
   { node: 
      { dev: 2053,
        mode: 33206,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 643709,
        size: 0,
        blocks: 0,
        atime: Tue Apr 29 2014 21:08:43 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 20:59:21 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 20:59:21 GMT+0200 (CEST) },
     size: 0 } }

 */

exports.crc32TagBuilder = fileInfoBuilder

function fileInfoBuilder(path, stat, totals) {

    return fs.read(path, "b")
        .then(function(content) {
            var crc = crc32(content);
            var buffs = [crc];
            if (totals.buf) {
                buffs.push(totals.buf);
            }
            totals.buf = new Buffer(buffs);
            totals.size += stat.size;
            
            return {

                tag: crc.toString("hex"),
                size: stat.size
            };
        })

}

exports.createDescriptor = function(folderPath) {
    var tree;
    var totals;
    var tagPendings = [];




    function mkGetPath(pathSegments) {
        var current = tree;
        pathSegments.forEach(function(segment) {
            if (segment in current) {
                current = current[segment];
            } else {
                current[segment] = {};

                current = current[segment];
            }
        });

        return current
    }


    function buildITagNode(filePath, stat) {

        var relativePath = path.relative(folderPath, filePath);
        //console.log(relativePath)
        var pathSegments = relativePath.split('/');
        var filename = pathSegments.pop();


        var parentNode = mkGetPath(pathSegments);
        if (stat.isDirectory()) {
            if (filename) {
                parentNode[filename] = {};
            }

            return false;
        } else {
            if (filename) {
                var tagPromise = fileInfoBuilder(filePath, stat, totals).then(function(tag) {

                    parentNode[filename] = tag;
                });
                tagPendings.push(tagPromise);
            }

            return true;
        }

    }

    totals = {
      size:0
    };
    tree = {};
    return fs.listTree(folderPath, buildITagNode).then(function() {

        return q.all(tagPendings).then(function() {
            var crc = crc32(totals.buf);

            return {
                etag: crc.toString("hex"),
                size: totals.size,
                content: tree
            };
        });
    });


};
