<template>
  <b-container>
    <b-card class="mb-2" title="[シーサーバル道場β] 獲得報酬計算">
      <b-alert show variant="info" class="small mb-0">
        指定された日までに道場からいくつアイテムが貰えるかを計算します。<br />
        主に今期末までに『リウキウおしゃれメダル』があと何枚手に入るのか？ドレス交換が間に合うのか？を見極めるためのものです。
      </b-alert>
      <h5 class="input">[入力] 道場プレイ状況</h5>
      <b-alert show variant="warning" class="small">
        曜日の入力欄には平均スコアを入力して下さい。キラキラを使って2回挑戦する場合は『2回挑戦』チェックボックスを入れて下さい。
      </b-alert>
      <div class="d-flex flex-wrap align-items-center justify-content-center p-2">
        <label class="mb-0 font-weight-bold">
          今期終了日（or 目標日）：
        </label>
        <v-date-picker v-model="inputEndDate" color="green" :min-date="minDate" is-required>
          <template v-slot="{ inputValue, inputEvents }">
            <input
              readonly
              class="datePickerInput form-control"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
      </div>
      <div class="dayOfWeek-parent d-flex flex-wrap justify-content-center p-0 text-center mb-2">
        <template v-for="(dayOfWeek, index) of ['月', '火', '水', '木', '金', '土', '日']">
          <div :key="dayOfWeek" :class="dojoTypeStyle[index]" class="dayOfWeek-child">
            <p class="typeIcon-parent mb-1 font-weight-bold">
              {{ dayOfWeek }}
              <span class="typeIcon">
                <TypeNameToIcon :type="dojoType[index]" :imgRemSize="1.5" />
              </span>
            </p>
            <b-input v-model="averageScore[index]" type="number" min="0" class="d-inline" />
            {{ dailyRewards[index]['string'] }}
            <b-checkbox v-model.number="NumberOfTime[index]" value="2" unchecked-value="1">
              2回挑戦
            </b-checkbox>
          </div>
        </template>
      </div>

      <b-alert show variant="info" class="small">
        <h6>参考（獲得報酬一覧）</h6>
        <b-table-lite small borderless striped :items="rewardList" :fields="rewardListFields">
        </b-table-lite>
      </b-alert>
      <b-card-text>
        <h5 class="output">[出力] 獲得予想数</h5>
        本日から<span class="font-weight-bold">{{ estimatedMedals[0] }}</span>
        まで上記の条件でプレイし続けた場合、
        <span class="font-weight-bold">輝きの欠片:{{ estimatedMedals[1] }} </span>、
        <span class="font-weight-bold">リウキウおしゃれメダル:{{ estimatedMedals[2] }} </span>、
        <span class="font-weight-bold">ちゅーばーのあかし:{{ estimatedMedals[3] }} </span>
        が手に入ります。
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import dayjs from 'dayjs';

import TypeNameToIcon from '@/components/TypeNameToIcon.vue';

import dojoJson from '../json/dojo.json';
import dojoRewardsJson from '../json/dojo_rewards.json';

export default {
  name: 'CalcDojo',
  components: {
    TypeNameToIcon,
  },
  data() {
    return {
      //今期終了日初期値設定（今月末）
      inputEndDate: new Date(dayjs().endOf('month')),

      //昨日以前は選択不可にする（最低値は本日）
      //v-calenderのバグなのか、時間を以下のようにギリギリに設定しないと見た目disableにも関わらず選択出来てしまった。
      //ワークアラウンドとして以下のようにしている。
      minDate: new Date(new Date().setHours(23, 59, 59, 999)),

      averageScore: ['0', '0', '0', '0', '0', '0', '0'],
      NumberOfTime: ['1', '1', '1', '1', '1', '1', '1'],
      dojoType: ['', '', '', '', '', '', ''],
      dojoTypeStyle: ['', '', '', '', '', '', ''],
      rewardList: dojoRewardsJson,
      rewardListFields: [
        {
          key: 'スコア',
          formatter: value => {
            return value + '～';
          },
        },
        '輝きの欠片',
        'リウキウおしゃれメダル',
        'ちゅーばーのあかし',
      ],
    };
  },
  beforeMount() {
    //道場の情報をロード、敵属性を読み出し保存し、同時にスタイルにも保存する。
    let counter = 0;
    for (let dayOfWeek of ['月', '火', '水', '木', '金', '土', '日']) {
      this.dojoType[counter] = dojoJson[1][dayOfWeek];
      switch (dojoJson[1][dayOfWeek]) {
        case 'ファニー':
          this.dojoTypeStyle[counter] = 'bg-funny';
          break;
        case 'フレンドリー':
          this.dojoTypeStyle[counter] = 'bg-friendly';
          break;
        case 'リラックス':
          this.dojoTypeStyle[counter] = 'bg-relax';
          break;
        case 'ラブリー':
          this.dojoTypeStyle[counter] = 'bg-lovely';
          break;
        case 'アクティブ':
          this.dojoTypeStyle[counter] = 'bg-active';
          break;
        case 'マイペース':
          this.dojoTypeStyle[counter] = 'bg-mypace';
          break;
      }
      counter++;
    }
  },
  computed: {
    dailyRewards() {
      //入力されたスコアに対する報酬を求める。
      const outArray = [];
      for (let i = 0; i < 7; i++) {
        //スコア数値化・正規化
        let tmpScore = this.averageScore[i];
        tmpScore = parseInt(tmpScore);
        if (isNaN(tmpScore)) tmpScore = 0;

        //rewardListがスコア順に並んでいれば良いが、そうでない場合を考慮して適用済スコアをThresholdとして変数で持っておく。
        //これは0から始めて過去適用した最も高いしきい値を保存しておくので、順不同であっても変数は１つで済む
        let beforeThreshold = 0;
        let kakera = 0;
        let medal = 0;
        let tyuuba = 0;

        for (let tmprewardList of this.rewardList) {
          if (tmprewardList['スコア'] <= tmpScore && beforeThreshold < tmprewardList['スコア']) {
            //スコアが上回っており、thresholdがbeforeThresholdより多い場合報酬を更新
            beforeThreshold = tmprewardList['スコア'];
            kakera = tmprewardList['輝きの欠片'];
            medal = tmprewardList['リウキウおしゃれメダル'];
            tyuuba = tmprewardList['ちゅーばーのあかし'];
          }
        }
        //もし値が空だった場合は0に変換する。
        if (!kakera) kakera = 0;
        if (!medal) medal = 0;
        if (!tyuuba) tyuuba = 0;

        outArray.push({
          string: '欠片:' + kakera + ' メダル:' + medal + ' ちゅーばー:' + tyuuba, //曜日欄出力用
          輝きの欠片: kakera,
          リウキウおしゃれメダル: medal,
          ちゅーばーのあかし: tyuuba,
        });
      }
      return outArray;
    },
    estimatedMedals() {
      const targetDate = dayjs(this.inputEndDate).startOf('day'); //時間は0時に
      let today = dayjs().startOf('day'); //時間は0時に

      //出力用
      let kakera = 0;
      let medal = 0;
      let tyuuba = 0;

      //targetDateまでに何曜日が何回あるかのカウンター
      const daysMultiplier = ['0', '0', '0', '0', '0', '0', '0'];

      if (targetDate.isBefore(today)) {
        //minで止めてるので基本ここに来ることは無いはず
        return '指定された日付は過去の日付です。';
      } else {
        //todayがポインタで、1日ずつずらしながらtargetDateを目指す。
        while (targetDate.isSameOrAfter(today)) {
          //曜日を取得(引数'day'は曜日。'date'ではない。)。dayjs.get('day')は日曜:0-土曜:6なので、月曜:0-日曜:6となるよう１つずらす。
          let dayOfWeek = today.get('day') - 1;
          if (dayOfWeek < 0) dayOfWeek = 6; //日曜は後ろに回す
          //曜日カウンターに追加
          daysMultiplier[dayOfWeek]++;
          //次の日へ
          today = today.add(1, 'd');
          //ブラウザが固まるのを防止。とりあえず100週間程度を見ておく。
          if (100 < daysMultiplier[dayOfWeek])
            return '100週間以上先の日付が指定されたため、処理を中断しました。';
        }

        //メインの計算
        for (let i = 0; i < 7; i++) {
          kakera += this.dailyRewards[i]['輝きの欠片'] * this.NumberOfTime[i] * daysMultiplier[i];
          medal +=
            this.dailyRewards[i]['リウキウおしゃれメダル'] *
            this.NumberOfTime[i] *
            daysMultiplier[i];
          tyuuba +=
            this.dailyRewards[i]['ちゅーばーのあかし'] * this.NumberOfTime[i] * daysMultiplier[i];
        }
      }

      return [targetDate.format('MM/DD(dd)'), kakera, medal, tyuuba];
    },
  },
};
</script>

<style lang="scss" scoped>
//パレット
@import '../assets/scss/paletton';

.bg-funny {
  background: linear-gradient(rgb($funny-color, 0.5) 20%, rgb($funny-color, 0.2) 95%, transparent);
}
.bg-friendly {
  background: linear-gradient(
    rgb($friendly-color, 0.5) 20%,
    rgb($friendly-color, 0.2) 95%,
    transparent
  );
}
.bg-relax {
  background: linear-gradient(rgb($relax-color, 0.5) 20%, $relax-background-color 95%, transparent);
}
.bg-lovely {
  background: linear-gradient(rgb($lovely-color, 1) 20%, $lovely-background-color 95%, transparent);
}
.bg-active {
  background: linear-gradient(rgb($active-color, 1) 20%, $active-background-color 95%, transparent);
}
.bg-mypace {
  background: linear-gradient(rgb($mypace-color, 1) 20%, $mypace-background-color 95%, transparent);
}

//曜日入力欄
div.dayOfWeek-parent {
  //b-rowを使うと-15pxされるのでおそらく安全。
  //ここまで横幅伸ばさないとスマホ縦画面のときに曜日入力欄が2列に並ばない。
  margin: 0 -15px;

  div.dayOfWeek-child {
    margin: 0px 0.25rem;
    width: 8rem;
    border-radius: 1rem;
  }

  p.typeIcon-parent {
    position: relative;

    span.typeIcon {
      position: absolute;
      top: 2px;
      right: 4px;
    }
  }
}
</style>
