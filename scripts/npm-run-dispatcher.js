#!/usr/bin/env node

var version = "1.0.0";
var minimist = require("minimist");
var sass = require("./sass-transpiler.js");

var unknownHandler = function(option) {
    console.log("Unknown parameter: " + option);
}

var minimistOpts = {
    default: {opt1: "value1", opt2: "value2", opt3: false},
    alias:   {
        1: "opt1",
        2: "opt2",
        3: "opt3"
    },
    string:  ["opt1", "opt2"],
    boolean: ["opt3"],
    unknown: unknownHandler
}

var argv = minimist(process.argv.slice(2), minimistOpts);

sass.processInline();

console.log(argv);


