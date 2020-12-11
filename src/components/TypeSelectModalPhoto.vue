<template>
  <span>
    <b-button v-b-modal.modal-type-select ref="btnTypeSelectPhoto" class="filter-type-button">
      <slot>属性選択</slot>
    </b-button>
    <b-modal id="modal-type-select" title="属性選択" title-tag="h4" centered>
      <b-container fluid>
        <b-row align-h="center" class="text-center">
          <b-col>
            <b-button class="type-button-padding mx-3" @click="typePhotoSelected('photoType1')">
              <img src="@/assets/svg/paw.svg" class="type-icon-size-2rem" alt="photoType1" />
            </b-button>
            <b-button class="type-button-padding mx-3" @click="typePhotoSelected('photoType2')">
              <img src="@/assets/svg/night.svg" class="type-icon-size-2rem" alt="photoType2" />
            </b-button>
          </b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer>
        <b-button @click="typePhotoSelected('')">
          無選択
        </b-button>
      </template>
    </b-modal>
  </span>
</template>

<script>
export default {
  name: 'TypeSelectModalPhoto',
  methods: {
    typePhotoSelected(type) {
      //親のtypePhotoSelectedをコールして選択されたタイプを投げる。その後modalを閉じる。
      this.$emit('typePhotoSelected', type);
      this.$root.$emit('bv::hide::modal', 'modal-type-select', '#btnTypeSelectPhoto');
    },
  },
};
</script>

<style scoped>
.filter-type-button {
  padding: 0rem 0.4rem;
  border-radius: 0.65rem;
  width: 100%;
}

.type-button-padding {
  padding: 0.2rem 0.4rem;
}
.type-icon-size-2rem {
  width: 2rem;
  height: 2rem;
}

.fa-rotate-45 {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
.fa-rotate-minus-45 {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.fa-arrow-padding {
  padding: 0 0.4em;
  vertical-align: middle;
}
</style>
