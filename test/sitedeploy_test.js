'use strict';

var expect = require("expect.js");
var sitemodule_core = require("../lib/sitedeploy-core");


describe("sitemodule_core", function () {
    it("is defined", function () {
        expect(sitemodule_core).to.be.an('object');
    });
});
