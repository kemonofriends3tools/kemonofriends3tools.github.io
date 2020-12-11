<template>
  <b-container>
    <b-card class="mb-2" title="[ピクニック] 輝きの欠片 回収完了時間">
      <b-alert show variant="warning" class="small">
        簡略化のため秒以下を省略しています。そのため結果には1分程度の誤差が出る場合があります。
      </b-alert>
      <b-row>
        <b-col cols="12" md="6" class="mb-4">
          <h5 class="input">[入力] 現在の状態</h5>
          <b-card-text>
            <b-input
              v-model.number="currentNumerator"
              type="number"
              min="0"
              max="460"
              class="d-inline picnic-input"
            />
            <span class="currentInputSeparator">/</span>
            <b-select
              v-model.number="currentDenominator"
              :options="denominator"
              class="d-inline picnic-input"
              required
            />
          </b-card-text>
          <b-card-text>
            <vue-slider
              v-model.number="currentIndicatedTime"
              :marks="sliderMark"
              :max="480"
              :dotSize="25"
              :height="20"
              :dragOnClick="false"
              :tooltip="'none'"
              :labelStyle="{ top: '-1.2rem', margin: '0' }"
            ></vue-slider>
            <b-button-group class="w-100 currentTimeAdjustButtonGroup">
              <b-button @click="currentTimeAdjust(-10)" class="p-2">-10</b-button>
              <b-button @click="currentTimeAdjust(-1)" class="p-2">-1</b-button>
              <div class="text-center bg-primary currentTimeAdjustButtonGroupText">
                獲得まで<br /><span class="font-weight-bold">{{ currentTime }}</span>
              </div>
              <b-button @click="currentTimeAdjust(1)" class="p-2">+1</b-button>
              <b-button @click="currentTimeAdjust(10)" class="p-2">+10</b-button>
            </b-button-group>
          </b-card-text>
          <b-card-text>
            <b-checkbox
              id="picnic-currentRewardBase"
              v-model.number="currentRewardBase"
              name="picnic-currentRewardBase"
              value="2"
              unchecked-value="1"
            >
              [月間パスポート] 獲得量アップ
            </b-checkbox>
          </b-card-text>
        </b-col>
        <b-col>
          <h5 class="output">[出力] 回収完了時間</h5>
          <b-table-lite borderless striped hover :items="outTableItems"></b-table-lite>
          <template v-if="outPassportWarning != ''">
            <b-alert show variant="warning">
              {{ outPassportWarning }}
            </b-alert>
          </template>
          <h5 class="output">[出力] 推奨入れ替え時間</h5>
          <b-alert show variant="info" class="small">
            獲得までの時間が8時間ごとなので、1日に3回待ち時間が0となるタイミングがあります。フレンズを入れ替えるのであれば以下の時間に行うと効率的です。
          </b-alert>
          <b-row class="justify-content-center">
            <b-col class="text-right">
              <span class="font-weight-bold">{{ outRecommendedSwapTime[0] }}</span>
            </b-col>
            <b-col class="text-center">
              <span class="font-weight-bold">{{ outRecommendedSwapTime[1] }}</span>
            </b-col>
            <b-col class="text-left">
              <span class="font-weight-bold">{{ outRecommendedSwapTime[2] }}</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import VueSlider from 'vue-slider-component';
import '@/assets/scss/custom-vue-slider-component.scss';

import dayjs from 'dayjs';

export default {
  name: 'CalcPicnic',
  components: {
    VueSlider,
  },
  data() {
    return {
      currentNumerator: 0,
      currentDenominator: 240,
      sliderMark: {
        '0': '0h',
        '120': '2h',
        '240': '4h',
        '360': '6h',
        '480': '8h',
      },
      currentIndicatedTime: 240,
      denominator: [
        { value: 240, text: 240 },
        { value: 120, text: 120 },
        { value: 60, text: 60 },
        { value: 30, text: 30 },
        { value: 10, text: 10 },
      ],
      currentRewardBase: 1,
    };
  },
  computed: {
    currentTime() {
      //picnic 獲得までの時間文字列化
      const hour = Math.floor(this.currentIndicatedTime / 60);
      const min = this.currentIndicatedTime % 60;
      return ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2) + ':00';
    },
    outTableItems() {
      //回収完了時間計算
      const outArray = [];
      let outArrayTime = dayjs(); //出力用。初期値は現在時間だがループ毎に加算処理を行うので変化する。
      const outArray1stKey = '回収数'; //出力用。表のthになる。
      const outArray2ndKey = '回収完了時間'; //出力用。表のthになる。
      let outArrayKemokyuu = 1; //出力用。けも級の数値になるカウンター

      let tmpNumerator = this.currentNumerator; //作業用の分子。回収数。初期値はユーザー入力から。
      let isCurrentTimeAddedYet = true; //現カウントダウン時間を既に加算したかのフラグ(NOT反転しなくて済むよう、加算していない(yet)ならtrue)
      let tmpLaps = 0; //計算用。8hループのラップカウンター

      //処理分母毎にループ
      for (let tmpDenominator of [10, 30, 60, 120, 240]) {
        outArrayKemokyuu++; //けも級を１つ進める
        //入力分母よりも処理分母が大きい場合に実行
        if (this.currentDenominator <= tmpDenominator) {
          if (tmpDenominator <= tmpNumerator) {
            //既に作業分子が処理分母に達している場合
            outArray.push({
              [outArray1stKey]: tmpDenominator + ' (★' + outArrayKemokyuu + ')',
              [outArray2ndKey]: '-',
            });
          } else {
            //まだ処理分母に達していない場合

            //現在の待ち時間分をまだ加えていないのなら加える
            if (isCurrentTimeAddedYet) {
              outArrayTime = outArrayTime.add(this.currentIndicatedTime, 'm');
              tmpNumerator += this.currentRewardBase; //1回分加算
              isCurrentTimeAddedYet = false;
            }

            //達成までの8hラップ数を計算(月間パスにより端数が出る可能性があるため小数点以下切り上げ)
            tmpLaps = Math.ceil((tmpDenominator - tmpNumerator) / this.currentRewardBase);
            if (tmpLaps < 0) tmpLaps = 0; //既にオーバーしてる場合(そもそもここに来ないはず)、又は残りが1で月間パスによる獲得量upがかかっている場合
            //時間に加算
            outArrayTime = outArrayTime.add(tmpLaps * 8, 'h');
            //作業分子に加算（このあと引くけど月間パスポートで端数が出る可能性があるのでちゃんと計算する）
            tmpNumerator += tmpLaps * this.currentRewardBase;
            //結果出力
            outArray.push({
              [outArray1stKey]: tmpDenominator + ' (★' + outArrayKemokyuu + ')',
              [outArray2ndKey]: outArrayTime.format('MM/DD(dd) HH:mm'),
            });
          }
          //次周のためこの周の処理母分を差し引く（月間パスポートで端数が出る可能性があるのでちゃんと計算する）
          tmpNumerator -= tmpDenominator;
        }
      }

      return outArray;
    },
    outPassportWarning() {
      //picnic 欠片あふれ警告用
      if (this.currentRewardBase == 2 && this.currentNumerator % 2) {
        return '『[月間パスポート] 獲得量アップ が有効』かつ『現在の輝きの欠片獲得数が奇数』なので、最終的に欠片が１つ余ります。';
      } else {
        return '';
      }
    },
    outRecommendedSwapTime() {
      //picnic 推奨入れ替え時間。現在時間を足し、そこに8h、8*2=16hと足すだけ。
      const outArray = [];
      const tmpTime = dayjs().add(this.currentIndicatedTime, 'm');
      outArray.push(tmpTime.format('HH:mm'));
      outArray.push(tmpTime.add(8, 'h').format('HH:mm'));
      outArray.push(tmpTime.add(16, 'h').format('HH:mm'));
      // outArray.sort();  //sortしたいならこれを有効に。ただ直近の時間が先に出てきたほうが嬉しいかと思う。
      return outArray;
    },
  },
  methods: {
    currentTimeAdjust(value) {
      //picnic 獲得まで時間の補正ボタン用
      this.currentIndicatedTime += value;
      if (this.currentIndicatedTime < 0) this.currentIndicatedTime = 0;
      if (480 < this.currentIndicatedTime) this.currentIndicatedTime = 480;
    },
  },
};
</script>

<style scoped>
.picnic-input {
  width: 5rem !important;
  margin: 0.25em 0.5rem;
}
.currentInputSeparator {
  font-size: 200%;
  vertical-align: middle;
}
.currentTimeAdjustButtonGroup {
  top: -0.5rem;
}
.currentTimeAdjustButtonGroupText {
  width: 20rem;
}
</style>
