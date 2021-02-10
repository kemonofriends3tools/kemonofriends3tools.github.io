//resizable table
// base: https://stackoverflow.com/questions/52759087/resizable-vue-good-table-or-vue
//上記URLではmounted時にDOMからthを探し出してイベントリスナを追加する方法を用いているが、
//それだとテーブルのカラム列が動的に変化する場合に対応できないので、各th内に手動で準備する方式としている。
//例えばvue-good-tableに組み込む場合は以下のようにする。
// <template v-slot:table-column="props">
//   {{ props.column.label }}
//   <!-- resizable table用のハンドル。それとここの親であるthにposition:relativeを入れる必要があるが、.vgt-table thにて既にそう定義されているようなので特に何もしない。 -->
//   <div class="resizableTableHandle" @mousedown="resizableTableEventHandler($event)">
//     &nbsp;
//   </div>
// </template>

//グローバル変数
var thElm;
var startOffset;

export default {
  methods: {
    //th内ハンドルのmousedownに追加するイベントハンドラー。
    resizableTableEventHandler(event) {
      thElm = event.target.parentNode;
      startOffset = event.target.parentNode.offsetWidth - event.pageX;
    },
  },
  mounted() {
    //グローバルなmousemove,mouseupイベントハンドラ追加
    document.addEventListener('mousemove', e => {
      if (thElm) thElm.style.width = startOffset + e.pageX + 'px';
    });
    document.addEventListener('mouseup', () => (thElm = undefined));
  },
};
