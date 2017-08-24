var fs = require("fs");
var path = require("path");


var clean = function (targets) {
  targets.forEach(function (targetPath, i) {

    function rmRecursive(targetPath) {
      if (fs.existsSync(targetPath)) {
        if (fs.lstatSync(targetPath).isDirectory()) { // recurse
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
        } else {
          fs.unlinkSync(targetPath);
        }
      }
    };

    rmRecursive(targetPath);

  });
};


module.exports = {
  clean: clean,
};
