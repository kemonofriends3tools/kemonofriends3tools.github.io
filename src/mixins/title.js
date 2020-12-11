//https://qiita.com/alice37th/items/002216b16c6823f032ed

/**
 * ページタイトル設定
 * @param pathTitle
 * @returns {string}
 */
export const setTitle = pathTitle => {
  const siteTitle = 'けものフレンズ３ツール';
  const pageTitle = pathTitle ? siteTitle + ' | ' + pathTitle : siteTitle;
  return (window.document.title = pageTitle);
};

/**
 * Description設定
 * @param pathMeta
 */
export const setDescription = pathMeta => {
  const defaultDescription = 'This is initial description.';
  const description = pathMeta ? pathMeta : defaultDescription;
  document.querySelector("meta[name='description']").setAttribute('content', description);
};

//globalに登録しないなら不要か？
export const globalMixins = {
  methods: {
    setTitle,
    setDescription,
  },
};
