<template>
  <b-container>
    <b-card class="mb-2" title="[イベント] 汎用 (アイテム数/クリア回数) 計算">
      <b-alert show variant="info" class="small">
        クエストをクリアしてイベントアイテムを集めるという形式のイベントにて、期日までに目標数を入手できるか（自然回復で足りない場合スタミナドリンクが何本必要なのか）を計算します。<br />
        『野生大開放』『体力測定』『○○のしくず』等がこの形式になります。
      </b-alert>
      <b-alert show variant="warning" class="mt-4 small">
        <p class="font-weight-bold">
          注意：時間には必ず余裕を見て下さい。特にメンテ前ギリギリに合わせるのは危険です。
        </p>
        以下のような理由により『目標達成日時』には誤差が生じます。
        <ul class="mt-3 mb-0">
          <li>
            [入力]にて簡略化のため『現在のスタミナ』の『残り時間』は省略しています。そのため5分程度ズレることがあります。
          </li>
          <li>
            『目標達成日時』は最後の１回を回すのに必要なスタミナが用意できる時間です。
            <span class="font-weight-bold">
              クエストをこなす時間は計算に入れていません。
            </span>
          </li>
          <li>
            アイテムのレアドロップ、探検隊レベルアップによるスタミナ回復などは計算にいれていません(これらが発生した場合は一般的に楽になります)。
          </li>
          <li>
            自然回復分をフルに使うことを前提にしているので、スタミナを溢れさせたら計算が狂います。
          </li>
        </ul>
      </b-alert>
      <b-row>
        <b-col cols="12" lg="8" xl="7" class="mb-4">
          <h5 class="input">[入力] イベント状況</h5>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                イベント終了日時<br />
                <span class="small">(もしくは完了希望日時)</span>
              </label>
            </b-col>
            <b-col class="d-flex justify-content-end mr-2">
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
          <b-row class="align-items-center mt-2 mb-2">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                目標
              </label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-form-radio-group v-model="inputTarget" required>
                <b-form-radio value="items">
                  アイテム数
                </b-form-radio>
                <b-form-radio value="times">
                  クリア回数
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                現状
              </label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row>
                <b-col cols="12" md="6">
                  <label class="mb-0 small">
                    現在：
                    <b-input
                      v-model.number="inputTargetCurrentValue"
                      type="number"
                      min="0"
                      class="d-inline ml-0 input-number-7rem"
                    />
                  </label>
                </b-col>
                <b-col cols="12" md="6">
                  <label class="mb-0 small">
                    目標：
                    <b-input
                      v-model.number="inputTargetTargetValue"
                      type="number"
                      min="0"
                      class="d-inline ml-0 input-number-7rem"
                    />
                  </label>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                周回するクエスト
              </label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-row class="justify-content-end">
                <b-col cols="12" md="6">
                  <label class="mb-0 small">
                    スタミナ：
                    <b-input
                      v-model.number="inputQuestStamina"
                      type="number"
                      min="0"
                      class="d-inline ml-0 input-number-5rem"
                    />
                  </label>
                </b-col>
                <template v-if="inputTarget == 'items'">
                  <b-col cols="12" md="6">
                    <label class="mb-0 small">
                      報酬：
                      <b-input
                        v-model.number="inputQuestRewards"
                        type="number"
                        min="1"
                        class="d-inline ml-0 input-number-5rem"
                      />
                    </label>
                  </b-col>
                </template>
              </b-row>
            </b-col>
          </b-row>
          <template v-if="inputTarget == 'items'">
            <b-row class="align-items-center">
              <b-col cols="12" md="4">
                <label class="mb-0 font-weight-bold">
                  特攻フォト倍率(%)
                </label>
              </b-col>
              <b-col class="text-right d-inline">
                <b-row>
                  <b-col cols="12" md="6">
                    <label class="mb-0 small">
                      自分：
                      <b-input
                        v-model.number="inputMultiplyerMe"
                        type="number"
                        min="0"
                        class="d-inline ml-0 input-number-5rem"
                      />
                    </label>
                  </b-col>
                  <b-col cols="12" md="6">
                    <label class="mb-0 small">
                      助っ人：
                      <b-input
                        v-model.number="inputMultiplyerHelper"
                        type="number"
                        min="0"
                        class="d-inline ml-0 input-number-5rem"
                      />
                    </label>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </template>
          <b-row class="align-items-center">
            <b-col cols="12" md="4">
              <label class="mb-0 font-weight-bold">
                現在のスタミナ
              </label>
            </b-col>
            <b-col class="text-right d-inline">
              <b-input
                v-model.number="inputCurrentStamina"
                type="number"
                min="0"
                class="d-inline ml-0 input-number-5rem"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <h5 class="output mb-2">[出力] 目標達成予測</h5>
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
        </b-col>
      </b-row>
      <b-container fluid class="mt-4 text-right">
        <b-button v-b-toggle="CalcEventGeneralDebug" variant="info" class="debugButton">
          デバッグ&計算の根拠を見たい人用
        </b-button>
        <b-collapse :id="CalcEventGeneralDebug" class="text-left small">
          <b-alert show variant="info">
            <h6>
              計算の根拠
            </h6>
            <p class="font-weight-bold">
              注意：ここの中はあくまでデバッグ用のメモ書きなので、参考程度に留めて下さい。
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

let uuid = 0;
export default {
  name: 'CalcEventGeneral',
  components: { VueTimepicker },
  beforeCreate() {
    //コンポーネントを再利用した時にidを重複させない為、uuidとuuid付idを生成
    this.uuid = uuid.toString();
    uuid += 1;
    this.CalcEventGeneralDebug = 'CalcEventGeneralDebug_' + this.uuid;
  },
  data() {
    return {
      //現在時間が13:50以前なら本日、以後なら翌日をセット（初期値がいきなりエラーにならないようにする）
      inputEndDate: dayjs().isBefore(
        dayjs()
          .set('h', '13')
          .set('m', '50')
      )
        ? new Date(dayjs().startOf('day'))
        : new Date(
            dayjs()
              .startOf('day')
              .add(1, 'd')
          ),
      inputMinDate: new Date(dayjs().startOf('day')),
      inputEndTime: '13:50',
      inputTarget: 'items',
      inputTargetCurrentValue: 0,
      inputTargetTargetValue: 0,
      inputQuestStamina: 0,
      inputQuestRewards: 1,
      inputMultiplyerMe: 0,
      inputMultiplyerHelper: 0,
      inputCurrentStamina: 0,
    };
  },
  computed: {
    result() {
      const result = [[], [], []]; //メイン出力([0]:項目名、[1]:値。いずれもhtml可)、エラー出力(string(あとでulに入る),1要素1行)、計算詳細出力(string,1要素1行)。

      //各入力値のチェック
      if (
        !dayjs(this.inputEndDate).isValid ||
        dayjs(this.inputEndDate).isBefore(this.inputMinDate)
      ) {
        result[1].push('『イベント終了日時』の『日』が不正です。');
      }
      if (
        !(
          0 <= this.inputEndTime.split(':')[0] &&
          this.inputEndTime.split(':')[0] <= 23 &&
          0 <= this.inputEndTime.split(':')[1] &&
          this.inputEndTime.split(':')[1] <= 59
        )
      ) {
        result[1].push('『イベント終了日時』の『時間』が不正です。');
      }
      if (
        dayjs(this.inputEndDate)
          .set('h', this.inputEndTime.split(':')[0])
          .set('m', this.inputEndTime.split(':')[1])
          .isBefore(dayjs())
      ) {
        result[1].push('『イベント終了日時』が現在時間よりも前です。');
      }
      if (this.inputTarget !== 'items' && this.inputTarget !== 'times') {
        result[1].push('『目標』が不正です。');
      }
      if (this.inputTargetCurrentValue === '' || parseInt(this.inputTargetCurrentValue) < 0) {
        result[1].push('『現状』の『現在』が不正です。');
      }
      if (this.inputTargetTargetValue === '' || parseInt(this.inputTargetTargetValue) < 0) {
        result[1].push('『現状』の『目標』が不正です。');
      }
      if (this.inputQuestStamina === '' || parseInt(this.inputQuestStamina) < 0) {
        result[1].push('『周回するクエスト』の『スタミナ』が不正です。');
      }
      if (
        this.inputTarget === 'items' &&
        (this.inputQuestRewards === '' || parseInt(this.inputQuestRewards) <= 0)
      ) {
        result[1].push('『周回するクエスト』の『報酬』が不正です。');
      }
      if (
        this.inputTarget === 'items' &&
        (this.inputMultiplyerMe === '' || parseInt(this.inputMultiplyerMe) < 0)
      ) {
        result[1].push('『特攻フォト倍率(%)』の『自分』が不正です。');
      }
      if (
        this.inputTarget === 'items' &&
        (this.inputMultiplyerHelper === '' || parseInt(this.inputMultiplyerHelper) < 0)
      ) {
        result[1].push('『特攻フォト倍率(%)』の『助っ人』が不正です。');
      }
      if (this.inputCurrentStamina === '' || parseInt(this.inputCurrentStamina) < 0) {
        result[1].push('『現在のスタミナ』が不正です。');
      }
      //入力エラーがあったら終了
      if (0 < result[1].length) return result;

      //メイン計算処理開始
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

      //残り自然回復スタミナ計算。現在時間との差分を求めて5で割る（余り切り捨て）。
      const tmpLeastStamina = Math.floor(tmpEndTime.diff(dayjs(), 'minutes') / 5);
      result[2].push('残り時間を分に直すと' + tmpEndTime.diff(dayjs(), 'minutes') + '分。');
      result[2].push(
        'これを5で割ってスタミナに換算すると' +
          tmpLeastStamina +
          'スタミナ（小数点以下切り捨て）。これが残りの自然回復分。'
      );
      result[2].push('');

      //不足量計算
      const tmpShortValue = this.inputTargetTargetValue - this.inputTargetCurrentValue;
      result[2].push('不足量(アイテム数もしくは周回数)を計算する。');
      result[2].push(
        this.inputTargetTargetValue +
          '〈目標〉 - ' +
          this.inputTargetCurrentValue +
          '〈現在〉 = ' +
          tmpShortValue +
          '〈不足量〉'
      );
      result[2].push('');

      //既に達成している場合はここで終了。
      if (tmpShortValue <= 0) {
        result[2].push('既に目標を達成しているので計算を終了。');
        result[0].push(['目標', '達成済']);
        return result;
      }

      //必要周回数を求める。目標に応じて処理を分岐。
      let tmpShortRound = 0; //必要周回数
      if (this.inputTarget === 'items') {
        //目標はアイテム数

        //まずフォトの倍率を計算してクエスト１回でどれほどの報酬が見込めるか計算する。
        const tmpUnitofQuestRewards =
          this.inputQuestRewards +
          Math.floor(
            (this.inputQuestRewards * (this.inputMultiplyerMe + this.inputMultiplyerHelper)) / 100
          );
        result[2].push('クエスト1回クリアで報酬がいくらあるのか具体的に計算する。');
        result[2].push(
          'Math.floor(' +
            this.inputQuestRewards +
            '〈クエスト報酬〉 + ' +
            this.inputQuestRewards +
            '〈クエスト報酬〉 * ( ' +
            this.inputMultiplyerMe +
            '〈フォト倍率自分〉 + ' +
            this.inputMultiplyerHelper +
            '〈フォト倍率助っ人〉) / 100)) = ' +
            tmpUnitofQuestRewards +
            '〈具体的なクエスト報酬〉'
        );
        result[2].push('');

        //目標分を回収するのにクエストを何回回さなければいけないか計算する。
        tmpShortRound = Math.ceil(tmpShortValue / tmpUnitofQuestRewards);
        result[2].push('〈具体的なクエスト報酬〉から〈必要周回数〉を求める。');
        result[2].push(
          'Math.ceil( ' +
            tmpShortValue +
            '〈不足量〉 / ' +
            tmpUnitofQuestRewards +
            '〈具体的なクエスト報酬〉) = ' +
            tmpShortRound +
            '〈必要周回数〉'
        );
        result[2].push('');
        result[0].push(['必要周回数', tmpShortRound]);
      } else {
        //目標は周回数(正しく比較するなら(this.inputTarget === 'times')だけど省略 )
        //周回数の場合は不足量がそのまま必要周回数になる。
        tmpShortRound = tmpShortValue;
        result[2].push(
          '目標は周回数なので ' + tmpShortRound + '〈不足量〉がそのまま〈必要周回数〉になる。'
        );
        result[2].push('');
        result[0].push(['必要周回数', tmpShortRound]);
      }

      //不足量を満たす周回数に、スタミナがどれだけ必要かを計算する
      //出力にはスタミナドリンク20換算も併せて乗せる
      const tmpNeedStamina = tmpShortRound * this.inputQuestStamina;
      result[2].push('〈必要周回数〉を回るのにスタミナがどれだけ必要か計算する。');
      result[2].push(
        tmpShortRound +
          '〈必要周回数〉 * ' +
          this.inputQuestStamina +
          '〈クエストスタミナ〉 = ' +
          tmpNeedStamina +
          '〈必要スタミナ〉'
      );
      result[2].push(
        'ドリンク換算だと Math.ceil( ' +
          tmpNeedStamina +
          '〈必要スタミナ〉 / 20) = ' +
          Math.ceil(tmpNeedStamina / 20)
      );
      result[2].push('');
      result[0].push([
        '必要スタミナ<br /><span class="small">(スタミナ20回復ドリンク単純換算)</span>',
        tmpNeedStamina + '(' + Math.ceil(tmpNeedStamina / 20) + '本)',
      ]);
      //スタミナが0ならここで終了（クエストスタミナが0の場合等）
      if (tmpNeedStamina == 0) {
        result[0].push([
          '自然回復分だけで達成可能？',
          '可能<br /><span class="small">(スタミナ不要)</span>',
        ]);
        return result;
      }

      //現在時間からの所持スタミナ+自然回復スタミナで目標が達成できるか調べる。
      if (0 <= this.inputCurrentStamina - tmpNeedStamina) {
        //必要スタミナは現在のスタミナで足りる
        result[2].push(
          tmpNeedStamina +
            '〈必要スタミナ〉よりも ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉のほうが多い為、今すぐに目標を達成することが可能。'
        );
        result[0].push([
          '自然回復分だけで達成可能？',
          '可能<br /><span class="small">(現在のスタミナで可)</span>',
        ]);
        return result;
      } else if (0 <= this.inputCurrentStamina + tmpLeastStamina - tmpNeedStamina) {
        //必要スタミナは現在のスタミナ＋自然回復分で足りる
        result[2].push(
          tmpNeedStamina +
            '〈必要スタミナ〉よりも ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉 + ' +
            tmpLeastStamina +
            '〈残り自然回復分〉のほうが多い為、自然回復分で目標を達成することが可能。'
        );
        result[2].push('');
        result[0].push([
          '自然回復分だけで達成可能？',
          '可能<br /><span class="small">(現在＋自然回復分で可)</span>',
        ]);

        //終了日時計算
        const tmpCompleteDate = dayjs().add((tmpNeedStamina - this.inputCurrentStamina) * 5, 'm');
        result[2].push(
          '目標達成日時は (' +
            tmpNeedStamina +
            '〈必要スタミナ〉- ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉) * 5 = ' +
            (tmpNeedStamina - this.inputCurrentStamina) * 5 +
            ' 分後。すなわち、' +
            tmpCompleteDate.format('MM/DD(dd) HH:mm') +
            '。'
        );
        result[0].push(['目標達成日時', tmpCompleteDate.format('MM/DD(dd) HH:mm')]);
      } else {
        //必要スタミナは現在のスタミナ＋自然回復分では足りない。スタドリの追加が必要。
        const tmpLeastStaminaDrink = Math.ceil(
          (tmpNeedStamina - (this.inputCurrentStamina + tmpLeastStamina)) / 20
        );
        result[2].push(
          tmpNeedStamina +
            '〈必要スタミナ〉のほうが ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉 + ' +
            tmpLeastStamina +
            '〈残り自然回復分〉よりも多い為、自然回復分で目標を達成することは不可能。'
        );
        result[2].push('達成の為追加で飲まなければいけないスタミナドリンク数は以下の通り。');
        result[2].push(
          'Math.ceil( (' +
            tmpNeedStamina +
            '〈必要スタミナ〉 - ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉 - ' +
            tmpLeastStamina +
            '〈残り自然回復分〉) / 20〈スタミナドリンク回復量〉) = ' +
            tmpLeastStaminaDrink
        );
        result[2].push('');
        result[0].push(['自然回復分だけで達成可能？', '不可能']);
        result[0].push([
          '必要スタミナ20回復ドリンク数<br /><span class="small">(必要スタミナ - 現在 - 自然回復分) / 20</span>',
          tmpLeastStaminaDrink,
        ]);

        //終了日時計算
        let tmpCompleteDate = dayjs();
        if (0 < tmpNeedStamina - this.inputCurrentStamina - tmpLeastStaminaDrink * 20) {
          //スタミナドリンクをすべて飲んだ結果必要スタミナを超える場合、その分時間を進める。
          //基本的にここに入るはずだが最後の1本と残り時間次第では入らないかもしれない（ちゃんと考慮してない）ので一応チェックしておく。
          tmpCompleteDate = tmpCompleteDate.add(
            (tmpNeedStamina - this.inputCurrentStamina - tmpLeastStaminaDrink * 20) * 5,
            'm'
          );
        }
        result[2].push(
          '目標達成日時は (' +
            tmpNeedStamina +
            '〈必要スタミナ〉- ' +
            this.inputCurrentStamina +
            '〈現在のスタミナ〉- ( ' +
            tmpLeastStaminaDrink +
            '〈必要スタミナドリンク〉 * 20 ) * 5 = ' +
            (tmpNeedStamina - this.inputCurrentStamina - tmpLeastStaminaDrink * 20) * 5 +
            ' 分後。すなわち、' +
            tmpCompleteDate.format('MM/DD(dd) HH:mm') +
            '。'
        );
        result[0].push(['目標達成日時', tmpCompleteDate.format('MM/DD(dd) HH:mm')]);
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

.outputUnderBorder {
  border-bottom: 2px solid #dee2e6;
}
</style>
