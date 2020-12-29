module.exports = {
  //publicPath Default: '/'
  // publicPath: './',

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'けものフレンズ３ツール',
    },
  },

  // process.env.NODE_ENVは特に定義していない。.env.development等を作成して定義すれば以下のようにENVでSourceMap有無を分岐させられる。
  // productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  productionSourceMap: false,
  pluginOptions: {
    //build時にwebpackBundleAnalyzerのreport.htmlを自動で開かないようにする
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};
