const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: `${__dirname}/..`,

    entry: {
        app: ['./src/index.js'],
    },

    resolve: {
        modules   : [path.resolve('./src'), path.resolve('./'), 'node_modules'],
        extensions: ['.js', '.styl', '.svg'],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test  : /[\\/]node_modules[\\/]/,
                    name  : 'vendors',
                    chunks: 'all',
                },
            },
        },
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
                            [
                                '@babel/plugin-transform-runtime',
                                {
                                    corejs      : false,
                                    helpers     : true,
                                    regenerator : true,
                                    useESModules: false,
                                },
                            ],
                            'autobind-class-methods',
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

            {
                test: /\.svg$/,
                use : [
                    { loader: 'react-svg-loader' },
                ],
            },

            {
                test: /\.styl$/,
                use : [
                    { loader: 'style-loader' }, // creates style nodes from JS strings
                    { loader: 'css-loader', options: { modules: true } }, // translates CSS into CommonJS
                    { loader: 'stylus-loader' }, // stylus
                ],
            },

            {
                test: /\.hbs$/,
                use : [
                    { loader: 'handlebars-loader' },
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin([path.resolve('./dist')]),
        new CopyWebpackPlugin([
            { from: path.resolve('./assets/img/favicons'), to: path.resolve('./dist') },
        ]),
        new HtmlWebpackPlugin({
            title         : 'Logan',
            filename      : 'index.html',
            chunks        : ['vendors', 'app'],
            template      : path.resolve('./src/app.hbs'),
            chunksSortMode: 'manual',
            hash          : true,
            favicon       : path.resolve('./assets/img/favicons/favicon.ico'),
        }),
    ],
};
