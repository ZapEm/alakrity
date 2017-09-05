var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var clientConfig = require('config').get('client')
var fs = require('fs')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')


fs.writeFileSync(path.resolve(__dirname, 'config/client.json'), JSON.stringify(clientConfig))

var BABEL_QUERY = {
    presets: ['nodejs6', 'es2015', 'stage-0', 'react'],
    plugins: [
        ['lodash'],
        ['transform-object-rest-spread'],
        ['transform-class-properties'],
        ['transform-decorators-legacy'],
        ['transform-es2015-parameters']
        // [
        //     'react-transform',
        //     {
        //         transforms: [
        //             {
        //                 transform: 'react-transform-hmr',
        //                 imports:    ['react'],
        //                 locals:     ['module']
        //             }
        //         ]
        //     }
        // ]
    ]
}


module.exports = {
    entry: [
        './client'
    ],
    resolve: {
        modules: ['node_modules', 'shared'],
        extensions: ['.js', '.jsx', '.styl', '.css', '.ico', '.svg', '.json'],
        alias: {
            config: path.resolve(__dirname, 'config/client.json')
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
                test: /\.(jpg|jpeg|gif|png|ico|svg)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
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
        new ExtractTextPlugin({ filename: 'style.css' }),
        new LodashModuleReplacementPlugin({ // OptIn, see https://www.npmjs.com/package/lodash-webpack-plugin
            'paths': true,
            'guards': true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en|de)/),
        new webpack.optimize.UglifyJsPlugin()
    ]
}