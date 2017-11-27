const glob = require('glob');
// const { testGlob } = require('./package.json');
// const testFiles = glob.sync(testGlob);

module.exports = {
    devtool: 'eval',
    entry: {
        tests: ['core-js/shim', 'mocha-loader!./test/webpack.ts']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            "noEmit": false
                        }
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
    }
}
