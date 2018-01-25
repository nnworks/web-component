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

    compiler.plugin('emit', function(compiler, callback) {
      console.log("The webpack build process is emitting!!!");

      console.log(this.cssFilesToBundle);

      callback();
    });
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