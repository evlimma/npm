const path = require('path');

module.exports = {
    mode: 'production', // ou 'production' ou 'development' ou 'none'
    entry: {
        main: ['./src/index.js']
    },
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }
        ],
    },
    optimization: {
        minimize: true
    }
};
