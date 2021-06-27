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
    subTitle: '特定の状態異常に耐性を与えるフォト',
    dataList: [
      {
        labelFull: '対・状態異常(くらくら)',
        labelShort: 'くらくら',
        regex:
          'くらくら耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(どく)',
        labelShort: 'どく',
        regex:
          'どく耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(すやすや)',
        labelShort: 'すやすや',
        regex:
          'すやすや耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(くたくた)',
        labelShort: 'くたくた',
        regex:
          'くたくた耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(ひやひや)',
        labelShort: 'ひやひや',
        regex:
          'ひやひや耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(ズキンズキン)',
        labelShort: 'ズキンズキン',
        regex:
          'ズキンズキン耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
      {
        labelFull: '対・状態異常(からげんき)',
        labelShort: 'からげんき',
        regex:
          'からげんき耐性|((どく|くらくら|すやすや|くたくた|ひやひや|からげんき|ズキンズキン)(|、|\r\n))+状態にならない',
      },
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
