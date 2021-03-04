<template>
  <b-container fluid class="mt-2">
    <h1>各種分析(β)</h1>
    <b-container>
      <b-alert show variant="info" class="small text-center">
        フレンズ、フォト、イベント等の各種データを利用し、気になるものをいろいろと集計したり分析してみたりしたものです。
      </b-alert>
    </b-container>
    <AnalysisRecentlyDate :RecentlyDateRows="RecentlyDateRows" />
  </b-container>
</template>

<script>
import AnalysisRecentlyDate from '@/components/AnalysisRecentlyDate.vue';

import dayjs from 'dayjs';
import eventsJson from '../json/events.json';

//eventsJsonのカテゴリーアイテム。
//スプレッドシートのアイテム定義列郡と同一であり、衣装を分割していないオリジナル。
const originalCategoryItems = [
  'フレンズ',
  'フォト',
  '衣装',
  '家具',
  'インテリア',
  'ピクニックアイテム',
  'その他アイテム',
];

//eventsJsonのスプレッドシート上の列定義
//Mapなので順序が保証される。なのでforEach等でループすれば元のカラム順通りになる。
const originalColumn = new Map([
  ['フレンズ', ['招待', '特効', '配布', '引換', '対象']], //フレンズだけは'対象'がある
  ['フォト', ['招待', '特効', '配布', '引換']],
  ['衣装', ['招待', '特効', '配布', '引換']],
  ['家具', ['招待', '特効', '配布', '引換']],
  ['インテリア', ['招待', '特効', '配布', '引換']],
  ['ピクニックアイテム', ['招待', '特効', '配布', '引換']],
  ['その他アイテム', ['招待', '特効', '配布', '引換']],
]);

export default {
  name: 'Analysis',
  components: {
    AnalysisRecentlyDate,
  },
  mounted() {
    //フレンズ及びフォトの直近入手日付を格納するMap
    const tmpFriends = new Map();
    const tmpPhoto = new Map();
    //eventsJsonを走査して情報収集
    eventsJson.forEach(row => {
      //json中の出力カラムを走査し、スプレッドシート上のカラムを復元（分割）する。
      //出力カラムは;区切りなのでまずはそれでsplitする。
      const tmpOutput = row.出力.split(';');
      let tmpOutputIndex = 0; //tmpOutputのindex。tmpOutputをどこまで読んだか示すもの。
      let tmpId = 1; //現在処理対象となる出力カラムid。1から始まってスプレッドシート上終端カラム数までカウントアップする。

      //jsonの開始日時、終了日時をオブジェクト化
      const tmpEvent = {
        url: row.url,
        //vue-good-tableは日付を扱えるがDateではなく文字列として扱う。
        start: dayjs(row.開始, 'YYMMDDHHmm').format('YYYY/MM/DD HH:mm'),
        end: dayjs(row.終了, 'YYMMDDHHmm').format('YYYY/MM/DD HH:mm'),
        フレンズ: new Map(),
        フォト: new Map(),
        衣装: new Map(),
        家具: new Map(),
        インテリア: new Map(),
        ピクニックアイテム: new Map(),
        その他アイテム: new Map(),
      };
    });
  },
};
</script>
