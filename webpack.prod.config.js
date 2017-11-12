var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var clientConfig = require('config').get('client')
var fs = require('fs')
// var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')


fs.writeFileSync(path.resolve(__dirname, 'config/client.json'), JSON.stringify(clientConfig))

var BABEL_QUERY = {
    presets: [
        'nodejs6',
        'stage-0',
        'react'
    ],
    plugins: [
        ['lodash'],
        ['transform-object-rest-spread'],
        ['transform-class-properties'],
        ['transform-decorators-legacy'],
        ['transform-es2015-parameters']
    ]
}


module.exports = {
    entry: [
        './client'
    ],
    resolve: {
        modules: ['node_modules', 'shared'],
        extensions: ['.js', '.jsx', '.styl', '.css', '.ico', '.svg', '.json', '.png'],
        alias: {
            config: path.resolve(__dirname, 'config/client.json'),
            img: path.resolve(__dirname, 'shared/static/img/')
        }
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: BABEL_QUERY
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'stylus-loader']
                })
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    node: {
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
        fs: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin({ filename: 'style.css' }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/),
        // new LodashModuleReplacementPlugin({ // OptIn, see https://www.npmjs.com/package/lodash-webpack-plugin
        //     'paths': true,
        //     'guards': true,
        //     'collections': true
        // }),
        new UglifyJSPlugin({
            ecma: 6
        })
    ]
}