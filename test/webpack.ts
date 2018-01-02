import './polyfills';
// https://webpack.js.org/guides/dependency-management/#require-context
// the following is used an an entry point for karma (that runs karma-webpack)

const contextModule = require.context('./', true, /.+\.spec\.ts[x]?$/);
contextModule.keys().forEach(contextModule);
