class MonitoringPlugin {

  constructor(options) {
  }

  apply(compiler) {

    /**
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {


      callback();
    }.bind(this));
  }

}



module.exports = MonitoringPlugin;