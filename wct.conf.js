const config = {
  suites: ["test/**/*"],
  plugins: {
    local: {
      browsers: ["firefox"]
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
