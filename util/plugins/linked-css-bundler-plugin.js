class LinkedCssBundlerPlugin {
  constructor(options) {
    this.sharedOptions = options;
    this.sharedOptions.linkedCssFiles = [];
  }

  apply(compiler) {
    const loaderOptions = this.sharedOptions;
    compiler.plugin('run', function(compiler, callback) {
      console.log("The webpack build process is starting!!!");

      callback();
    });

    compiler.plugin('emit', function(compiler, callback) {
      console.log("The webpack build process is emitting!!!");

      console.log(loaderOptions);

      callback();
    });

    compiler.plugin('this-compilation', function (compilation) {
      compilation.plugin('normal-module-loader', function (loaderContext, module) {
        console.log("normal-module-loader");
        //console.log(loaderContext);
      });
    });
  }

  loader() {
    console.log("LinkedCssBundlerPlugin - loader called");
    return { loader: require.resolve('./linked-css-bundler-loader'), options: this.sharedOptions};
  }
}



module.exports = LinkedCssBundlerPlugin;