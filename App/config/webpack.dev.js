const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',

    devServer: {
        contentBase       : `${__dirname}/dist`,
        port              : 9000,
        publicPath        : '/',
        historyApiFallback: true,
        disableHostCheck  : true,
    },

    module: {
        rules: [
            {
                test   : /\.js$/,
                exclude: /(node_modules)/,
                use    : {
                    loader : 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            'autobind-class-methods',
                            [
                                '@babel/plugin-transform-runtime',
                                {
                                    corejs      : false,
                                    helpers     : true,
                                    regenerator : true,
                                    useESModules: false,
                                },
                            ],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            ['@babel/plugin-transform-async-to-generator', {
                                module: 'bluebird',
                                method: 'coroutine',
                            }],
                            '@babel/plugin-proposal-object-rest-spread',
                        ],
                    },
                },
            },
        ],
    },

    plugins: [
        new WebpackNotifierPlugin({
            title       : 'Logan',
            alwaysNotify: true,
            contentImage: path.resolve(__dirname, 'assets/img/logo.svg'),
        }),
        new webpack.DefinePlugin({ PRODUCTION: JSON.stringify(false) }),
    ],

    output: {
        publicPath: '/',
        filename  : '[name].min.js',
        path      : path.resolve(__dirname, 'dist'),
    },
});
