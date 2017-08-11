var fs =     require('fs');
var path =   require('path');
var config = require('../config/sass-transpiler.json');


var processInline = function(){
    config.src.forEach(function(srcPath) {
            fs.readdirSync(srcPath).forEach(function (file) {
                console.log(path.extname(file));
            })
    });
}

module.exports = {
    processInline: processInline
}

