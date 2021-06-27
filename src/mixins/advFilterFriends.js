const _advFilterFriends = [
  {
    title: '地形/時間特効',
    subTitle: '特定の地形/時間に特効をもつフレンズ',
    dataList: [
      {
        labelFull: '地形/時間特効(サバンナ)',
        labelShort: 'サバンナ',

        regex: 'サバンナの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(さばく)',
        labelShort: 'さばく',

        regex: 'さばくの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(みずべ)',
        labelShort: 'みずべ',

        regex: 'みずべの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(寒冷地)',
        labelShort: '寒冷地',

        regex: '寒冷地の(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(どうくつ)',
        labelShort: 'どうくつ',

        regex: 'どうくつの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(ジャングル)',
        labelShort: 'ジャングル',

        regex: 'ジャングルの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(やま)',
        labelShort: 'やま',

        regex: 'やまの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(まち)',
        labelShort: 'まち',

        regex: 'まちの(場合|とき)',
      },
      {
        labelFull: '地形/時間特効(夜)',
        labelShort: '夜',

        regex: 'ステージ(|の時間)が夜の(場合|とき)',
      },
    ],
  },
  {
    title: '状態異常付与/特殊行動実行',
    subTitle: '状態異常を付与したり、特殊な行動を行えるフレンズ',
    dataList: [
      {
        labelFull: '状態異常付与/特殊行動実行(くらくら)',
        labelShort: 'くらくら',
        regex: 'くらくら状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(どく)',
        labelShort: 'どく',
        regex: 'どく状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(すやすや)',
        labelShort: 'すやすや',
        regex: 'すやすや状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(くたくた)',
        labelShort: 'くたくた',
        regex: 'くたくた状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(ひやひや)',
        labelShort: 'ひやひや',
        regex: 'ひやひや状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(ズキンズキン)',
        labelShort: 'ズキンズキン',
        regex: 'ズキンズキン(|、からげんき)状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(からげんき)',
        labelShort: 'からげんき',
        regex: 'からげんき状態に(する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(はねかえし)',
        labelShort: 'はねかえし',
        regex: 'はねかえす',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(かばう)',
        labelShort: 'かばう',
        regex: 'かばう',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(ぼんやりうっかり)',
        labelShort: 'ぼんやりうっかり',
        regex: 'ぼんやりうっかり状態に(なる|する|し)',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(ルンルンきぶん)',
        labelShort: 'ルンルンきぶん',
        regex: 'ルンルンきぶん状態になる',
      },
      {
        labelFull: '状態異常付与/特殊行動実行(復帰)',
        labelShort: '復帰',
        regex: '復帰',
      },
    ],
  },
];

export default {
  data() {
    return {
      advFilterFriends: _advFilterFriends,
      advFilterFriends_defaultColumns: [
        'ミラクルlv5',
        'とくいわざ詳細',
        'たいきスキル詳細',
        'とくせい詳細',
        'キセキとくせい詳細',
      ],
    };
  },
};
