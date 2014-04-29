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
/*
{ path: './test/folder',
  stat: 
   { node: 
      { dev: 2053,
        mode: 16895,
        nlink: 3,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 646878,
        size: 4096,
        blocks: 8,
        atime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST) },
     size: 4096 } }
{ path: 'test/folder/file1.css',
  stat: 
   { node: 
      { dev: 2053,
        mode: 33206,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 644742,
        size: 9,
        blocks: 8,
        atime: Tue Apr 29 2014 21:00:13 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 21:00:12 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 21:00:12 GMT+0200 (CEST) },
     size: 9 } }
{ path: 'test/folder/file2.css',
  stat: 
   { node: 
      { dev: 2053,
        mode: 33206,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 644743,
        size: 0,
        blocks: 0,
        atime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 21:00:27 GMT+0200 (CEST) },
     size: 0 } }
{ path: 'test/folder/vendor',
  stat: 
   { node: 
      { dev: 2053,
        mode: 16895,
        nlink: 3,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 646876,
        size: 4096,
        blocks: 8,
        atime: Tue Apr 29 2014 20:59:55 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 20:59:10 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 20:59:55 GMT+0200 (CEST) },
     size: 4096 } }
{ path: 'test/folder/vendor/jquery',
  stat: 
   { node: 
      { dev: 2053,
        mode: 16895,
        nlink: 2,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 646877,
        size: 4096,
        blocks: 8,
        atime: Tue Apr 29 2014 20:59:21 GMT+0200 (CEST),
        mtime: Tue Apr 29 2014 20:59:21 GMT+0200 (CEST),
        ctime: Tue Apr 29 2014 20:59:21 GMT+0200 (CEST) },
     size: 4096 } }
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



exports.createDescriptor = function(folderPath, tagBuilder) {

    var tree;

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
        console.log(relativePath)
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
              parentNode[filename] = tagBuilder(stat);
            }
            
            return true;
        }

    }
    
    tree = {};
    
    return fs.listTree(folderPath, buildITagNode).then(function(){
      console.dir(tree)
      return {
        etag: 12,
        content: tree
      };
    });


};
