class LinkedCssBundlerPlugin {

  constructor(options) {
    this.loaderOptions = options;
    this.loaderOptions.pluginInstance = this;

    this.cssFilesToBundle = [];
  }

  apply(compiler) {
    const loaderOptions = this.loaderOptions;
    compiler.plugin('run', function(compiler, callback) {
      console.log("The webpack build process is starting!!!");

      callback();
    });

    /**
     * Build a module with all the required styles sheet files as dependencies
     */
    compiler.plugin('emit', function(compilation, callback) {

      var module = "";
      this.cssFilesToBundle.forEach(function(cssFile, index, filesToBundle) {
        module += "import(\"" + cssFile + "\");";
      }.bind(this))

      var moduleBuffer = new Buffer(module);
      // compilation.assets[this.loaderOptions.cssBundleName] = {
      //   source: () => moduleBuffer,
      //   size: () => moduleBuffer.length,
      // };

      callback();
    }.bind(this));
  }

  /**
   * For the loader to add found css style files
   * @param cssFileName
   */
  addLinkedStyleResource(cssFileName) {
    this.cssFilesToBundle.push(cssFileName);
  }

  /**
   * returns the loader with the options as given to the constructor of this class
   * @returns {loader, options}
   */
  loader() {
    console.log("LinkedCssBundlerPlugin - loader called");
    return { loader: require.resolve('./linked-css-bundler-loader'), options: this.loaderOptions};
  }
}



module.exports = LinkedCssBundlerPlugin;