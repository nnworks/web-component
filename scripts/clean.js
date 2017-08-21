var fs = require("fs");
var path = require("path");
var config = require("../config/buildconfig.json");


var clean = function () {
  config.targets.forEach(function (targetPath, i) {

    function rmRecursive(targetPath) {
      if (fs.existsSync(targetPath)) {
        // empty folder recursively
        fs.readdirSync(targetPath).forEach(function (file, index) {
          var curPath = path.join(targetPath, file);
          if (fs.lstatSync(curPath).isDirectory()) { // recurse
            rmRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });

        fs.rmdirSync(targetPath);
      }
    };

    rmRecursive(targetPath);

  });
};


module.exports = {
  clean: clean,
};
