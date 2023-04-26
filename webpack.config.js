const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const getConfig = (mode, target, devtool) => {
    const configs = [];

    glob.sync(`./src/*/*.html`).forEach((file) => {
        const folderPath = path.dirname(file);
        const folderName = folderPath.replace('src\\', '');

        // entries[folderName] = `./${folderPath}\\script.js`;

        const config = {
            mode,
            target,
            devtool,
            entry: {
                [folderName]: path.resolve(__dirname, 'src', folderName, 'script.js'),
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                clean: true,
                filename: '[name].js',
                publicPath: '/',
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: file,
                    filename: '[name].html',
                    inject: 'body',
                    inlineSource: '.(js)$',
                    cache: false,
                }),
                new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
            ],
            module: {
                rules: [
                    {
                        test: /\.html$/i,
                        loader: 'html-loader',
                    },
                    {
                        test: /\.css$/i,
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: { postcssOptions: { plugins: [require('postcss-preset-env')] } },
                            },
                        ],
                    },
                    {
                        test: /\.(?:js|mjs|cjs)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', { targets: 'defaults' }]],
                            },
                        },
                    },
                ],
            },
        };

        configs.push(config);
    });

    return configs;
};

module.exports = (env) => {
    const mode = env.production ? 'production' : 'development';
    const devMode = mode === 'development';
    const target = devMode ? 'web' : 'browserslist';
    const devtool = devMode && 'source-map';

    return getConfig(mode, target, devtool);
};
