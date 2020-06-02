const path = require('path')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer

module.exports = {
    configureWebpack: {
        plugins: [
            new PrerenderSpaPlugin({
              // Absolute path to compiled SPA
              staticDir: path.join(__dirname, 'dist'),
              // List of routes to prerender
              routes: [ '/', '/todo', '/stats', '/social', '/inv', '/langs', '/commands', '/serverstats', '/imprint','/PageNotFound', '/Forbidden'],
              renderer: new Renderer({
                injectProperty: '__PRERENDER_INJECTED',
                inject: {
                  prerendered: true
                },
                renderAfterDocumentEvent: 'app.rendered',
              },)
            })
          ]
    }
  }