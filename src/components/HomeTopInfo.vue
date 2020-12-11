<template>
  <b-container class="my-4">
    <b-card no-body>
      <h2>曜日関連Tips</h2>
      <b-tabs card v-model="tabIndex" class="d-none d-sm-block">
        <b-tab title="月" />
        <b-tab title="火" />
        <b-tab title="水" />
        <b-tab title="木" />
        <b-tab title="金" />
        <b-tab title="土" />
        <b-tab title="日" />
      </b-tabs>
      <b-tabs card v-model="tabIndex" class="d-block d-sm-none">
        <b-tab title="月" title-link-class="px-2" />
        <b-tab title="火" title-link-class="px-2" />
        <b-tab title="水" title-link-class="px-2" />
        <b-tab title="木" title-link-class="px-2" />
        <b-tab title="金" title-link-class="px-2" />
        <b-tab title="土" title-link-class="px-2" />
        <b-tab title="日" title-link-class="px-2" />
      </b-tabs>
      <b-row class="justify-content-around">
        <b-col cols="12" lg="7">
          <h4>シーサーバル道場β</h4>
          <template v-if="masterDojoData.has(getDayOfTheWeek)">
            <template v-if="masterDojoData.get(getDayOfTheWeek).get('有効期限') < new Date()">
              <b-alert show variant="danger" class="small">
                表示されているデータは{{ getFormattedExpirationDate }}以前のものです。
              </b-alert>
            </template>
            <b-table-simple small striped hover class="mb-0">
              <b-tbody>
                <b-tr>
                  <b-th class="align-middle text-right">属性</b-th>
                  <b-td>
                    <TypeNameToIcon
                      :type="masterDojoData.get(getDayOfTheWeek).get('敵属性')"
                      :imgRemSize="1.8"
                    />
                  </b-td>
                </b-tr>
                <!-- 詳細情報と備考のb-td直後改行位置は重要。開始タグ直後に改行が入ると画面上でスペースとなって見えてしまう(preTextのcssに由来)。避けるにはinnerHTMLと密着させる必要がある。 -->
                <b-tr>
                  <b-th class="align-middle text-right">詳細情報</b-th>
                  <b-td class="preText">{{
                    masterDojoData.get(getDayOfTheWeek).get('詳細情報')
                  }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th class="align-middle text-right">備考</b-th>
                  <b-td class="preText">{{ masterDojoData.get(getDayOfTheWeek).get('備考') }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <b-table-lite small striped hover :items="getDojoData" />
          </template>
        </b-col>
        <b-col cols="12" lg="5">
          <h4>成長クエスト</h4>
          <b-table-simple small striped hover class="mb-0">
            <b-tbody>
              <template v-for="[ikey, ivalue] of getTrainingData">
                <b-tr :key="ikey">
                  <b-th class="align-middle text-right w40">{{ ikey }}</b-th>
                  <b-td>
                    <TypeNameToIcon
                      v-for="j of ivalue.split(',')"
                      :key="j"
                      :type="j"
                      :imgRemSize="1.8"
                    />
                  </b-td>
                </b-tr>
              </template>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import dayjs from 'dayjs';
import dojoJson from '../json/dojo.json';
import trainingJson from '../json/training.json';
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';

export default {
  name: 'HomeWeeklySchedule',
  components: {
    TypeNameToIcon,
  },
  data() {
    return {
      masterDojoData: new Map(), //jsonデータを整理格納するMap()。mountedで初期化。
      tabIndex: 0, //この値はmounted内で再度初期化される。null初期化は不可。詳細はそちら参照。
    };
  },
  mounted() {
    //mountedよりもcounputedのほうが先に走る(Vue仕様っぽい)。結果getDojoData()は空配列を返し、道場部分が空白になる。
    //もし今日が月曜でなければ下のnull代入行がなくともtabIndexが変わることによりそれをwatchしているgetDojoData()が再び走り正常な配列を返す。
    //しかし日が月曜の場合tabIndexは初期値と同じ0なので変化せず、getDojoData()が再び走ることはない。結果ページが空白になる。
    //回避のためtabIndexの初期値をnullとするとgetDojoData()は解決するが、getDayOfTheWeek()のほうでindex参照エラーとなる。
    //ワークアラウンドとしてtabIndexの初期値は0とし、tabIndexに一旦nullを入れる。これで値が必ず変化するようになる。
    //その後正式な曜日を再代入することでgetDojoData()が正しい値を返すようになる。
    this.tabIndex = null;
    //曜日タブ初期値設定。Date().getDay()は日曜スタート。しかしタブは月曜が頭なので１つずらす。日曜は-1になるので6に回す。
    this.tabIndex = new Date().getDay() - 1;
    if (this.tabIndex < 0) this.tabIndex = 6;

    //masterDojoDataを事前初期化する。
    for (const i of ['月', '火', '水', '木', '金', '土', '日'])
      this.masterDojoData.set(i, new Map());
    //jsonを走査してmasterDojoDataを作成する。
    for (const row of dojoJson) {
      for (const [key, value] of Object.entries(row)) {
        //keyが空欄でない場合（row['']でない場合）のみ処理(空欄は列の項目名)。それ以外の場合keyには曜日文字が入っている。
        if (0 < key.length) {
          const tmpMap = this.masterDojoData.get(key); //曜日をkeyにMap()を取得
          //列の項目名が有効期限の場合は日付に変換。（この処理、もっと手前で判断したほうがステップ数が減るが、コード簡素化のため妥協した。）
          const tmpValue = row[''] == '有効期限' ? new Date(value) : value;
          tmpMap.set(row[''], tmpValue); //曜日Map()にアイテム名(row[''])で値を登録する。
        }
      }
    }
  },
  computed: {
    getDayOfTheWeek() {
      //選択された曜日(tabIndex)を曜日文字列に変換
      return ['月', '火', '水', '木', '金', '土', '日'][this.tabIndex];
    },
    getDojoData() {
      const outArray = []; //出力配列
      //masterDojoDataが初期化される前にこれが走るとget部分でconsoleにエラーがでるので、一応存在チェックはしておく。
      if (this.masterDojoData && this.masterDojoData.has(this.getDayOfTheWeek)) {
        //masterDojoDataから各曜日のMap()を取得
        const tmpMap = this.masterDojoData.get(this.getDayOfTheWeek);
        for (let i = 1; i <= 10; i++) {
          const tmpStr = 'Turn ' + i;
          outArray.push({ Turn: tmpStr, 敵行動: tmpMap.get(tmpStr) });
        }
      }
      return outArray;
    },
    getTrainingData() {
      //trainingJsonは浅いので直接データを取得・生成する
      const outMap = new Map();
      outMap.set('レベル', trainingJson[0][this.getDayOfTheWeek]);
      outMap.set('野生解放', trainingJson[1][this.getDayOfTheWeek]);
      outMap.set('ミラクル', trainingJson[2][this.getDayOfTheWeek]);
      return outMap;
    },
    getFormattedExpirationDate() {
      return dayjs(this.masterDojoData.get(this.getDayOfTheWeek).get('有効期限')).format(
        'YYYY/MM/DD'
      );
    },
  },
};
</script>

<style scoped>
.w40 {
  width: 40%;
}
</style>
