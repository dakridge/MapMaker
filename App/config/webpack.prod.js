const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'source-map',

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({ PRODUCTION: JSON.stringify(true) }),
    ],

    output: {
        filename: '[name].min.js',
        path    : path.resolve('.././docs'),
    },
});
