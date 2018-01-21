"use strict";


function test(content, map, meta) {

  this.cacheable();

  console.log(this.request);
  console.log(content);

  return "module.export = " + content;
}

module.exports = test;