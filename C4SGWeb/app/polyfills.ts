import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');
// import 'reflect-metadata';

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
