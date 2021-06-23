module.exports = {
    publicPath: './',
    outputDir: 'dist',
    lintOnSave: true,
    runtimeCompiler: true, //关键点在这
    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
    chainWebpack: () => {},
    configureWebpack: () => {},
    // 配置 webpack-dev-server 行为。
    devServer: {
        open: process.platform === 'darwin',
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        proxy: {
            '/': {
                ws: false,
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        },
        before: app => {}
    }
}