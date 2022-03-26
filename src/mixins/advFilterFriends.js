const _advFilterFriends = [
  {
    title: '地形/時間効果',
    subTitle: '特定の地形/時間によって性能が変化するフレンズ',
    dataList: [
      {
        labelFull: '地形/時間効果(サバンナ)',
        labelShort: 'サバンナ',

        regex: 'サバンナの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(さばく)',
        labelShort: 'さばく',

        regex: 'さばくの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(みずべ)',
        labelShort: 'みずべ',

        regex: 'みずべの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(寒冷地)',
        labelShort: '寒冷地',

        regex: '寒冷地の(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(どうくつ)',
        labelShort: 'どうくつ',

        regex: 'どうくつの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(ジャングル)',
        labelShort: 'ジャングル',

        regex: 'ジャングルの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(やま)',
        labelShort: 'やま',

        regex: 'やまの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(まち)',
        labelShort: 'まち',

        regex: 'まちの(場合|とき)',
      },
      {
        labelFull: '地形/時間効果(夜)',
        labelShort: '夜',

        regex: 'ステージ(|の時間)が夜の(場合|とき)',
      },
    ],
  },
  {
    title: '与・状態異常',
    subTitle: '状態異常を付与できるフレンズ',
    dataList: [
      {
        labelFull: '与・状態異常(くらくら)',
        labelShort: 'くらくら',
        regex: 'くらくら.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(どく)',
        labelShort: 'どく',
        regex: 'どく.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(すやすや)',
        labelShort: 'すやすや',
        regex: 'すやすや.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(くたくた)',
        labelShort: 'くたくた',
        regex: 'くたくた.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ひやひや)',
        labelShort: 'ひやひや',
        regex: 'ひやひや.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ズキンズキン)',
        labelShort: 'ズキンズキン',
        regex: 'ズキンズキン.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(からげんき)',
        labelShort: 'からげんき',
        regex: 'からげんき.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(はねかえし)',
        labelShort: 'はねかえし',
        regex: '受けたダメージを\\d+[%％]ではねかえ(す|し)',
      },
      {
        labelFull: '与・状態異常(ぼんやりうっかり)',
        labelShort: 'ぼんやりうっかり',
        regex: 'ぼんやりうっかり.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ルンルンきぶん)',
        labelShort: 'ルンルンきぶん',
        regex: 'ルンルンきぶん.*状態にな(る|り)',
      },
      {
        labelFull: '与・状態異常(しょんぼりきぶん)',
        labelShort: 'しょんぼりきぶん',
        regex: 'しょんぼりきぶん.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(びりびり)',
        labelShort: 'びりびり',
        regex: 'びりびり.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ちぐはぐリズム)',
        labelShort: 'ちぐはぐリズム',
        regex: 'ちぐはぐリズム.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ばてばてヒリヒリ)',
        labelShort: 'ばてばてヒリヒリ',
        regex: 'ばてばてヒリヒリ.*状態に(する|し|なる)',
      },
      {
        labelFull: '与・状態異常(ロストフラッグ)',
        labelShort: 'ロストフラッグ',
        regex: 'ロストフラッグ.*状態に(する|し|なる)',
      },
    ],
  },
  {
    title: '対・状態異常',
    subTitle: '無効化/耐性付与/解除など対抗手段を持つフレンズ',
    dataList: [
      {
        labelFull: '対・状態異常(くらくら)',
        labelShort: 'くらくら',
        regex:
          '((くらくら.*状態にならない|状態異常にならない|状態にならなくなる)|(くらくら.*|全ての状態異常|全状態異常)耐性.*が増加|(くらくら.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(どく)',
        labelShort: 'どく',
        regex:
          '((どく.*状態にならない|状態異常にならない|状態にならなくなる)|(どく.*|全ての状態異常|全状態異常)耐性.*が増加|(どく.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(すやすや)',
        labelShort: 'すやすや',
        regex:
          '((すやすや.*状態にならない|状態異常にならない|状態にならなくなる)|(すやすや.*|全ての状態異常|全状態異常)耐性.*が増加|(すやすや.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(くたくた)',
        labelShort: 'くたくた',
        regex:
          '((くたくた.*状態にならない|状態異常にならない|状態にならなくなる)|(くたくた.*|全ての状態異常|全状態異常)耐性.*が増加|(くたくた.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ひやひや)',
        labelShort: 'ひやひや',
        regex:
          '((ひやひや.*状態にならない|状態異常にならない|状態にならなくなる)|(ひやひや.*|全ての状態異常|全状態異常)耐性.*が増加|(ひやひや.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ズキンズキン)',
        labelShort: 'ズキンズキン',
        regex:
          '((ズキンズキン.*状態にならない|状態異常にならない|状態にならなくなる)|(ズキンズキン.*|全ての状態異常|全状態異常)耐性.*が増加|(ズキンズキン.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(からげんき)',
        labelShort: 'からげんき',
        regex:
          '((からげんき.*状態にならない|状態異常にならない|状態にならなくなる)|(からげんき.*|全ての状態異常|全状態異常)耐性.*が増加|(からげんき.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(はねかえし)',
        labelShort: 'はねかえし',
        regex: '(はねかえし.*状態を解除|はねかえしむし状態にな(る|り))',
      },
      //かばう 回避不可
      {
        labelFull: '対・状態異常(ぼんやりうっかり)',
        labelShort: 'ぼんやりうっかり',
        regex:
          '((ぼんやりうっかり.*状態にならない|状態異常にならない|状態にならなくなる)|(ぼんやりうっかり.*|全ての状態異常|全状態異常)耐性.*が増加|(ぼんやりうっかり.*状態|状態異常)を解除)',
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
          '((しょんぼりきぶん.*状態にならない|状態異常にならない|状態にならなくなる)|(しょんぼりきぶん.*|全ての状態異常|全状態異常)耐性.*が増加|(しょんぼりきぶん.*状態|状態異常)を解除)',
      },
      //ためこみ上手 回避不可
      //コチョコチョマスター 回避不可
      {
        labelFull: '対・状態異常(びりびり)',
        labelShort: 'びりびり',
        regex:
          '((びりびり.*状態にならない|状態異常にならない|状態にならなくなる)|(びりびり.*|全ての状態異常|全状態異常)耐性.*が増加|(びりびり.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ちぐはぐリズム)',
        labelShort: 'ちぐはぐリズム',
        regex:
          '((ちぐはぐリズム.*状態にならない|状態異常にならない|状態にならなくなる)|(ちぐはぐリズム.*|全ての状態異常|全状態異常)耐性.*が増加|(ちぐはぐリズム.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ばてばてヒリヒリ)',
        labelShort: 'ばてばてヒリヒリ',
        regex:
          '((ばてばてヒリヒリ.*状態にならない|状態異常にならない|状態にならなくなる)|(ばてばてヒリヒリ.*|全ての状態異常|全状態異常)耐性.*が増加|(ばてばてヒリヒリ.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(ロストフラッグ)',
        labelShort: 'ロストフラッグ',
        regex:
          '((ロストフラッグ.*状態にならない|状態異常にならない|状態にならなくなる)|(ロストフラッグ.*|全ての状態異常|全状態異常)耐性.*が増加|(ロストフラッグ.*状態|状態異常)を解除)',
      },
      {
        labelFull: '対・状態異常(MP減少状態)',
        labelShort: 'MP減少状態',
        regex: '(MP減少状態にならない|MP減少状態にならなくなる|MP減少状態を解除)',
      },
    ],
  },
  {
    title: '特殊行動',
    subTitle: '特殊な行動を行えるフレンズ',
    dataList: [
      {
        labelFull: '特殊行動(かばう)',
        labelShort: 'かばう',
        regex: 'かばう',
      },
      {
        labelFull: '特殊行動(ためこみ上手)',
        labelShort: 'ためこみ上手',
        regex: 'ためこみ上手(状態|)にな(る|り)',
      },
      {
        labelFull: '特殊行動(コチョコチョマスター)',
        labelShort: 'コチョコチョマスター',
        regex: 'コチョコチョマスター',
      },
      {
        labelFull: '特殊行動(復帰)',
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