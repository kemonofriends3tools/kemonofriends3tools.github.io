<template>
  <b-container fluid class="mt-2">
    <h1>各種計算</h1>
    <b-container>
      <b-alert show variant="danger" class="small text-center">
        以下の計算はあくまで概算であり、結果を保証するものではありません（特にイベント用計算はかなりの皮算用です）。<br />
        これにより不利益が発生しても当方では何ら責任は負えません。自己責任でご利用下さい。
      </b-alert>
    </b-container>
    <CalcEventGeneral />
    <CalcContestOfStrength :endDate="endDate" />
    <CalcDojo />
    <CalcPicnic />
  </b-container>
</template>

<script>
import CalcEventGeneral from '@/components/CalcEventGeneral.vue';
import CalcContestOfStrength from '@/components/CalcContestOfStrength.vue';
import CalcDojo from '@/components/CalcDojo.vue';
import CalcPicnic from '@/components/CalcPicnic.vue';

import dayjs from 'dayjs';

export default {
  name: 'Calc',
  components: {
    CalcEventGeneral,
    CalcContestOfStrength,
    CalcDojo,
    CalcPicnic,
  },
  data() {
    return {
      //ちからくらべ今期末日付
      endDate: new Date('2020/12/25'),
    };
  },
  beforeMount() {
    //endDateの初期化。初期値が古い場合はとりあえず今月末とする。
    //componentsに渡される前に初期化したいのでbeforeMountにて行う。
    const tmpDate = new Date();
    if (this.endDate < tmpDate) {
      this.endDate = new Date(dayjs().endOf('month'));
    }
  },
};
</script>

<style scoped></style>
