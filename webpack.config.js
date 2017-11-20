const glob = require('glob');

const { testGlob } = require('./package.json');
const testFiles = glob.sync(testGlob);
module.exports = {
    // devtool: 'source-map',
    devtool: 'eval',
    entry: {
        // demos: ['./demo/index.tsx'],
        tests: [...testFiles.map(fileName => `mocha-loader!${fileName}`)]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        "declaration": false
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: '[name].js',
        pathinfo: true
    },
    devServer: {
        disableHostCheck: true
    }
}