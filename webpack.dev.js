import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import assign from 'object-assign'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import prodCfg from './webpack.prod.config.js'

Object.assign = assign

const BABEL_QUERY = {
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
        ['transform-es2015-parameters'],
        [
            'react-transform',
            {
                transforms: [
                    {
                        transform: 'react-transform-hmr',
                        imports: ['react'],
                        locals: ['module']
                    }
                ]
            }
        ]
    ]
}

export default function (app) {
    const config = Object.assign(prodCfg, {
        devtool: (process.env.NODE_SOURCEMAP === 'eval') ? 'eval' : 'inline-source-map',
        entry: [
            'webpack-hot-middleware/client',
            './client'
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: BABEL_QUERY
                },
                {
                    test: /main\.styl$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                },
                {
                    test: /\.(jpg|jpeg|gif|png|ico)$/,
                    exclude: /node_modules/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }
            ]
        },
        plugins: [
            new LodashModuleReplacementPlugin({ // OptIn, see https://www.npmjs.com/package/lodash-webpack-plugin
                'paths': true,
                'guards': true
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en|de)/),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    })

    const compiler = webpack(config)

    app.use(webpackDevMiddleware(compiler, { noInfo: true }))
    app.use(webpackHotMiddleware(compiler))
}
