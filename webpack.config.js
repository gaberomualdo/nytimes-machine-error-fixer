const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Handlebars = require('handlebars');

const handlebarsInput = {};
Handlebars.registerHelper('page', function (page, block) {
  const pages = {
    home: 'Example Fixes from Famous Articles',
    tryit: 'Try it Yourself',
    about: 'About',
  };

  const modMS = (filename) => fs.statSync('dist/main.css').mtime.getTime();

  const isPage = (idx) => Object.keys(pages).indexOf(page) === idx;

  return new Handlebars.SafeString(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>NY Times 70s Transcription Fixes &bull; ${pages[page]}</title>
      <link rel="stylesheet" href="main.css?v=${modMS('dist/main.css')}" />
    </head>
    <body>
      <nav>
        <div class="logo"><a href="/">NY Times 70s Transcription Fixes</a></div>
        <ul>
          <a href="/" class="${isPage(0) ? 'on' : ''}">Example Fixes From Famous Articles</a>
          <a href="tryit.html" class="${isPage(1) ? 'on' : ''}">Try it Yourself</a>
          <a href="about.html" class="${isPage(2) ? 'on' : ''}">About</a>
        </ul>
      </nav>

      <main class='main'>
        <div class="container">
          ${block.fn(this)}
        </div>
      </main>

      <!-- scripts -->
      <script src="main.js?v=${modMS('dist/main.js')}"></script>
    </body>
  </html>`);
});

module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    watch: true,

    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
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
                name: '[name].html',
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
  },
  {
    entry: './src/serviceWorker/sw-compiled.js',
    output: {
      filename: 'service-worker.js',
      path: path.resolve(__dirname, 'dist'),
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
