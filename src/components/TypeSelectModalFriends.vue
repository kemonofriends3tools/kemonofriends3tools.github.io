<template>
  <span>
    <b-button v-b-modal="mordalID" class="filter-type-button">
      <slot>{{ field }}選択</slot>
    </b-button>
    <b-modal :id="mordalID" :title="field + '選択'" title-tag="h4" centered>
      <b-container fluid>
        <b-row align-h="center" class="text-center">
          <b-col>
            <b-row>
              <b-col>
                <b-button class="type-button-padding" @click="typeFriendsSelected('ファニー')">
                  <img src="@/assets/svg/funny.svg" class="type-icon-size-2rem" alt="ファニー" />
                </b-button>
              </b-col>
            </b-row>
            <b-row align-h="center" class="d-none d-sm-block">
              <b-col>
                <i
                  class="fas fa-long-arrow-alt-right fa-2x fa-arrow-padding fa-rotate-minus-45 hidden-sm hidden-xs"
                />
                <i
                  class="fas fa-long-arrow-alt-right fa-2x fa-arrow-padding fa-rotate-45 hidden-sm hidden-xs"
                />
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col>
                <b-button class="type-button-padding" @click="typeFriendsSelected('リラックス')">
                  <img src="@/assets/svg/relax.svg" class="type-icon-size-2rem" alt="リラックス" />
                </b-button>
                <i class="d-none d-sm-inline fas fa-long-arrow-alt-left fa-2x fa-arrow-padding" />
                <b-button class="type-button-padding" @click="typeFriendsSelected('フレンドリー')">
                  <img
                    src="@/assets/svg/friendly.svg"
                    class="type-icon-size-2rem"
                    alt="フレンドリー"
                  />
                </b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
              <b-col>
                <b-button class="type-button-padding" @click="typeFriendsSelected('ラブリー')">
                  <img src="@/assets/svg/lovely.svg" class="type-icon-size-2rem" alt="ラブリー" />
                </b-button>
              </b-col>
            </b-row>
            <b-row align-h="center" class="d-none d-sm-block">
              <b-col>
                <i
                  class="fas fa-long-arrow-alt-right fa-2x fa-arrow-padding fa-rotate-minus-45 hidden-sm hidden-xs"
                />
                <i
                  class="fas fa-long-arrow-alt-right fa-2x fa-arrow-padding fa-rotate-45 hidden-sm hidden-xs"
                />
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col>
                <b-button class="type-button-padding" @click="typeFriendsSelected('マイペース')">
                  <img src="@/assets/svg/mypace.svg" class="type-icon-size-2rem" alt="マイペース" />
                </b-button>
                <i class="d-none d-sm-inline fas fa-long-arrow-alt-left fa-2x fa-arrow-padding" />
                <b-button class="type-button-padding" @click="typeFriendsSelected('アクティブ')">
                  <img src="@/assets/svg/active.svg" class="type-icon-size-2rem" alt="アクティブ" />
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer>
        <b-button @click="typeFriendsSelected('')">
          無選択
        </b-button>
      </template>
    </b-modal>
  </span>
</template>

<script>
export default {
  name: 'TypeSelectModalFriends',
  props: {
    field: String,
  },
  computed: {
    //modalに使うid文字列。属性とサブ属性で混じってダイアログが二重に出たりする問題の対策。
    //この定義は変わることがないので外に出しても良いかもしれないが、propsとの初期化タイミングが自信なかったのでcompoutedにしておく
    mordalID() {
      return 'modal-type-select-' + this.field;
    },
  },
  methods: {
    typeFriendsSelected(type) {
      //親のtypeFriendsSelectedをコールして選択されたタイプを投げる。その後modalを閉じる。
      this.$emit('typeFriendsSelected', type);
      this.$bvModal.hide(this.mordalID);
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
