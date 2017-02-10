var path = require('path');

var _root = path.resolve(__dirname, '..');

function root(args) {
  console.log('root args', args);
  args = Array.prototype.slice.call(arguments, 0);
  const x = path.join.apply(path, [_root].concat(args));
  console.log('root', x);
  return x;
}

exports.root = root;
