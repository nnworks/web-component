var config = {
  suites: ["test/**/*"],
  plugins: {
    local: {
      browsers: ["firefox"]
    }
  },
  webserver: {
    pathMappings: [
      {'/tja': '/'},
    ],
    verbose: true
  },

  npm: false,
  verbose: false,
  persistent: true,
};

module.exports = config;