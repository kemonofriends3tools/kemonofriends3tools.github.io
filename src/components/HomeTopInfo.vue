<template>
  <b-container class="my-4">
    <b-card no-body>
      <h2>曜日関連Tips</h2>
      <b-tabs card v-model="dayTabIndex" class="d-none d-sm-block">
        <b-tab v-for="dayName in dayNames" :key="dayName" :title="dayName" />
      </b-tabs>
      <b-tabs card v-model="dayTabIndex" class="d-block d-sm-none">
        <b-tab
          v-for="dayName in dayNames"
          :key="dayName"
          :title="dayName"
          title-link-class="px-1"
        />
      </b-tabs>
      <b-row v-if="selectedDayOfWeek === 'じょーとー'" class="justify-content-around">
        <b-col cols="12" class="mr-auto">
          <h4>じょーとー獅子道場</h4>
          <b-tabs card v-model="jyotoTabIndex" class="d-none d-sm-block">
            <b-tab v-for="jyotoType in jyotoTypes" :key="jyotoType">
              <template #title>
                <TypeNameToIcon :type="jyotoType" :imgRemSize="1.8" />
              </template>
            </b-tab>
          </b-tabs>
          <b-tabs card v-model="jyotoTabIndex" class="d-block d-sm-none" nav-class="flex-nowrap">
            <b-tab v-for="jyotoType in jyotoTypes" :key="jyotoType">
              <template #title>
                <TypeNameToIcon :type="jyotoType" :imgRemSize="1.3" />
              </template>
            </b-tab>
          </b-tabs>
          <b-row class="px-3">
            <template v-if="masterDojoJyotoData.has(selectedJyotoType)">
              <template
                v-if="
                  masterDojoJyotoData.get(selectedJyotoType).get('有効期限') <
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                "
              >
                <b-alert show variant="danger" class="small w-100">
                  表示されているデータは{{ getJyotoExpirationDate }}以前のものです。
                </b-alert>
              </template>
              <b-table-simple small striped hover class="mb-0 jyoto-table">
                <b-tbody>
                  <!-- 詳細情報と備考のb-td直後改行位置は重要。開始タグ直後に改行が入ると画面上でスペースとなって見えてしまう(preTextのcssに由来)。避けるにはinnerHTMLと密着させる必要がある。 -->
                  <b-tr>
                    <b-th class="align-middle text-right">詳細情報</b-th>
                    <b-td class="preText">{{
                      masterDojoJyotoData.get(selectedJyotoType).get('詳細情報')
                    }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th class="align-middle text-right">備考</b-th>
                    <b-td class="preText">{{
                      masterDojoJyotoData.get(selectedJyotoType).get('備考')
                    }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-th class="align-middle text-right">敵大技</b-th>
                    <b-td class="preText">{{
                      masterDojoJyotoData.get(selectedJyotoType).get('敵大技')
                    }}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
              <b-table-lite
                small
                striped
                hover
                class="mb-0"
                table-class="jyoto-table-lite"
                :items="getDojoJyotoData"
                :fields="dojoFields"
              />
              <p class="mb-2 ml-4 small">※&#xff1a;毎ターン3回攻撃したときの大技位置</p>
            </template>
          </b-row>
        </b-col>
      </b-row>
      <b-row v-else class="justify-content-around">
        <b-col cols="12" lg="6">
          <h4>シーサーバル道場β</h4>
          <template v-if="masterDojoData.has(selectedDayOfWeek)">
            <template
              v-if="
                masterDojoData.get(selectedDayOfWeek).get('有効期限') <
                  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
              "
            >
              <b-alert show variant="danger" class="small">
                表示されているデータは{{ getDojoExpirationDate }}以前のものです。
              </b-alert>
            </template>
            <b-table-simple small striped hover class="mb-0">
              <b-tbody>
                <b-tr>
                  <b-th class="align-middle text-right">敵属性</b-th>
                  <b-td>
                    <TypeNameToIcon
                      :type="masterDojoData.get(selectedDayOfWeek).get('敵属性')"
                      :imgRemSize="1.8"
                    />
                  </b-td>
                </b-tr>
                <!-- 詳細情報と備考のb-td直後改行位置は重要。開始タグ直後に改行が入ると画面上でスペースとなって見えてしまう(preTextのcssに由来)。避けるにはinnerHTMLと密着させる必要がある。 -->
                <b-tr>
                  <b-th class="align-middle text-right">詳細情報</b-th>
                  <b-td class="preText">{{
                    masterDojoData.get(selectedDayOfWeek).get('詳細情報')
                  }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th class="align-middle text-right">備考</b-th>
                  <b-td class="preText">{{
                    masterDojoData.get(selectedDayOfWeek).get('備考')
                  }}</b-td>
                </b-tr>
                <b-tr>
                  <b-th class="align-middle text-right">敵大技</b-th>
                  <b-td class="preText">{{
                    masterDojoData.get(selectedDayOfWeek).get('敵大技')
                  }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <b-table-lite
              small
              striped
              hover
              class="mb-0"
              table-class="dojo-table-lite"
              :items="getDojoData"
              :fields="dojoFields"
            />
            <p class="mb-2 ml-4 small">※&#xff1a;毎ターン3回攻撃したときの大技位置</p>
          </template>
        </b-col>
        <b-col cols="12" lg="6">
          <!-- div class="text-right mb-2">
            <b-button v-b-toggle.flagManagerCollapse variant="info" class="debugButton">
              フラッグマネージャー(β)
            </b-button>
          </div>
          <b-collapse id="flagManagerCollapse">
            <FlagManager :cookieKey="'DojoFriends_' + dayTabIndex" />
          </b-collapse -->
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
import dojoJyotoJson from '../json/dojoJyoto.json';
import trainingJson from '../json/training.json';
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';
// import FlagManager from '@/components/FlagManager.vue';

export default {
  name: 'HomeWeeklySchedule',
  components: {
    TypeNameToIcon,
    // FlagManager,
  },
  data() {
    return {
      dayNames: ['月', '火', '水', '木', '金', '土', '日', 'じょーとー'],
      jyotoTypes: [
        'ファニー',
        'フレンドリー',
        'リラックス',
        'ラブリー',
        'アクティブ',
        'マイペース',
      ],
      masterDojoData: new Map(), //jsonデータを整理格納するMap()。mountedで初期化。
      masterDojoJyotoData: new Map(), //jsonデータを整理格納するMap()。mountedで初期化。
      dayTabIndex: 0, //この値はmounted内で再度初期化される。null初期化は不可。詳細はそちら参照。
      jyotoTabIndex: 0, //じょーとー獅子道場のタブインデックス
      dojoFields: [{ key: 'Turn', thClass: 'turn-col', tdClass: 'text-center' }, { key: '敵行動' }],
    };
  },
  beforeMount() {
    //ここのdayTabIndex初期化をmounted()で行うと、mountedよりもcomputedのほうが先に走る関係(Vue仕様っぽい)でgetDojoData()は空配列を返し、道場部分が空白になってしまう。
    //beforeMount()ならそれより前にdayTabIndex初期化が行えるので、正常に動作する。
    //曜日タブ初期値設定。Date().getDay()は日曜スタート。しかしタブは月曜が頭なので１つずらす。日曜は-1になるので6に回す。
    this.dayTabIndex = new Date().getDay() - 1;
    if (this.dayTabIndex < 0) this.dayTabIndex = 6;

    //masterDojoDataを事前初期化する。(slice(0, 7)でじょーとーを含まない曜日のみ生成)
    for (const i of this.dayNames.slice(0, 7)) this.masterDojoData.set(i, new Map());
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

    //masterDojoJyotoDataを事前初期化する。
    for (const i of this.jyotoTypes) this.masterDojoJyotoData.set(i, new Map());
    //jsonを走査してmasterDojoJyotoDataを作成する。
    for (const row of dojoJyotoJson) {
      for (const [key, value] of Object.entries(row)) {
        //keyが空欄でない場合（row['']でない場合）のみ処理(空欄は列の項目名)。それ以外の場合keyには曜日文字が入っている。
        if (0 < key.length) {
          const tmpMap = this.masterDojoJyotoData.get(key); //曜日をkeyにMap()を取得
          //列の項目名が有効期限の場合は日付に変換。（この処理、もっと手前で判断したほうがステップ数が減るが、コード簡素化のため妥協した。）
          const tmpValue = row[''] == '有効期限' ? new Date(value) : value;
          tmpMap.set(row[''], tmpValue); //曜日Map()にアイテム名(row[''])で値を登録する。
        }
      }
    }
  },
  computed: {
    selectedDayOfWeek() {
      //選択された曜日(dayTabIndex)を曜日文字列に変換
      return this.dayNames[this.dayTabIndex];
    },
    selectedJyotoType() {
      //選択されたじょーとー属性(jyotoTabIndex)を属性文字列に変換
      return this.jyotoTypes[this.jyotoTabIndex];
    },

    getDojoData() {
      const outArray = []; //出力配列
      //masterDojoDataが初期化される前にこれが走るとget部分でconsoleにエラーがでるので、一応存在チェックはしておく。
      if (this.masterDojoData && this.masterDojoData.has(this.selectedDayOfWeek)) {
        //masterDojoDataから各曜日のMap()を取得
        const tmpMap = this.masterDojoData.get(this.selectedDayOfWeek);
        for (let i = 1; i <= 10; i++) {
          const tmpStr = 'Turn ' + i;
          outArray.push({ Turn: i, 敵行動: tmpMap.get(tmpStr) });
        }
      }
      return outArray;
    },

    getDojoJyotoData() {
      const outArray = []; //出力配列
      //masterDojoJyotoDataが初期化される前にこれが走るとget部分でconsoleにエラーがでるので、一応存在チェックはしておく。
      if (this.masterDojoJyotoData && this.masterDojoJyotoData.has(this.selectedJyotoType)) {
        //masterDojoJyotoDataから各曜日のMap()を取得
        const tmpMap = this.masterDojoJyotoData.get(this.selectedJyotoType);
        for (let i = 1; i <= 10; i++) {
          const tmpStr = 'Turn ' + i;
          outArray.push({ Turn: i, 敵行動: tmpMap.get(tmpStr) });
        }
      }
      return outArray;
    },

    getTrainingData() {
      //trainingJsonは浅いので直接データを取得・生成する
      const outMap = new Map();
      outMap.set('レベル', trainingJson[0][this.selectedDayOfWeek]);
      outMap.set('野生解放', trainingJson[1][this.selectedDayOfWeek]);
      outMap.set('ミラクル', trainingJson[2][this.selectedDayOfWeek]);
      return outMap;
    },
    getDojoExpirationDate() {
      const selected = this.masterDojoData.get(this.selectedDayOfWeek);
      if (!selected) return '';
      return dayjs(selected.get('有効期限')).format('YYYY/MM/DD');
    },
    getJyotoExpirationDate() {
      const selected = this.masterDojoJyotoData.get(this.selectedJyotoType);
      if (!selected) return '';
      return dayjs(selected.get('有効期限')).format('YYYY/MM/DD');
    },
  },
};
</script>

<style scoped>
.w40 {
  width: 40%;
}
.jyoto-table th {
  width: 120px;
  min-width: 120px;
}
.jyoto-table-lite >>> .turn-col {
  width: 60px;
}
.dojo-table-lite >>> .turn-col {
  width: 60px;
}
</style>
