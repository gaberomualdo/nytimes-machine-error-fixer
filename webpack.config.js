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
    </head>
    <body>
      <nav>
        <div class='inner'>
          <div class="logo"><a href="/">NY Times '70s Transcription Fixes</a></div>
          <div class="links">
            <a href="/" class="${isPage(0) ? 'on' : ''}">Example Fixes From Famous Articles</a>
            <a href="tryit.html" class="${isPage(1) ? 'on' : ''}">Try it Yourself</a>
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
