const path = require('path');
const AwsSamPlugin = require('aws-sam-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const sass = require('sass');

const awsSamPlugin = new AwsSamPlugin({ vscodeDebug: false });
const lambdaName = "NearestAtfFunction"; // must correspond to lambda name in template.yml

module.exports = {
  entry: () => awsSamPlugin.entry(),
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: path.resolve('.')
  },
  resolve: {
      extensions: ['.ts', '.js']
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [{ fsevents: "require('fsevents')" }],
  module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
    ]
  },
  plugins: [
    awsSamPlugin,
    new CopyPlugin({
      patterns: [
        { from: './simple-proxy-api.yml', to: '.aws-sam/build/simple-proxy-api.yml' },
        { from: './src/views', to: `.aws-sam/build/${lambdaName}/views` },
        { from: './node_modules/govuk-frontend', to: `.aws-sam/build/${lambdaName}/views/govuk-frontend` },
        { from: './node_modules/govuk-frontend/dist/govuk/assets', to: `.aws-sam/build/${lambdaName}/public/assets` },
        { from: './node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js', to: `.aws-sam/build/${lambdaName}/public/all.js` },
        { from: './node_modules/@dvsa/cookie-manager/cookie-manager.js', to: `.aws-sam/build/${lambdaName}/public/cookie-manager.js` },
        {
          from: './src/public/scss/index.scss',
          to: `.aws-sam/build/${lambdaName}/public/all.css`,
          // trasnform compile sass to css
          // Note: This is a synchronous operation, so it may block the build process.
          transform: (content, path) => {
            const result = sass.compileString(content.toString(), {
              loadPaths: ['./src/public/scss/'],
              style: 'compressed',
            });
            return result.css.toString();
          }
        },
      ],
    }),
  ],
};
