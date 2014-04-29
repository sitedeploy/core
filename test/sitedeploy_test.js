'use strict';

var should = require('should');
var sm = require("../lib/sitedeploy-core");

function tagBuilder(stat){
  return 12;
}

describe("sm", function() {
    it("is defined", function() {

        sm.should.be.type('object');


    });

    describe("createDescriptor", function() {
        var descriptor;
        before(function(done) {
           

            sm.createDescriptor('./test/folder',tagBuilder).then(function(folder) {
                descriptor = folder;
                done();
            }).
            catch (done);
        });

        it("is defined", function() {
            sm.createDescriptor.should.be.type('function');
            
        });

        it("return correct descriptor", function() {
            descriptor.should.be.eql({

                'etag': '12',
                content: {
                    'file1.css': '12',
                    'file2.css': '12',
                    'vendor': {
                        jquery: {
                            'jquery.js': '12'
                        }
                    }
                }

            });
        });
    });
});
