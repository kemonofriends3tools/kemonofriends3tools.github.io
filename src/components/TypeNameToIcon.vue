<template>
  <span>
    <img v-if="type == 'ファニー'" src="@/assets/svg/funny.svg" :alt="type" :style="imgStyle" />
    <img
      v-else-if="type == 'フレンドリー'"
      src="@/assets/svg/friendly.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'リラックス'"
      src="@/assets/svg/relax.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'ラブリー'"
      src="@/assets/svg/lovely.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'アクティブ'"
      src="@/assets/svg/active.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'マイペース'"
      src="@/assets/svg/mypace.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'photoType1'"
      src="@/assets/svg/paw.svg"
      :alt="type"
      :style="imgStyle"
    />
    <img
      v-else-if="type == 'photoType2'"
      src="@/assets/svg/night.svg"
      :alt="type"
      :style="imgStyle"
    />
    <template v-else-if="type === ''">
      無
    </template>
    <template v-else>
      {{ type }}
    </template>
  </span>
</template>

<script>
export default {
  name: 'TypeNameToIcon',
  props: {
    type: String,
    imgRemSize: Number,
  },
  computed: {
    imgStyle() {
      //imgRemSizeが指定してあればそちらを。そうでないならデフォルト値を設定し、styleを組む。
      let size = this.imgRemSize;
      if (!size || size == '') {
        size = 1.8;
      }
      return 'width: ' + size + 'rem; height: ' + size + 'rem;';
    },
  },
};
</script>

<style scoped></style>
