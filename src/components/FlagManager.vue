<template>
  <div>
    <b-alert show variant="danger" class="small">
      注意：この機能は現在開発・テスト中です。<br />
      詳細はdiscordのほうでご確認下さい。
    </b-alert>
    <b-container fluid>
      <b-row align-h="center">
        <b-col cols="10" class="px-1">
          <b-button
            class="controlBtn"
            size="sm"
            v-b-modal.modal-friendsSelector
            ref="btnFriendsSelect"
          >
            <i class="fas fa-paw pr-1"></i> フレンズ設定
          </b-button>
          <b-modal
            id="modal-friendsSelector"
            title="フレンズ設定"
            title-tag="h4"
            size="xl"
            no-close-on-backdrop
            modal-ok
            cancelDisabled
          >
            <b-container fluid>
              <b-alert show variant="info" class="small">
                文字入力でフレンズを絞り込むことが出来ます。
              </b-alert>
              <v-select
                v-for="i in 5"
                :key="'friendsSelect' + i"
                v-model="friendsNameArray[i - 1]"
                :options="getFriendsNameList"
                placeholder="フレンズ選択"
                class="my-1"
                style="width: 100%"
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    <em>{{ search }}</em>
                    に一致する項目は存在しません。
                  </template>
                  <template v-else>
                    選択可能なフレンズが居ません。
                  </template>
                </template>
              </v-select>
            </b-container>
            <template v-slot:modal-footer="{ ok }">
              <b-button
                @click="
                  ok();
                  setFriends();
                "
              >
                決定
              </b-button>
            </template>
          </b-modal>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col
          cols="2"
          class="px-1 text-center small"
          style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
          v-for="(name, index) in friendsNameArray"
          :key="index + name"
        >
          {{ name }}
        </b-col>
      </b-row>
      <b-row align-h="center" v-for="i in 5" :key="'i' + i">
        <b-col cols="2" class="px-1" v-for="j in 5" :key="'j' + j">
          <b-button
            :disabled="flagsState[(i - 1) * 5 + j - 1]"
            @click="flagClicked((i - 1) * 5 + j - 1)"
            :class="
              getFlagCorrectionColumnClass(
                'my-1 mx-0 px-0 py-1 flagButton',
                flagsNameArray[(i - 1) * 5 + j - 1]
              )
            "
            style="width:100%"
            size="sm"
          >
            {{ flagsNameArray[(i - 1) * 5 + j - 1] }}
          </b-button>
        </b-col>
      </b-row>
      <b-row class="my-2" align-h="center">
        <b-col cols="4" class="px-1">
          <b-button
            class="controlBtn"
            size="sm"
            @click="buttonBackClicked"
            :disabled="userInputHistory.length <= 0"
          >
            <i class="fas fa-backward pr-1"></i>１手前へ
          </b-button>
        </b-col>
        <b-col cols="6" class="px-1">
          <b-button class="controlBtn" size="sm" @click="buttonResetClicked">
            <i class="fas fa-undo-alt pr-1"></i>リセット
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import friendsJson from '../json/friends.json';

export default {
  name: 'FlagManager',
  props: {
    cookieKey: String, //パーティーを保存するcookieキー名
  },
  data() {
    return {
      friendsNameArray: undefined, //フレンズ名
      flagsNameArray: undefined, //フラッグ名
      flagsState: Array(25).fill(false), //フラッグボタンのクリック状態
      userInputHistory: [], //ユーザーの入力履歴
    };
  },
  created() {
    //フレンズ名配列初期化
    this.setFriendsNameArray();
  },
  watch: {
    //cookieキー名が変化した場合の処理
    //一般にHomeTopInfoの曜日タブが切り替わった場合を想定している。
    cookieKey() {
      //フレンズ名配列初期化
      this.setFriendsNameArray();
    },
  },
  computed: {
    //全フレンズ名リストをfriendsJsonから作り出す。
    getFriendsNameList() {
      const tmpArray = [];
      friendsJson.forEach(i => tmpArray.push(i.名前));
      //ソートして返す
      return tmpArray.sort();
    },
  },
  methods: {
    //フレンズ名配列を作る。加えてフラッグ名初期化やリセットボタン動作も行う（呼び出す）。
    setFriendsNameArray() {
      //cookieキー確認
      if (this.cookieKey && this.$cookies.isKey(this.cookieKey)) {
        //cookieが存在。取り出してデコードしてセット。
        this.friendsNameArray = decodeURIComponent(this.$cookies.get(this.cookieKey)).split(',');
      } else {
        //cookieキーは存在しない。デフォルト値をセット。
        this.friendsNameArray = [
          'ドール',
          'ミーアキャット',
          'マイルカ',
          'アライグマ',
          'フェネック',
        ];
      }
      //フラッグ名初期化
      this.setflagsNameArray();
    },
    //フラッグ名配列を作る。加えてリセットボタン動作も行う（呼び出す）。
    setflagsNameArray() {
      this.flagsNameArray = Array(25);
      this.friendsNameArray.forEach((name, index) => {
        if (name) {
          //フレンズ名有効。jsonをフレンズ名で検索。
          const tmpRow = friendsJson.find(i => name == i.名前);
          //フラッグを１つずつ読み、省略名ではなく表示名に直して配列に格納する。
          for (let i = 1; i <= 5; i++) {
            let tmpFlag = '';
            if (tmpRow['flag' + i].match(/^b/i)) {
              tmpFlag = 'B';
            } else if (tmpRow['flag' + i].match(/^a/i)) {
              tmpFlag = 'A ' + tmpRow['flag' + i].substring(1);
            } else if (tmpRow['flag' + i].match(/^t/i)) {
              tmpFlag = 'T ' + tmpRow['flag' + i].substring(1);
            }
            this.flagsNameArray[index + (i - 1) * 5] = tmpFlag;
          }
        } else {
          //フレンズ名無効。ダミーで埋める。
          for (let i = 1; i <= 5; i++) this.flagsNameArray[index + (i - 1) * 5] = '----';
        }
      });
      //フラッグボタン,入力履歴初期化
      this.buttonResetClicked();
    },
    //フラッグボタン全体を指定の状態でリセットする。
    //引数は全ボタンに設定したい状態。引数無しで呼び出すとfalseが入る。(引数で変更できるようにしたのは１つ戻るボタンの為）
    //動作としては全フラッグボタンを初期化した後、フレンズ未選択枠ボタンを無効化する。
    //基本リセットボタンを押したときの動作だが、いくつかのmethodsで同様の処理を行うため、汎用出来るようここに定義しておく。
    flagRefresh(setValue = false) {
      //全フラッグボタンを有効化
      this.flagsState = Array(25).fill(setValue);
      //フレンズ未選択枠があった場合はそこを無効化
      this.friendsNameArray.forEach((name, index) => {
        if (!name) for (let i = 0; i < 5; i++) this.$set(this.flagsState, i * 5 + index, true);
      });
    },
    //フラッグボタンをクリックした場合の動作
    flagClicked(index) {
      //フラッグボタンが有効な場合のみ処理（念の為）
      if (!this.flagsState[index]) {
        //クリックしたフラッグの表示ステータスを変更
        this.$set(this.flagsState, index, true);
        //入力履歴に追加する
        this.userInputHistory.push(index);
        //全てがクリックされていた場合はフラッグボタン初期化
        if (this.flagsState.every(i => i == true)) this.flagRefresh();
      }
    },
    //１つ戻るボタンクリック時の動作
    buttonBackClicked() {
      //入力履歴が存在する場合のみ処理
      if (1 <= this.userInputHistory.length) {
        //最後の要素をpop
        const index = this.userInputHistory.pop();
        //もし現在全てのフラッグボタンについて、（ボタンが有効 または そのボタンが属するフレンズ名が無効（nullや空文字)) ならば、
        //上で読み取ったユーザー入力は前デッキの最後のフラッグ選択ということになる。
        //その場合正しく１つ前の状態とするためflagRefresh()を引数true付きで呼び、初期化する。
        if (
          this.flagsState.every(
            (value, index) => value == false || !this.friendsNameArray[index % 5]
          )
        )
          this.flagRefresh(true);
        //取り出した要素を反映し、１つ前の状態に戻す(対象のボタンを有効状態に戻す)。
        this.$set(this.flagsState, index, false);
      }
    },
    //リセットボタンクリック時の動作
    buttonResetClicked() {
      //フラッグボタン初期化
      this.flagRefresh();
      //入力履歴初期化
      this.userInputHistory = [];
    },
    //フラッグ関係カラムに使用する背景色classを取得する
    //['beat', 'try', 'action']などの文字列が来ることを想定し、頭1文字で判定して対応するclassを返す。
    //第一引数では背景色以外に適用したいクラスを受け付けている。
    getFlagCorrectionColumnClass(otherClassesStr, i) {
      let tmpFlag = ' color-';
      if (i.match(/^b/i)) {
        tmpFlag += 'beat';
      } else if (i.match(/^a/i)) {
        tmpFlag += 'action';
      } else if (i.match(/^t/i)) {
        tmpFlag += 'try';
      } else {
        tmpFlag = '';
      }
      return otherClassesStr + tmpFlag;
    },
    //フレンズ選択モーダルにてOKボタンを押したときの動作
    //実際にはフレンズ名はリアルタイムでセットされているので、ここではフラッグ名やステータスのリセット動作や、cookieへの保存を行う。
    setFriends() {
      //フラッグ名のセット。内部でステータスのリセット動作も行っている。
      this.setflagsNameArray();
      //cookieキーが有効ならcookieにパーティーを保存する。日本語を含むのでencodeURIComponentでエンコードする（encodeURIComponentは','もエンコード対象）
      if (this.cookieKey)
        this.$cookies.set(this.cookieKey, encodeURIComponent(this.friendsNameArray.join(',')));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/paletton';
.controlBtn {
  width: 100%;
  border-radius: 1rem;
}

.btn.disabled {
  opacity: 0.4;
  background: rgba(0, 0, 0, 0.3);
}

.flagButton {
  border-width: 0;
  border-radius: 0.2rem;
  font-weight: 700;
  color: rgba(white, 95%);
}

.color-beat {
  background: linear-gradient(90deg, $beat-color-1 0%, $beat-color-2 100%);
  padding-left: 5%;
  text-shadow: 2px 2px 2px $beat-color-1, 2px -2px 2px $beat-color-1, -2px 2px 2px $beat-color-1,
    -2px -2px 2px $beat-color-1, 2px 0px 2px $beat-color-1, 0px 2px 2px $beat-color-1,
    -2px 0px 2px $beat-color-1, 0px -2px 2px $beat-color-1;
}
.color-action {
  background: linear-gradient(90deg, $action-color-1 0%, $action-color-2 100%);
  padding-left: 5%;
  text-shadow: 2px 2px 2px $action-color-1, 2px -2px 2px $action-color-1,
    -2px 2px 2px $action-color-1, -2px -2px 2px $action-color-1, 2px 0px 2px $action-color-1,
    0px 2px 2px $action-color-1, -2px 0px 2px $action-color-1, 0px -2px 2px $action-color-1;
}
.color-try {
  background: linear-gradient(90deg, $try-color-1 0%, $try-color-2 100%);
  padding-left: 5%;
  text-shadow: 2px 2px 2px $try-color-1, 2px -2px 2px $try-color-1, -2px 2px 2px $try-color-1,
    -2px -2px 2px $try-color-1, 2px 0px 2px $try-color-1, 0px 2px 2px $try-color-1,
    -2px 0px 2px $try-color-1, 0px -2px 2px $try-color-1;
}
</style>
