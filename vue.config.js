const webpack = require("webpack");
const path = require("path");
const WebpackCdnUploadPlugin = require("webpack-cdn-upload-plugin")
const pkgVersion = require('./package.json').version;
const pkgName = require('./package.json').name;
const axios = require("axios")

module.exports = {
    runtimeCompiler: true,
    transpileDependencies: ['vue-clamp', 'resize-detector', 'vuex-persist'],
    configureWebpack: {
        devtool: 'source-map'
    },
    css: {
        extract: false,
    },
    chainWebpack: config => {
        config.module.rules.delete('eslint')
        if (process.env.NODE_ENV === "development") {
            config.entry("app").clear().add("./src/main.js").end();
        } else if (process.env.NODE_ENV === "production") {
            config.entry("app").clear().add("./src/main.production.js").end();
        }
        //we import the minimum for moment
        //(and we will have to add moment/locale/fr and moment/locale/en-gb with ContextReplacementPlugin)
        config.resolve.alias.set(
            "moment",
            path.resolve("node_modules/moment/src/moment")
        );
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            return {
                optimization: {
                    splitChunks: false
                },
                plugins: [
                    new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
                        if (/\/moment\//.test(context.context)) {
                            Object.assign(context, {
                                regExp: /fr.js|en-gb.js/,
                                request: "../../locale"
                            });
                        }
                    }),
                    //send to the web server cdn
                    new WebpackCdnUploadPlugin({
                        async upload(content, name) {
                            if (name.endsWith(".map")) {
                                //We ignore sourcemap file
                                return;
                            }
                            let repo = "release";
                            if (pkgVersion.toLowerCase().endsWith("snapshot")) {
                                repo = "snapshot"
                            }
                            let url = "https://services.aeris-data.fr/cdn/jsrepo/v1_0/webpackupload/sedoo/" + repo + "/" + pkgName + "/" + pkgVersion
                            console.log(url)
                            await axios({
                                method: 'post',
                                url: url,
                                headers: {},
                                data: {
                                    content: content
                                }
                            });
                            url = url.replace('webpackupload', 'download')
                            return url;
                        },
                    }),
                ]
            };
        }
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    },
};