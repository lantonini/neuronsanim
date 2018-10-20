var path = require('path');

module.exports = {
  entry: './src/neuronsanim.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'neuronsanim.min.js'
  },
  externals: {
    pixi: "pixi.js"
  }
};
