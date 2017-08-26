var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')


const BABEL_QUERY = {
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
        modulesDirectories: ['node_modules', 'shared'],
        extensions: ['', '.js', '.jsx', '.styl', '.css', '.ico', '.svg']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: BABEL_QUERY
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico|svg)$/,
                exclude: /node_modules/,
                loader: 'file-loader?name=[name].[ext]'
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
        new ExtractTextPlugin('style.css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}