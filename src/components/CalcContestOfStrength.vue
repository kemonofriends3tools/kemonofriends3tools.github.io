<template>
  <b-container>
    <b-card class="mb-2" title="[ちからくらべ/とくべつくんれん] 今期末ランク予想">
      <b-alert show variant="info" class="small">
        今期末までにランクいくつになれるかを計算します。
      </b-alert>
      <b-alert show variant="warning" class="mt-4 small">
        対戦(勝敗・ターン数等)が安定しない場合、結果の誤差も大きくなります。
      </b-alert>
      <b-row>
        <b-col cols="12" lg="8" xl="7" class="mb-4">
          <h5 class="input">[入力] 現状・対戦方針</h5>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">イベント</label>
            </b-col>
            <b-col class="text-right d-inline input-right-margin">
              <b-row>
                <b-col cols="12">
                  <b-select
                    v-model.number="inputEvent"
                    :options="selectEvent"
                    class="d-inline width12rem"
                    required
                    @change="changeEvent"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">今期終了日時</label>
            </b-col>
            <b-col class="d-flex justify-content-end input-right-margin-endDate">
              <v-date-picker
                v-model="inputEndDate"
                color="green"
                :min-date="inputMinDate"
                is-required
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <input
                    readonly
                    class="datePickerInput form-control"
                    :value="inputValue"
                    v-on="inputEvents"
                  />
                </template>
              </v-date-picker>
              <vue-timepicker
                v-model="inputEndTime"
                :minute-interval="10"
                hide-clear-button
                manual-input
                auto-scroll
                class="ml-1 mr-0"
                input-class="vueTimepickerInput"
                :input-width="'5.6rem'"
                skip-error-style
                hour-label="時"
                minute-label="分"
              ></vue-timepicker>
            </b-col>
          </b-row>
          <b-row class="align-items-center" v-if="endDate < new Date()">
            <b-col class="d-inline">
              <b-alert show variant="warning" class="my-1 small"
                >（管理者が更新をサボっている為）正しい今期終了日時が判りません。お手数ですが正しい日付を入れてください。</b-alert
              >
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">挑戦回数</label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12">
                  <b-input
                    required
                    v-model.number="inputNumberOfChallenge"
                    type="number"
                    min="0"
                    :max="maxNumberOfChallenge"
                    class="d-inline ml-0 input-number-5rem"
                  />
                  <span class="font-weight-bold input-right-display-unit"
                    >/ {{ maxNumberOfChallenge }}</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">次の回復まで</label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12">
                  <b-input
                    v-model.number="inputLeastTime"
                    type="number"
                    min="1"
                    max="59"
                    :disabled="isInputNumberOfChallengeFull"
                    class="d-inline ml-0 input-number-5rem"
                  />
                  <span class="font-weight-bold input-right-display-unit">分</span>
                  <template v-if="isInputNumberOfChallengeFull">
                    <br />
                    <span class="small"
                      >『挑戦回数』が
                      {{ maxNumberOfChallenge }}
                      なので『次の回復まで』は無視されます。</span
                    >
                  </template>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center" v-if="inputEvent == 'normal'">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">くんれんポイント</label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12">
                  <b-input
                    required
                    v-model.number="inputCurrentPoint"
                    type="number"
                    min="0"
                    class="d-inline ml-0 input-number-7rem"
                  /><span class="font-weight-bold input-right-display-unit">pt</span><br />
                  <span class="small mr-4">
                    <template v-if="currentRank != ''">(ランク {{ currentRank }} )</template>
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center" v-else>
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">とくべつくんれんポイント</label>
            </b-col>
            <b-col class="text-right d-inline input-right-margin">
              <b-row>
                <b-col cols="12">
                  <span class="font-weight-bold">ランク：</span>
                  <b-input
                    required
                    v-model.number="inputCurrentSPRank"
                    type="number"
                    min="1"
                    max="30"
                    class="d-inline ml-0 input-number-7rem"
                  />
                  <br /><span class="font-weight-bold">次のクラスまで：</span>
                  <b-input
                    required
                    v-model.number="inputCurrentSPRemainPoint"
                    type="number"
                    min="1"
                    class="d-inline ml-0 input-number-7rem"
                  />
                  <br />
                  <span class="small mr-4">
                    <template v-if="currentPoint != ''"
                      >(現在のとくべつくんれんポイント {{ currentPoint }})</template
                    >
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">対戦相手難易度</label>
            </b-col>
            <b-col class="text-right d-inline input-right-margin">
              <b-row>
                <b-col cols="12">
                  <b-select
                    v-model.number="inputDifficulty"
                    :options="selectDifficulty"
                    class="d-inline width12rem"
                    required
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">平均ターン数</label>
            </b-col>
            <b-col class="text-right d-inline input-right-margin">
              <b-row>
                <b-col cols="12">
                  <b-select
                    v-model.number="inputAverageTurns"
                    :options="selectAverageTurns"
                    class="d-inline width12rem"
                    required
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                勝率<br />
                <span class="small">(小数点以下2位まで指定可)</span>
              </label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12">
                  <b-input
                    required
                    v-model.number="inputWinRate"
                    type="number"
                    min="0"
                    step="0.01"
                    lazy-formatter
                    :formatter="winRateFormatter"
                    class="d-inline ml-0 input-number-7rem"
                  />
                  <span class="font-weight-bold input-right-display-unit">%</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">挑戦モード</label>
            </b-col>
            <b-col class="text-right d-inline input-right-margin">
              <b-row>
                <b-col cols="12">
                  <b-select
                    v-model.number="inputChallengeMode"
                    :options="selectChallengeMode"
                    class="d-inline width12rem"
                    required
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <template v-if="inputChallengeMode == 3">
            <b-row class="align-items-center">
              <b-col cols="12" md="4">
                <label class="mb-0 font-weight-bold">負けた場合</label>
              </b-col>
              <b-col class="text-right d-inline input-right-margin">
                <b-row>
                  <b-col cols="12">
                    <b-select
                      v-model.number="inputRecoverLogic"
                      :options="selectRecoverLogic"
                      class="d-inline width20rem"
                      required
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </template>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">現在の連勝ボーナス</label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12">
                  <b-input
                    required
                    v-model.number="inputCurrentConsecutiveWinBonus"
                    type="number"
                    min="0"
                    max="5"
                    class="d-inline ml-0 input-number-5rem"
                  /><span class="font-weight-bold input-right-display-unit">pt</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <h5 class="output mb-2">[出力] ランク予想</h5>
          <template v-if="result[1].length">
            <b-alert show variant="danger">
              <ul class="mb-0">
                <li v-for="(errorMessage, index) of result[1]" :key="index">{{ errorMessage }}</li>
              </ul>
            </b-alert>
          </template>
          <template v-else>
            <b-row
              v-for="(resultMessage, index) of result[0]"
              class="mt-3 align-items-end outputUnderBorder"
              :key="index"
            >
              <b-col cols="12" md="7" class="font-weight-bold" v-html="resultMessage[0]"></b-col>
              <b-col
                cols="12"
                md="5"
                class="font-weight-bold text-right"
                v-html="resultMessage[1]"
              ></b-col>
            </b-row>
          </template>
          <b-alert show variant="info" class="mt-4 small">
            <ul class="pl-0 mb-0">
              <li>
                『最終ランクアップ日時』はあくまで目安です。プレイタイミングにより数時間ズレることがあります。
              </li>
              <li v-if="inputEvent == 'normal'">
                くんれんメダルは『総獲得くんれんメダル』以外に防衛ボーナスとして入手できる可能性があります。
              </li>
              <li v-else>
                とくべつくんれんメダルは『総獲得とくべつくんれんメダル』以外に防衛ボーナスやおうえんボーナス（連敗時ボーナス）として入手できる可能性があります。
              </li>
              <li>
                このツールは結果を総計ではなく、真面目に毎戦シミュレーションして求めています。そのため勝率が100%未満の場合、計算毎に結果が変動します。
              </li>
              <li>
                具体的にどのようなシミュレーション結果になったのか知りたい人は下の「デバッグ&計算の根拠を見たい人用」ボタンを押して下さい。
              </li>
            </ul>
          </b-alert>
        </b-col>
      </b-row>
      <b-container fluid class="mt-4 text-right">
        <b-button v-b-toggle.CalcContestOfStrengthDebug variant="info" class="debugButton">
          デバッグ&計算の根拠を見たい人用
        </b-button>
        <b-collapse id="CalcContestOfStrengthDebug" class="text-left small">
          <b-alert show variant="info">
            <h6>計算の根拠</h6>
            <p class="font-weight-bold">
              注意：ここの中はあくまでデバッグ用のメモ書きなので、参考程度に留めて下さい。
            </p>
            <p class="font-weight-bold">
              ロジックとしては挑戦回数を可能な限り(つまり{{
                maxNumberOfChallenge
              }})貯めて一気に消化する、を繰り返します。<br />
              『次の回復まで』は一番最初に消化します。<br />
              残り時間が不足してきた場合は可能な限り回復し、挑戦回数を全て使い切ります。
            </p>
            <p class="font-weight-bold">
              勝利時の数式は以下の通りです。<br />
              ( (基本 + 連勝ボーナス) * ターンボーナス * 相手ボーナス ) * 挑戦モード
            </p>
            <template v-for="(infoMessage, index) of result[2]">
              {{ infoMessage }}<br :key="index" />
            </template>
          </b-alert>
        </b-collapse>
      </b-container>
    </b-card>
  </b-container>
</template>

<script>
import dayjs from 'dayjs';

import VueTimepicker from 'vue2-timepicker';

import contestOfStrengthJson from '../json/contestOfStrength.json';
import contestOfStrengthSPJson from '../json/contestOfStrengthSP.json';

//イベント終了日時。更新する場合はここを変更する。
//終了時間は10分程前を指定しておくこと（最終対戦をメンテ前に終えられるよう配慮している）。
const endDateNormal = new Date('2025/05/29 13:50:00');
const EndDateSP = new Date('2023/10/26 13:50:00');

const DifficultyNormal = [
  { value: 1.2, text: 'てごわい (x1.2)' },
  { value: 1.0, text: 'とんとん (x1.0)' },
  { value: 0.8, text: 'やさしい (x0.8)' },
];
const DifficultySP = [
  { value: 1.2, text: 'げきせん (x1.2)' },
  { value: 1.0, text: 'はくねつ (x1.0)' },
  { value: 0.8, text: 'てあわせ (x0.8)' },
];
const AverageTurnsNormal = [
  { value: 1.5, text: '1 ターン (x1.5)' },
  { value: 1.4, text: '2 ターン (x1.4)' },
  { value: 1.3, text: '3 ターン (x1.3)' },
  { value: 1.2, text: '4 ターン (x1.2)' },
  { value: 1.1, text: '5 ターン (x1.1)' },
  { value: 1.0, text: '6 ターン以上 (x1.0)' },
];
const AverageTurnsSP = [
  { value: 1.2, text: '7 ターン以内 (x1.2)' },
  { value: 1.1, text: '8 ターン以上 (x1.1)' },
];

export default {
  name: 'CalcContestOfStrength',
  components: { VueTimepicker },
  data() {
    return {
      selectEvent: [
        { value: 'normal', text: 'ちからくらべ' },
        { value: 'sp', text: 'とくべつくんれん' },
      ],
      inputEvent: 'normal', //イベント選択の初期値はちからくらべ。
      endDate: endDateNormal, //今期末日付。
      rankArray: [], //次ランクへ上がるために必要なpt数を格納する配列。実際のランクはindex+1。mountedにて初期化。
      inputEndDate: undefined,
      inputMinDate: new Date(dayjs().startOf('day')),
      inputEndTime: '13:50',
      inputNumberOfChallenge: 0, //挑戦回数 現在値
      maxNumberOfChallenge: 9, //挑戦回数 最大値
      inputLeastTime: 30, //次の回復まで
      inputCurrentPoint: '', //現在のくんれんポイント。数値を入れるとページロード時に計算処理が走るので空欄にしておく。
      inputCurrentSPRank: '', //とくべつくんれん用 現在のランク
      inputCurrentSPRemainPoint: '', //とくべつくんれん用 次のクラスまでの値
      selectDifficulty: DifficultyNormal, //対戦相手難易度 選択肢
      inputDifficulty: 1.0, //対戦相手難易度
      selectAverageTurns: AverageTurnsNormal, //平均ターン数 選択肢
      inputAverageTurns: 1.2, //平均ターン数
      inputWinRate: 100, //勝率
      selectChallengeMode: [
        { value: 3, text: '3倍モード' },
        { value: 1, text: '通常モード(1倍)' },
      ],
      inputChallengeMode: 3, //挑戦モード
      selectRecoverLogic: [
        { value: 'easy', text: '構わず3倍モードで継続' },
        { value: 'smart', text: '連勝ボーナス回復まで通常モードに' },
      ],
      inputRecoverLogic: 'smart', //負けた場合（対戦方針）
      inputCurrentConsecutiveWinBonus: 5, //現在の連勝ボーナス
    };
  },
  mounted() {
    //changeEvent()に初期化処理があるのでそちらを走らせる
    this.changeEvent();
  },
  methods: {
    //計算対象イベントを切り替えた場合の処理。dataを初期化して回る。
    changeEvent() {
      //イベントによって異なる初期値関連
      if (this.inputEvent == 'normal') {
        //ちからくらべ
        this.endDate = endDateNormal;
        this.rankArray = [];
        contestOfStrengthJson.forEach(i => this.rankArray.push(i['くんれんポイント']));
        this.selectDifficulty = DifficultyNormal; //対戦相手難易度 選択肢
        this.inputDifficulty = 1.0; //対戦相手難易度
        this.selectAverageTurns = AverageTurnsNormal; //平均ターン数 選択肢
        this.inputAverageTurns = 1.2; //平均ターン数
      } else {
        //とくべつくんれん（ちからくらべでなければ全てとくべつくんれんとみなす）
        this.endDate = EndDateSP;
        this.rankArray = [];
        contestOfStrengthSPJson.forEach(i => this.rankArray.push(i['とくべつくんれんポイント']));
        this.selectDifficulty = DifficultySP; //対戦相手難易度 選択肢
        this.inputDifficulty = 1.0; //対戦相手難易度
        this.selectAverageTurns = AverageTurnsSP; //平均ターン数 選択肢
        this.inputAverageTurns = 1.2; //平均ターン数
      }

      //イベントを問わず共通の初期値
      this.inputEndTime = this.endDate.getHours() + ':' + this.endDate.getMinutes();
      this.inputNumberOfChallenge = 0; //挑戦回数
      this.inputLeastTime = 30; //次の回復まで
      this.inputCurrentPoint = ''; //現在のくんれんポイント。数値を入れるとページロード時に計算処理が走るので空欄にしておく。
      this.inputCurrentSPRank = ''; //とくべつくんれん用 現在のランク
      this.inputCurrentSPRemainPoint = ''; //とくべつくんれん用 次のクラスまでの値
      this.inputWinRate = 100; //勝率
      this.inputChallengeMode = 3; //挑戦モード
      this.inputRecoverLogic = 'smart'; //負けた場合（対戦方針）
      this.inputCurrentConsecutiveWinBonus = 5; //現在の連勝ボーナス

      //inputEndDate初期化
      const tmpDateNow = new Date();
      if (tmpDateNow < this.endDate) {
        //endDateが正しい（未来日付）場合はその値を採用する。
        this.inputEndDate = this.endDate;
      } else {
        //endDateが古い場合は現在時刻によって本日もしくは翌日の日付とする。
        //時間はendDateから持ってくる。
        const tmpThresholdDate = new Date(
          tmpDateNow.getFullYear(),
          tmpDateNow.getMonth(),
          tmpDateNow.getDate(),
          this.endDate.getHours(),
          this.endDate.getMinutes()
        );
        //今日の時刻が13:50を超えているなら1日ずらして翌日を〆とする
        if (tmpThresholdDate <= tmpDateNow)
          tmpThresholdDate.setDate(tmpThresholdDate.getDate() + 1);
        this.inputEndDate = tmpThresholdDate;
      }

      //rankArrayは一応ソートしておく。そのままだと文字列で比較してしまうのでコールバック関数で数値比較に。
      this.rankArray.sort((a, b) => a - b);
    },
    //小数点2位に丸める（四捨五入）。勝率入力用。
    winRateFormatter(value) {
      if (value < 0) return 0;
      if (100 < value) return 100;
      return Number(value).toFixed(2);
    },
  },
  computed: {
    //計算対象イベントの情報（使用するjsonやメダルの名称等）をオブジェクトとして返す。
    currentEvent() {
      if (this.inputEvent == 'normal') {
        return {
          name: 'ちからくらべ',
          json: contestOfStrengthJson,
          pointName: 'くんれんポイント',
          medalName: 'くんれんメダル',
        };
      } else {
        return {
          name: 'とくべつくんれん',
          json: contestOfStrengthSPJson,
          pointName: 'とくべつくんれんポイント',
          medalName: 'とくべつくんれんメダル',
        };
      }
    },
    //『挑戦回数』がmaxNumberOfChallengeに一致するかどうかを返す。『次の回復まで』入力boxの有効/無効切り替え用。
    isInputNumberOfChallengeFull() {
      return this.inputNumberOfChallenge == this.maxNumberOfChallenge ? true : false;
    },
    //現在のランクを返す
    currentRank() {
      if (this.inputEvent == 'normal') {
        //ちからくらべの場合はまず入力がなされているか確認する
        //簡単に入力チェック（''と0の区別がつかず先に進むとランク1がついてしまうので、ここでreturnする
        if (this.inputCurrentPoint === '' || this.inputCurrentPoint < 0) return '';

        //入力されたくんれんポイントから現在のランクを計算
        let tmpRank = 0; //arrayの最初は0なのでいきなり1になるが、レベルは1から始まるのでこれで良い。
        for (const i of this.rankArray) {
          if (i <= this.inputCurrentPoint) tmpRank++;
        }
        return tmpRank;
      } else {
        //とくべつくんれんのときは単にユーザー入力を返す
        return this.inputCurrentSPRank;
      }
    },
    //現在のくんれんポイントを返す
    currentPoint() {
      if (this.inputEvent == 'normal') {
        //ちからくらべのときは単にユーザー入力を返す
        return this.inputCurrentPoint;
      } else {
        //とくべつくんれんの場合はまず入力がなされているか確認する
        if (this.inputCurrentSPRank && this.inputCurrentSPRemainPoint) {
          //rankArrayを使ってポイントを調べる。現在ランクより1ランク上のptから"次のクラスまで"を引く。
          return this.rankArray[this.inputCurrentSPRank] - this.inputCurrentSPRemainPoint;
        } else {
          //入力が不正な場合は空文字を返す
          return '';
        }
      }
    },
    result() {
      const result = [[], [], []]; //メイン出力([0]:項目名、[1]:値。いずれもhtml可)、エラー出力(string(あとでulに入る),1要素1行)、計算詳細出力(string,1要素1行)。

      //各入力値のチェック
      if (
        !dayjs(this.inputEndDate).isValid ||
        dayjs(this.inputEndDate).isBefore(this.inputMinDate)
      ) {
        result[1].push('『今期終了日時』の『日』が不正です。');
      }
      if (
        !(
          0 <= this.inputEndTime.split(':')[0] &&
          this.inputEndTime.split(':')[0] <= 23 &&
          0 <= this.inputEndTime.split(':')[1] &&
          this.inputEndTime.split(':')[1] <= 59
        )
      ) {
        result[1].push('『今期終了日時』の『時間』が不正です。');
      }
      if (
        dayjs(this.inputEndDate)
          .set('h', this.inputEndTime.split(':')[0])
          .set('m', this.inputEndTime.split(':')[1])
          .isBefore(dayjs())
      ) {
        result[1].push('『今期終了日時』が現在時間よりも前です。');
      }
      if (
        this.inputNumberOfChallenge === '' ||
        parseInt(this.inputNumberOfChallenge) < 0 ||
        this.maxNumberOfChallenge < parseInt(this.inputNumberOfChallenge)
      ) {
        result[1].push('『挑戦回数』が不正です。');
      }
      //『挑戦回数』がmaxNumberOfChallengeの場合は『次の回復まで』のエラー処理スキップ
      if (this.inputNumberOfChallenge != this.maxNumberOfChallenge) {
        if (
          this.inputLeastTime === '' ||
          parseInt(this.inputLeastTime) < 1 ||
          59 < parseInt(this.inputLeastTime)
        ) {
          result[1].push('『次の回復まで』が不正です。(1～59、0不可)');
        }
      }
      if (this.inputEvent == 'normal') {
        if (this.inputCurrentPoint === '') {
          result[1].push('『くんれんポイント』が空です。');
        }
        if (parseInt(this.inputCurrentPoint) < 0) {
          result[1].push('『くんれんポイント』が不正です。');
        }
      } else {
        if (this.inputCurrentSPRank === '') {
          result[1].push('『とくべつくんれんポイント』の『ランク』が空です。');
        }
        if (parseInt(this.inputCurrentSPRank) < 1) {
          result[1].push('『とくべつくんれんポイント』の『ランク』が不正です。');
        }
        if (this.inputCurrentSPRemainPoint === '') {
          result[1].push('『とくべつくんれんポイント』の『次のクラスまで』が空です。');
        }
        if (parseInt(this.inputCurrentSPRemainPoint) < 1) {
          result[1].push('『とくべつくんれんポイント』の『次のクラスまで』が不正です。');
        }
      }
      if (
        this.inputDifficulty === '' ||
        (this.inputDifficulty != 1.2 && this.inputDifficulty != 1.0 && this.inputDifficulty != 0.8)
      ) {
        result[1].push('『対戦相手難易度』が不正です。');
      }
      if (
        this.inputAverageTurns === '' ||
        (this.inputAverageTurns != 1.5 &&
          this.inputAverageTurns != 1.4 &&
          this.inputAverageTurns != 1.3 &&
          this.inputAverageTurns != 1.2 &&
          this.inputAverageTurns != 1.1 &&
          this.inputAverageTurns != 1.0)
      ) {
        result[1].push('『平均ターン数』が不正です。');
      }
      if (
        this.inputWinRate === '' ||
        parseFloat(this.inputWinRate) < 0 ||
        100 < parseFloat(this.inputWinRate)
      ) {
        result[1].push('『勝率』が不正です。');
      }
      if (
        this.inputChallengeMode === '' ||
        (this.inputChallengeMode != 3 && this.inputChallengeMode != 1)
      ) {
        result[1].push('『挑戦モード』が不正です。');
      }
      if (
        this.inputChallengeMode == 3 &&
        (this.inputRecoverLogic === '' ||
          (this.inputRecoverLogic != 'easy' && this.inputRecoverLogic != 'smart'))
      ) {
        result[1].push('『負けた場合』が不正です。');
      }
      if (
        this.inputCurrentConsecutiveWinBonus === '' ||
        parseInt(this.inputCurrentConsecutiveWinBonus) < 0 ||
        5 < parseInt(this.inputCurrentConsecutiveWinBonus)
      ) {
        result[1].push('『現在の連勝ボーナス』が不正です。');
      }
      //入力エラーがあったら終了
      if (0 < result[1].length) return result;

      //メイン計算処理開始
      const maxButtleCount = 3000; //最大総対戦数。無限ループ対策。

      //終了時間セット
      const tmpEndTime = dayjs(this.inputEndDate)
        .set('h', this.inputEndTime.split(':')[0])
        .set('m', this.inputEndTime.split(':')[1]);
      result[2].push(
        '現在時間は' +
          dayjs().format('llll') +
          '、終了時間は' +
          dayjs(tmpEndTime).format('llll') +
          '。'
      );

      //対戦をシミュレートするのに必要なデータモデル
      const challengeModel = {
        parent: this, //関数内ではthisが参照できなくなるので、vueのリファレンスをここに保存しておく
        result: result, //resultのリファレンス
        currentTime: dayjs(), //シミュレーション上の現在時間
        noMoreTime: false, //残り時間が1時間以下でこれ以上挑戦回数に追加がない場合ture。
        buttleCounter: 0, //総対戦数。無限ループ防止用とstat用
        tmpWinRate: this.inputWinRate / 100, //勝率
        tmpCurrentPoint: this.currentPoint, //くんれんポイント(初期値は他のcomputedから。validateしていないが上のエラーチェックを抜けてきてるので正しいはず。)
        tmpCurrentRank: this.currentRank, //ランク(初期値は他のcomputedから。validateしていないが上のエラーチェックを抜けてきてるので正しいはず。)
        tmpNumberOfChallenge: this.inputNumberOfChallenge, //挑戦回数
        tmpConsecutiveWinBonus: this.inputCurrentConsecutiveWinBonus, //連勝ボーナス
        tmpLastRankUpDate: '', //最終ランクアップ日付。出力用。
        tmpKirakira: 0, //総獲得キラキラ数。入手方法はランクアップ報酬のみ。出力用。
        tmpMedal: 0, //総獲得くんれんメダル数。対戦結果及びランクアップ報酬として獲得。出力用。
      };

      //対戦シミュレータ
      //対戦データモデルを受け取り、それに基づいて可能な限り効率的な対戦を行う。
      //この関数は再帰を行う。対戦回数があるか残り時間に都合がつく限り対戦を行い、なるべく対戦回数を空にして終了する。
      //挑戦回数は通常maxNumberOfChallengeで呼び出される（再帰時を除く）。maxNumberOfChallenge以下になるのは残り時間が足りない場合のみ（のはず）。
      //最適な対戦のみを行うため、挑戦回数が0でないのに終了する場合がある。具体的には3倍モードで残り時間がありかつ挑戦回数が1またはは2で次をするには足りない場合は挑戦回数を残したまま終了する。
      const simulateChallenge = function(model) {
        //総対戦数チェック。無限ループ対策として一定回数以上で処理を中断する。
        if (maxButtleCount <= model['buttleCounter']) {
          model['result'][1].push(
            '総対戦数が ' +
              maxButtleCount +
              ' 回を越えたので処理を中断しました（無限ループ対策）。『今期終了日時』が遠すぎます。'
          );
          model['result'][2].push(
            '総対戦数が ' + maxButtleCount + ' 回を越えたので中断（無限ループ対策）。'
          );
          return;
        }

        //これから行う対戦を何倍でやるか決定する
        let tmpMode = 3; //初期値は3倍モード。
        //1に下げる条件。元々１倍設定の場合。『負けた場合』がsmartかつ連勝ボーナスが下がっている場合。残り時間が１時間以下で挑戦回数が3未満の場合。
        if (
          model['parent'].inputChallengeMode == 1 ||
          (model['parent'].inputRecoverLogic == 'smart' && model['tmpConsecutiveWinBonus'] < 5) ||
          (model['noMoreTime'] && model['tmpNumberOfChallenge'] < 3)
        ) {
          tmpMode = 1;
        }

        //挑戦回数がモードに足りない場合は終了
        if (model['tmpNumberOfChallenge'] < tmpMode) return;

        //挑戦処理。
        //総対戦数と挑戦回数は先払い（log出力のため）
        model['buttleCounter']++; //総対戦数インクリメント
        model['tmpNumberOfChallenge'] -= tmpMode; //挑戦回数
        //乱数を作って勝利と比較。勝率以下なら勝ち、勝率を越えたら負け。
        if (Math.random() < model['tmpWinRate']) {
          //勝ち
          //勝ち点
          const tmpRewards =
            Math.floor(
              (10 + model['tmpConsecutiveWinBonus']) *
                model['parent'].inputAverageTurns *
                model['parent'].inputDifficulty
            ) * tmpMode;

          //modelに反映
          model['tmpCurrentPoint'] += tmpRewards; //くんれんポイント
          model['tmpMedal'] += 100 * tmpMode; //くんれんメダル

          model['result'][2].push(
            model['currentTime'].format('MM/DD(dd) HH:mm') +
              ' [' +
              model['buttleCounter'] +
              '戦目] [勝ち] ( ( 10 + ' +
              model['tmpConsecutiveWinBonus'] +
              ' ) * ' +
              model['parent'].inputAverageTurns +
              ' * ' +
              model['parent'].inputDifficulty +
              ' ) * ' +
              tmpMode +
              ' = ' +
              tmpRewards +
              ' [総ポイント:' +
              model['tmpCurrentPoint'] +
              ' 総メダル:' +
              model['tmpMedal'] +
              ']'
          );

          //連勝ボーナス。次勝ったときに適用されるものを先行で入れる。5の時はそのまま。
          if (model['tmpConsecutiveWinBonus'] != 5) {
            if (model['tmpConsecutiveWinBonus'] == 3) {
              //3のときは5
              model['tmpConsecutiveWinBonus'] = 5;
            } else {
              //それ以外(0,1,2)はインクリメント
              model['tmpConsecutiveWinBonus']++;
            }
          }
          //新ランクに到達しているか計算
          //ループ変数の初期値は現在のランクにすることで比較回数を減らす。rankArrayのindexと実ランクは1つずれているので初期値を実ランクにするとちょうど次lvのptと比較が出来る。
          //通常２ランク一気にあがることはありえないので、実質このfor文はループすること無く１回で終了するはず。（とくべつくんれんの初戦時などはループする可能性がある。）
          for (let i = model['tmpCurrentRank']; i < model['parent'].rankArray.length; i++) {
            if (model['parent'].rankArray[i] <= model['tmpCurrentPoint']) {
              //ランク上昇
              model['tmpCurrentRank']++;
              model['tmpKirakira'] += model['parent'].currentEvent.json[i]['キラキラ'];
              //ランクアップログ出力
              let rankUpLogStr = 'ランク ' + model['tmpCurrentRank'] + ' に到達';
              //ランクアップ報酬の有無を確認
              if (
                model['parent'].currentEvent.json[i]['キラキラ'] ||
                model['parent'].currentEvent.json[i][model['parent'].currentEvent.medalName]
              ) {
                rankUpLogStr += ' [報酬:';
                //キラキラ
                if (model['parent'].currentEvent.json[i]['キラキラ']) {
                  rankUpLogStr += ' キラキラ' + model['parent'].currentEvent.json[i]['キラキラ'];
                }
                //メダル
                if (model['parent'].currentEvent.json[i][model['parent'].currentEvent.medalName]) {
                  rankUpLogStr +=
                    ' メダル' +
                    model['parent'].currentEvent.json[i][model['parent'].currentEvent.medalName];
                }
                rankUpLogStr += ']';
              }
              model['result'][2].push(rankUpLogStr);
            }
            model['tmpLastRankUpDate'] = model['currentTime'].format('MM/DD(dd) HH:mm');
          }
        } else {
          //負け
          model['tmpMedal'] += 40 * tmpMode; //メダル
          model['result'][2].push(
            model['currentTime'].format('MM/DD(dd) HH:mm') +
              ' [' +
              model['buttleCounter'] +
              '戦目] [負け] [総メダル:' +
              model['tmpMedal'] +
              ']'
          );
          //modelに反映
          model['tmpConsecutiveWinBonus'] = 0; //連勝ボーナス
        }

        //再帰呼び出し
        simulateChallenge(model);
      };

      //'待ち分'を変数に出す。そして挑戦回数がmaxNumberOfChallengeのときには'待ち分'は0(実質無視)とする。
      let tmpLeastMin = this.inputLeastTime;
      if (this.inputNumberOfChallenge == this.maxNumberOfChallenge) tmpLeastMin = 0;

      //現在時間に'待ち分'を加算したら終了時間を越えてしまうか？
      if (challengeModel['currentTime'].add(tmpLeastMin, 'm').isSameOrAfter(tmpEndTime)) {
        //越えてしまうのでもう手持ちの挑戦回数分を回すしか無い。
        //そのまま対戦を実行
        simulateChallenge(challengeModel);
      } else {
        //越えないので、この時点で'待ち分'を消化して挑戦回数をインクリメントする。以後は1時間ごとの処理とする。
        //挑戦回数がmaxNumberOfChallengeの場合インクリメントされては困るので処理をスキップする。
        if (challengeModel['tmpNumberOfChallenge'] != this.maxNumberOfChallenge) {
          challengeModel['currentTime'] = challengeModel['currentTime'].add(tmpLeastMin, 'm');
          challengeModel['tmpNumberOfChallenge']++;
        }

        //残り時間がまだある（残り時間が1時間以下でない）かつ、総対戦数がmaxButtleCount以下の場合対戦を続ける。前者の条件は時間比較が素直だが、処理ステップ削減のため既に比較済の"残り時間が1時間以下"フラグを利用する。
        while (!challengeModel['noMoreTime'] && challengeModel['buttleCounter'] < maxButtleCount) {
          //挑戦回数がmaxNumberOfChallenge以下ならmaxNumberOfChallengeになるまで待つ。
          if (challengeModel['tmpNumberOfChallenge'] < this.maxNumberOfChallenge) {
            //不足時間計算
            const tmpShortageHour =
              this.maxNumberOfChallenge - challengeModel['tmpNumberOfChallenge'];
            //不足時間を経過しても残り時間がまだあるか
            if (challengeModel['currentTime'].add(tmpShortageHour, 'h').isBefore(tmpEndTime)) {
              //時間はまだある。時間、挑戦回数フル加算
              challengeModel['currentTime'] = challengeModel['currentTime'].add(
                tmpShortageHour,
                'h'
              );
              challengeModel['tmpNumberOfChallenge'] += tmpShortageHour;
            } else {
              //時間が足りない。時間、挑戦回数を足りる分のみ加算。更に"残り時間が1時間以下"フラグ設定。
              const tmpLeastHour = tmpEndTime.diff(challengeModel['currentTime'], 'h');
              challengeModel['currentTime'] = challengeModel['currentTime'].add(tmpLeastHour, 'h');
              challengeModel['tmpNumberOfChallenge'] += tmpLeastHour;
              challengeModel['noMoreTime'] = true;
            }
          }

          //対戦を実行
          simulateChallenge(challengeModel);
        }

        //最終出力
        result[0].push(['最終ランク', challengeModel['tmpCurrentRank']]);
        if (challengeModel['tmpLastRankUpDate'] != '') {
          result[0].push(['最終ランクアップ日時', challengeModel['tmpLastRankUpDate']]);
        }
        result[0].push(['最終' + this.currentEvent.pointName, challengeModel['tmpCurrentPoint']]); //ポイント
        result[0].push(['総対戦数', challengeModel['buttleCounter']]);
        result[0].push(['総獲得キラキラ', challengeModel['tmpKirakira']]);
        result[0].push(['総獲得' + this.currentEvent.medalName, challengeModel['tmpMedal']]); //メダル

        //最終ログ出力
        result[2].push('');
        result[2].push('最終時間 ' + challengeModel['currentTime'].format('MM/DD(dd) HH:mm'));
        result[2].push('最終挑戦回数 ' + challengeModel['tmpNumberOfChallenge']);
        result[2].push(
          '最終' + this.currentEvent.pointName + ' ' + challengeModel['tmpCurrentPoint']
        ); //ポイント
        result[2].push('最終ランク ' + challengeModel['tmpCurrentRank']);
        result[2].push('総対戦数 ' + challengeModel['buttleCounter']);
        result[2].push('総獲得キラキラ ' + challengeModel['tmpKirakira']);
        result[2].push('総獲得' + this.currentEvent.medalName + ' ' + challengeModel['tmpMedal']); //メダル
      }

      //出力
      return result;
    },
  },
};
</script>

<style scoped>
.input-number-5rem {
  width: 5rem !important;
  margin: 0.25em 0.5rem;
}
.input-number-7rem {
  width: 7rem !important;
  margin: 0.25em 0.5rem;
}
select.width12rem {
  max-width: 12rem !important;
  margin: 0.25em 0.5rem;
}
select.width20rem {
  max-width: 20rem !important;
  margin: 0.25em 0.5rem;
}
.input-right-display-unit {
  display: inline-block;
  width: 1.25rem;
}
.input-right-margin {
  margin-right: 1.25rem;
}
.input-right-margin-endDate {
  margin-right: 1.75rem;
}

.outputUnderBorder {
  border-bottom: 2px solid #dee2e6;
}
</style>
