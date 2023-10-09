const path = require('path');

module.exports = {
  // Your existing Webpack configuration options
    mode: 'development',
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"), 
            "os": require.resolve("os-browserify")
        }
    }
}