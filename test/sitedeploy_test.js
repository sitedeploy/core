'use strict';

var q = require('q');
var should = require('should');
var sm = require("../lib/sitedeploy-core");

function tagBuilder(path, stat) {
    return q.fcall(function() {
        return 12;
    });
}

describe("sm", function() {
    it("is defined", function() {

        sm.should.be.type('object');


    });

    describe("crc32TagBuilder", function() {
        var tag;
        before(function(done) {


            sm.crc32TagBuilder('./test/folder/file1.css', {
                size: 9
            }, {
                size: 0
            }).then(function(crc) {
                tag = crc;
                done();
            }).
            catch (done);
        });
        it("is defined", function() {
            sm.crc32TagBuilder.should.be.type('function');

        });
        it("return a tag", function() {
            tag.should.be.eql({
                tag: "49d8d999",
                size: 9
            });

        });
    });

    describe("createDescriptor", function() {
        var descriptor;
        before(function(done) {


            sm.createDescriptor('./test/folder').then(function(folder) {
                descriptor = folder;
                done();
            }).
            catch (done);
        });

        it("is defined", function() {
            sm.createDescriptor.should.be.type('function');

        });

        it("return correct descriptor", function() {
            console.log(JSON.stringify(descriptor, null, "\t"))
            descriptor.should.be.eql({
                etag: "41d912ff",
                size: 30,
                content: {
                    vendor: {
                        jquery: {
                            "jquery.js": {
                                tag: "0d4c0e15",
                                size: 16
                            }
                        }
                    },
                    "file1.css": {
                        tag: "49d8d999",
                        size: 9
                    },
                    "file2.css": {
                        tag: "07ee315f",
                        size: 5
                    }
                }
            });
        });
    });
});
