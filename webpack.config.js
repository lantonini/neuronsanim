var path = require('path');

module.exports = {
  entry: './src/neuronsanim.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'neuronsanim.min.js',
    library: 'neuronsanim',
    libraryTarget: 'umd'
  }
};
