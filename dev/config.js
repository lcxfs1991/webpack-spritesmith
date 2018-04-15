var path = require('path');

var SpritesmithPlugin = require('../lib/Plugin');
const myTemplates = require('./customTemplate');

module.exports = {
    entry: path.resolve(__dirname, 'src/entry.js'),

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },

    mode: "development",

    module: {
        rules: [
            {test: /\.styl$/, loaders: [
                'style-loader',
                'css-loader',
                'stylus-loader'
            ]},
            {test: /\.png$/, loaders: [
                'file-loader?name=i/[hash].[ext]'
            ]}
        ]
    },

    resolve: {
        modules: ["web_modules", "node_modules", "generated"]
    },

    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src'),
                glob: '**/ico/*.png'
            },
            target: {
                image: path.resolve(__dirname, 'src/generated/sprite.[hash:6].png'),
                css: [
                    path.resolve(__dirname, 'src/generated/sprite.styl'),
                    path.resolve(__dirname, 'src/generated/sprite.json'),
                    path.resolve(__dirname, 'src/generated/sprite.css'),
                    [path.resolve(__dirname, 'src/generated/sprite-custom.css'), {
                        format: 'custom_format'
                    }],
                    [path.resolve(__dirname, 'src/generated/sprite-custom-2.css'), {
                        format: 'custom_handlebars'
                    }]
                ]
            },
            apiOptions: {
                generateSpriteName: function (fileName) {
                    var parsed = path.parse(fileName);
                    var dir = parsed.dir.split(path.sep);
                    var moduleName = dir[dir.length - 2];
                    return moduleName + '__' + parsed.name;
                },
                cssImageRef: '~sprite.[hash:6].png',
                handlebarsHelpers: {
                    helperExample: (x) => 10 * x
                }
            },
            //retina: '@2x',
            spritesmithOptions: {
                padding: 10
            },
            customTemplates: {
                'custom_format': myTemplates.customFormat,
                'custom_format_retina': myTemplates.customFormatRetina,
                'custom_handlebars': path.resolve(__dirname, './custom.handlebars')
            }
        })
    ]
};
