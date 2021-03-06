const _advFilterPhoto = [
  {
    title: '地形/時間特効',
    subTitle: '特定の地形/時間に特効をもつフォト',
    dataList: [
      {
        labelFull: '地形/時間特効(サバンナ)',
        labelShort: 'サバンナ',
        regex: '(地形|ステージ)がサバンナの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(さばく)',
        labelShort: 'さばく',
        regex: '(地形|ステージ)がさばくの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(みずべ)',
        labelShort: 'みずべ',
        regex: '(地形|ステージ)がみずべの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(寒冷地)',
        labelShort: '寒冷地',
        regex: '(地形|ステージ)が寒冷地の(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(どうくつ)',
        labelShort: 'どうくつ',
        regex: '(地形|ステージ)がどうくつの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(ジャングル)',
        labelShort: 'ジャングル',
        regex: '(地形|ステージ)がジャングルの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(やま)',
        labelShort: 'やま',
        regex: '(地形|ステージ)がやまの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(まち)',
        labelShort: 'まち',
        regex: '(地形|ステージ)がまちの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(夜)',
        labelShort: '夜',
        regex: 'ステージ(|の時間)が夜の(場合|とき)',
      },
    ],
  },
  {
    title: '対・状態異常',
    subTitle: '無効化/耐性付与/解除など対抗手段を与えるフォト',
    dataList: [
      {
        labelFull: '対・状態異常(くらくら)',
        labelShort: 'くらくら',
        regex:
          '((くらくら.*状態にならない|状態異常にならない)|(くらくら.*|全ての状態異常)耐性.*が増加|(くらくら.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(どく)',
        labelShort: 'どく',
        regex:
          '((どく.*状態にならない|状態異常にならない)|(どく.*|全ての状態異常)耐性.*が増加|(どく.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(すやすや)',
        labelShort: 'すやすや',
        regex:
          '((すやすや.*状態にならない|状態異常にならない)|(すやすや.*|全ての状態異常)耐性.*が増加|(すやすや.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(くたくた)',
        labelShort: 'くたくた',
        regex:
          '((くたくた.*状態にならない|状態異常にならない)|(くたくた.*|全ての状態異常)耐性.*が増加|(くたくた.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ひやひや)',
        labelShort: 'ひやひや',
        regex:
          '((ひやひや.*状態にならない|状態異常にならない)|(ひやひや.*|全ての状態異常)耐性.*が増加|(ひやひや.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ズキンズキン)',
        labelShort: 'ズキンズキン',
        regex:
          '((ズキンズキン.*状態にならない|状態異常にならない)|(ズキンズキン.*|全ての状態異常)耐性.*が増加|(ズキンズキン.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(からげんき)',
        labelShort: 'からげんき',
        regex:
          '((からげんき.*状態にならない|状態異常にならない)|(からげんき.*|全ての状態異常)耐性.*が増加|(からげんき.*状態|状態異常)を解除)',
      },
      //はねかえし 回避不可
      //かばう 回避不可
      {
        labelFull: '対・状態異常(ぼんやりうっかり)',
        labelShort: 'ぼんやりうっかり',
        regex:
          '((ぼんやりうっかり.*状態にならない|状態異常にならない)|(ぼんやりうっかり.*|全ての状態異常)耐性.*が増加|(ぼんやりうっかり.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ルンルンきぶん)',
        labelShort: 'ルンルンきぶん',
        regex: 'ルンルンきぶん.*状態を解除',
      },
      {
        labelFull: '対・状態異常(しょんぼりきぶん)',
        labelShort: 'しょんぼりきぶん',
        regex:
          '((しょんぼりきぶん.*状態にならない|状態異常にならない)|(しょんぼりきぶん.*|全ての状態異常)耐性.*が増加|(しょんぼりきぶん.*状態|状態異常)を解除)',
      },
      //ためこみ上手 回避不可
      //コチョコチョマスター 回避不可
      {
        labelFull: '対・状態異常(びりびり)',
        labelShort: 'びりびり',
        regex:
          '((びりびり.*状態にならない|状態異常にならない)|(びりびり.*|全ての状態異常)耐性.*が増加|(びりびり.*状態|状態異常)を解除)',
      },
      //ちぐはぐリズム 詳細不明
    ],
  },
];

export default {
  data() {
    return {
      advFilterPhoto: _advFilterPhoto,
      advFilterPhoto_defaultColumns: ['とくせい(変化前)', 'とくせい(変化後)'],
    };
  },
};
