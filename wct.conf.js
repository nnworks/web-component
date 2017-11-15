const config = {
  suites: ["test/**/*"],
  plugins: {
    local: {
      browsers: ["chrome"]
    }
  },
  webserver: {
    pathMappings: [
      {'/components': '/tjah'},
    ],
    verbose: true
  },

  npm: false,
  verbose: false,
  persistent: true,
};

module.exports = config;