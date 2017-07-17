import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import assign from 'object-assign'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import prodCfg from './webpack.prod.config.js'

Object.assign = assign

const BABEL_QUERY = {
    presets: ['nodejs6', 'stage-0', 'react'],
    plugins: [
        ['lodash'],
        ['transform-object-rest-spread'],
        ['transform-class-properties'],
        ['transform-decorators-legacy'],
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
        devtool: (process.env.NODE_SOURCEMAP == 'eval') ? 'eval' : 'inline-source-map',
        entry: [
            'webpack-hot-middleware/client',
            './client'
        ],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: BABEL_QUERY
                },
                {
                    test: /main\.styl$/,
                    loader: 'style-loader!css-loader!stylus-loader'
                },
                {
                    test: /\.(jpg|jpeg|gif|png|ico)$/,
                    exclude: /node_modules/,
                    loader: 'file-loader?name=[name].[ext]'
                }
            ]
        },
        plugins: [
            new LodashModuleReplacementPlugin({ // OptIn, see https://www.npmjs.com/package/lodash-webpack-plugin
                'paths': true,
                'guards': true
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ]
    })

    const compiler = webpack(config)

    app.use(webpackDevMiddleware(compiler, { noInfo: true }))
    app.use(webpackHotMiddleware(compiler))
}
