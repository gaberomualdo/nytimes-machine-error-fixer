const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Handlebars = require('handlebars');

const handlebarsInput = {};
Handlebars.registerHelper('page', function (page, block) {
  const pages = {
    index: 'Example Fixes from Famous Articles',
    tryit: 'Try it Yourself',
    about: 'About',
  };

  const modMS = (filepath) => {
    try {
      return fs.statSync(filepath).mtime.getTime();
    } catch (err) {
      return Math.floor(Math.random() * 10000);
    }
  };

  const isPage = (idx) => Object.keys(pages).indexOf(page) === idx;

  return new Handlebars.SafeString(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="description" content="An automated tool that fixes extra-space errors in transcribed New York Times articles from the early 1970s." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>NY Times 70s Transcription Fixes &bull; ${pages[page]}</title>
      <link rel="stylesheet" href="global.css?v=${modMS('site/global.css')}" />
      <link rel="stylesheet" href="${page}.css?v=${modMS('site/' + page + '.css')}" />

      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
      <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
      <link rel="manifest" href="/manifest.json">
      <meta name="msapplication-TileColor" content="#ffffff">
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
      <meta name="theme-color" content="#ffffff">
    </head>
    <body>
      <div class='nav-placeholder'></div>
      <nav>
        <div class='inner'>
          <div class="logo"><a href="/">NY Times <span class="no-display-mobile">'70s</span> Transcription Fixes</a></div>
          <button class="mobile-link-toggle" onclick="document.querySelector('nav').classList.toggle('mobile-links-open')" aria-label="Toggle Menu">
            <svg class="open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></svg>
            <svg class="close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
          </button>
          <div class="links">
            <a href="/" class="${isPage(0) ? 'on' : ''}">Example Fixes From Famous Articles</a>
            <a href="tryit.html" class="${isPage(1) ? 'on' : ''}">Try It Yourself</a>
            <a href="about.html" class="${isPage(2) ? 'on' : ''}">About</a>
          </div>
        </div>
      </nav>

      <main class='main'>
        <div class="container">
          ${block.fn(this)}
        </div>
      </main>

      <!-- scripts -->
      ${
        // tryit page loads script dynamically
        page !== 'tryit'
          ? `<script src="${page}.js?v=${modMS('site/' + page + '.js')}"></script>`
          : `
        <script>
          window.addEventListener('load', () => {
            const script = document.createElement('script');
            script.onload = () => {
              document.querySelector('.container .text-box').classList.add('loaded');
            };
            script.src = '${page}.js?v=${modMS('site/' + page + '.js')}';

            document.head.appendChild(script);
          });
        </script>
        `
      }

      <!-- Service Worker (currently not added because of caching limits) -->
      <script>
      // if ('serviceWorker' in navigator) {
      //   window.addEventListener('load', () => {
      //     navigator.serviceWorker.register('service-worker.js')
      //   });
      // }
      </script>
    </body>
  </html>`);
});

const createJSFileConfig = (filename) => {
  const filenameNoExt = filename.split('.')[0];
  return {
    entry: './src/' + filename,
    output: {
      filename: filename,
      path: path.resolve(__dirname, 'site'),
    },
    mode: 'production',
    watch: true,

    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: filenameNoExt + '.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {},
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        },
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: filenameNoExt + '.html',
              },
            },
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                attributes: false,
                preprocessor: (content, loaderContext) => {
                  let result;

                  try {
                    result = Handlebars.compile(content)(handlebarsInput);
                  } catch (error) {
                    loaderContext.emitError(error);
                    return content;
                  }

                  return result;
                },
              },
            },
          ],
        },
      ],
    },
  };
};

module.exports = [
  createJSFileConfig('global.js'),
  createJSFileConfig('index.js'),
  createJSFileConfig('about.js'),
  createJSFileConfig('tryit.js'),
  {
    entry: './src/serviceWorker/sw-compiled.js',
    output: {
      filename: 'service-worker.js',
      path: path.resolve(__dirname, 'site'),
    },
    mode: 'production',
    watch: true,

    optimization: {
      minimizer: [new TerserJSPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        },
      ],
    },
  },
];
