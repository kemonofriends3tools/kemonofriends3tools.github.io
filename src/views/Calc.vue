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
    <CalcContestOfStrength />
    <CalcDojo />
    <CalcPicnic />
  </b-container>
</template>

<script>
import CalcEventGeneral from '@/components/CalcEventGeneral.vue';
import CalcContestOfStrength from '@/components/CalcContestOfStrength.vue';
import CalcDojo from '@/components/CalcDojo.vue';
import CalcPicnic from '@/components/CalcPicnic.vue';

export default {
  name: 'Calc',
  components: {
    CalcEventGeneral,
    CalcContestOfStrength,
    CalcDojo,
    CalcPicnic,
  },
};
</script>

<style scoped></style>
