# sitedeploy-core
[![Build Status](https://secure.travis-ci.org/sitedeploy/core.png?branch=master)](http://travis-ci.org/sitedeploy/core)  [![Npm module](https://badge.fury.io/js/core.png)](https://npmjs.org/package/core) [![Code Climate](https://codeclimate.com/github/sitedeploy/core.png)](https://codeclimate.com/github/sitedeploy/core)

sitedeploy core libraries

## Getting Started
Install the module with: `npm install sitedeploy-core --save`

```javascript
var sm = require('sitedeploy-core');

//create a sitedeploy folder descriptor:
var folder = sm.createDescriptor('static/css'); 
console.dir(folder)

/*

{
    "etag": 12,
    "content": {
        "vendor": {
            "jquery": {
                "jquery.js": "0d4c0e15"
            }
        },
        "file1.css": "49d8d999",
        "file2.css": "07ee315f"
    }
}
*/
 
```

The sitedeploy folder descriptor file is used for multiple purposes. First 
it is used by the connect middleware to check when to serve a new version 
of a folder to the client.

Descriptor could be cached in memory, but old version could be saved 
to disk, to compare different versions and build a patch release.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.


## License
Copyright (c) 2014 Andrea Parodi  
Licensed under the MIT license.
