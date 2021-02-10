<template>
  <b-container fluid class="mt-2">
    <h1>イベント・しょうたい検索</h1>
    <b-container fluid>
      <b-alert show variant="info" class="small mb-1">
        使い方に少々クセがあります。詳しくは下の「使い方」を押してください。
      </b-alert>
      <div class="text-right">
        <b-button v-b-toggle.collapse1.collapse2.collapse3 variant="info">
          <b-icon
            class="align-text-bottom mx-1"
            icon="question-circle-fill"
            variant="light"
          />使い方
        </b-button>
      </div>

      <!-- table-attached-headerのfirst/last-childを見ているのでこのdivは必要 -->
      <div>
        <div class="table-attached-header table-attached-header-solidBottom">
          <div>
            <b-icon
              class="table-attached-header-icon"
              icon="funnel"
              variant="dark"
              font-scale="1.5"
            />
          </div>
          <div class="table-attached-header-contents pl-1" style="width: calc(100% - 25px)">
            <b-row class="w-100">
              <b-col cols="12" class="px-1">
                <b-alert show variant="warning" class="small mb-1">
                  以下の検索欄はすべてand条件で繋がっており、他の検索条件により選択できる内容が動的に変わり（絞り込まれ）ます。<br />
                  例えばデフォルトでは除外タグに『恒常』が指定されています。そのため『個別検索 ＞
                  家具』としても家具名は空になります（現在家具は恒常のメインシナリオ等のみの為）<br />
                  なにかおかしいと思ったら他の条件を見直してみてください（単純にはタグを両方とも空にしてみてください）。
                </b-alert>
              </b-col>
              <b-col cols="12" class="px-1">
                <b-collapse id="collapse1">
                  <b-alert show variant="info" class="small mb-1">
                    １：最初にここで検索したいものを入力してください。例えば以下のような感じです。<br />
                    <p class="my-1 ml-2">
                      特定フレンズがいつ引けたか調べたい場合：個別検索 ＞ フレンズ ＞
                      [探したいフレンズ名] ＞ フレンズ（招待または配布）<br />
                      週末ピックアップを見たい場合：イベント検索 ＞ しょうたい ＞ 週末ピックアップ
                    </p>
                    ここの選択ボックスは探したい文字列の一部を入力することで候補を絞り込むことが出来ます。フレンズやフォトを探すときに便利です。タグは複数選択可能です（AND条件）。
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12" sm="5" xl="3" class="px-1 my-1" v-if="SearchFilter.target.visible">
                <v-select
                  v-model="SearchFilter.target.value"
                  :options="SearchFilter.target.list"
                  :placeholder="SearchFilter.target.placeholder"
                  @input="selectedTarget"
                  class="background-white"
                  style="width: 100%"
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <em>{{ search }}</em>
                      に一致する項目は存在しません。
                    </template>
                    <template v-else>
                      選択可能な{{ SearchFilter.target.placeholder }}はありません。
                    </template>
                  </template>
                </v-select>
              </b-col>
              <b-col cols="12" sm="7" xl="3" class="px-1 my-1" v-if="SearchFilter.category.visible">
                <v-select
                  v-model="SearchFilter.category.value"
                  :options="getCategoryList"
                  :placeholder="SearchFilter.category.placeholder"
                  @input="selectedCategory"
                  class="background-white"
                  style="width: 100%"
                  :selectable="option => !option.startsWith('━')"
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <em>{{ search }}</em>
                      に一致する項目は存在しません。
                    </template>
                    <template v-else>
                      選択可能な{{ SearchFilter.category.placeholder }}はありません。
                    </template>
                  </template>
                </v-select>
              </b-col>
              <b-col cols="12" xl="6" class="px-1 my-1" v-if="SearchFilter.name.visible">
                <v-select
                  v-model="SearchFilter.name.value"
                  :options="getNameList"
                  :placeholder="SearchFilter.name.placeholder"
                  class="background-white"
                  style="width: 100%"
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <em>{{ search }}</em>
                      に一致する項目は存在しません。
                    </template>
                    <template v-else>
                      選択可能な{{ SearchFilter.name.placeholder }}はありません。
                    </template>
                  </template>
                </v-select>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12" class="px-1">
                <b-collapse id="collapse1">
                  <b-alert show variant="info" class="small mb-1">
                    ２：ここで指定されたタグを持つデータは非表示となります。<br />
                    １にタグを指定できる機能がありますが、これはその逆となります。１のタグ指定とは併用できるので、データをさらに絞り込むことが出来ます。<br />
                    条件はOR条件です。この中のタグが１つでも含まれていたら非表示となります。<br />
                    デフォルトでは"恒常"や"有料パック"などが指定されています。これらは一般的に邪魔になることが多いと予想される為です。恒常フレンズや有用インテリア等を探したいときには邪魔になるので、それら外して下さい。
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row class="w-100 mr-0 my-1">
              <b-col cols="12" sm="auto" class="pr-0 align-self-center">次のタグを含む：</b-col>
              <b-col cols="12" sm="auto" class="pr-1 flex-grow-1">
                <v-select
                  multiple
                  v-model="SearchFilter.tags.valueOK"
                  :options="getTagList"
                  :placeholder="SearchFilter.tags.placeholder"
                  class="background-white"
                  :selectable="option => !option.startsWith('━')"
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <em>{{ search }}</em>
                      に一致する項目は存在しません。
                    </template>
                    <template v-else>
                      選択可能な{{ SearchFilter.tags.placeholder }}はありません。
                    </template>
                  </template>
                </v-select>
              </b-col>
            </b-row>
            <b-row class="w-100 mr-0 my-1">
              <b-col cols="12" sm="auto" class="pr-0 align-self-center">次のタグを除く：</b-col>
              <b-col cols="12" sm="auto" class="pr-1 flex-grow-1">
                <v-select
                  multiple
                  v-model="SearchFilter.tags.valueNG"
                  :options="getTagList"
                  :placeholder="SearchFilter.tags.placeholder"
                  class="background-white"
                  :selectable="option => !option.startsWith('━')"
                >
                  <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                      <em>{{ search }}</em>
                      に一致する項目は存在しません。
                    </template>
                    <template v-else>
                      選択可能な{{ SearchFilter.tags.placeholder }}はありません。
                    </template>
                  </template>
                </v-select>
              </b-col>
            </b-row>
          </div>
        </div>
        <div
          class="table-attached-header table-attached-header-solidBottom"
          style="background: #fdfcf9 !important"
        >
          <div class="d-none d-sm-block">
            <b-icon
              class="table-attached-header-icon"
              icon="calendar3"
              variant="dark"
              font-scale="1.5"
            />
          </div>
          <b-container fluid>
            <b-row class="d-block d-sm-none">
              <b-col cols="12" class="mt-2 p-0" sytle="margin-left: -24px">
                <b-icon
                  class="table-attached-header-icon"
                  icon="calendar3"
                  variant="dark"
                  font-scale="1.5"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" class="pl-1 pr-3 mr-2">
                <b-collapse id="collapse2">
                  <b-alert show variant="info" class="small mb-1">
                    ２：カレンダーを見たいのであればカレンダー表示をONにしてください。<br />
                    便利なのですが１の絞り込みが足りなかったりすると表示時に重くなります。一旦表示してしまえばあとはそれ程重くはありません。<br />
                    カレンダーを表示した状態で１を再度触ると動的に再表示しようとするので重くなります。色々と条件を変えて試したい場合はいったんカレンダー表示をOFFにすることをオススメします。
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-checkbox v-model="inputCalendarVisible" class="d-inline-block mr-2">
                  カレンダー表示
                </b-checkbox>
                <div class="d-inline-block">
                  <b-select
                    v-model.number="inputCalendarCols"
                    :options="[
                      { value: 1, text: '1列' },
                      { value: 2, text: '2列' },
                      { value: 3, text: '3列' },
                      { value: 4, text: '4列' },
                      { value: 5, text: '5列' },
                      { value: 6, text: '6列' },
                    ]"
                    class="mx-1"
                    style="width:4.5rem"
                    required
                  />
                  <b-select
                    v-model.number="inputCalendarRows"
                    :options="[
                      { value: 1, text: '1行' },
                      { value: 2, text: '2行' },
                      { value: 3, text: '3行' },
                      { value: 4, text: '4行' },
                      { value: 5, text: '5行' },
                      { value: 6, text: '6行' },
                    ]"
                    class="mx-1"
                    style="width:4.5rem"
                    required
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <v-calendar
                  :rows="inputCalendarRows"
                  :columns="inputCalendarCols"
                  :min-date="minDate"
                  :to-page="todayObj"
                  :transition="'slide-h'"
                  :attributes="inputCalendarVisible ? filteredAttributes : []"
                  :style="getCalendarStyle"
                >
                  <template v-slot:day-popover="{ attributes }">
                    <popoverRow v-for="attr of attributes" :key="attr.id" :attribute="attr">
                      <div class="d-flex flex-column">
                        <div>[{{ attr.customData.labelDate }}] {{ attr.popover.label }}</div>
                        <template v-for="[ikey, ivalue] of getPopoverColumns">
                          <template v-for="j of ivalue">
                            <div
                              v-if="attr.customData[ikey].has(j)"
                              :key="'pop-' + attr.customData.id + ikey + j"
                            >
                              <span class="pl-3">{{ ikey }}（{{ j }}）</span>
                              <ul v-if="ikey == '衣装'" class="mb-0">
                                <li
                                  v-for="[kKey, kValue] of attr.customData[ikey].get(j)"
                                  :key="'pop-' + attr.customData.id + ikey + j + kKey"
                                >
                                  {{ kKey }}
                                  <ul>
                                    <li
                                      v-for="l of kValue"
                                      :key="'pop-' + attr.customData.id + ikey + j + kKey + l"
                                    >
                                      {{ l }}
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                              <ul v-else class="mb-0">
                                <li
                                  v-for="k of attr.customData[ikey].get(j)"
                                  :key="'pop-' + attr.customData.id + ikey + j + k"
                                >
                                  {{ k }}
                                </li>
                              </ul>
                            </div>
                          </template>
                        </template>
                      </div>
                    </popoverRow>
                  </template>
                </v-calendar>
              </b-col>
            </b-row>
          </b-container>
        </div>
        <div class="table-attached-header">
          <div>
            <b-icon class="table-attached-header-icon" icon="eye" variant="dark" font-scale="1.5" />
          </div>
          <div class="table-attached-header-contents w-100">
            <b-container fluid>
              <b-row>
                <b-col cols="12" class="px-1">
                  <b-collapse id="collapse3">
                    <b-alert show variant="info" class="small mb-1">
                      ３：必要であればここで<span class="font-weight-bold">下表内の</span
                      >表示カラムを切り替えてください。<br />
                      ここを変更して切り替わるのは<span class="font-weight-bold">下の表</span
                      >です。１の絞り込み条件や２のカレンダーには影響しません。
                    </b-alert>
                  </b-collapse>
                </b-col>
              </b-row>
            </b-container>
            <!-- 名前以外のカラムを列挙。hiddenの値にあわせてボタンを切替。 -->
            <template v-for="column of tableColumns">
              <template v-if="!['開始', '終了', 'イベント名'].some(i => i == column.label)">
                <b-button
                  v-show="!column.hidden"
                  variant="secondary"
                  :key="column.label"
                  @click="$set(column, 'hidden', !column.hidden)"
                  class="table-attached-header-view-button"
                >
                  {{ column.label }}
                </b-button>
                <b-button
                  v-show="column.hidden"
                  variant="outline-secondary"
                  :key="column.label + '-outline'"
                  @click="$set(column, 'hidden', !column.hidden)"
                  class="table-attached-header-view-button"
                >
                  {{ column.label }}
                </b-button>
              </template>
            </template>
          </div>
        </div>
      </div>
      <vue-good-table
        compactMode
        :rows="filteredAttributes"
        :columns="tableColumns"
        :row-style-class="getRowStyleClass"
        :sort-options="tableSortOptions"
        styleClass="vgt-table bordered condensed"
        :pagination-options="{
          enabled: true,
          perPage: 10,
          position: 'both',
          nextLabel: '次',
          prevLabel: '前',
          rowsPerPageLabel: 'ページあたりの表示件数',
          ofLabel: '/',
          allLabel: '全て',
        }"
      >
        <template v-slot:table-column="props">
          {{ props.column.label }}
          <!-- resizable table用のハンドル。それとここの親であるthにposition:relativeを入れる必要があるが、.vgt-table thにて既にそう定義されているようなので特に何もしない。 -->
          <div class="resizableTableHandle" @mousedown="resizableTableEventHandler($event)">
            &nbsp;
          </div>
        </template>
        <template v-slot:table-row="props">
          <template v-if="props.column.label == 'イベント名'">
            {{ props.formattedRow[props.column.field] }}
            <a :href="props.row.customData.url" target="_blank" rel="noopener">
              <i class="fas fa-external-link-alt" />
            </a>
          </template>
          <!-- note:カラムがオブジェクトかつサイズが0の場合、template下で出力すると[object Map]と表示される。divにすると消えるがcompactModeにて表示が大きく崩れてしまう(td中のspanが空となり、項目名(data-label)とズレる)。
          なのでちゃんとサイズをチェックし、サイズがない場合は'-'を出力する。この空の場合に'-'を出すというのはvue-good-tableがStringの際におこなっていることと同様である（'備考'参照)。  -->
          <template
            v-else-if="
              [
                'フレンズ',
                'フォト',
                '家具',
                'インテリア',
                'ピクニックアイテム',
                'その他アイテム',
              ].some(i => i == props.column.label)
            "
          >
            <template v-if="props.row.customData[props.column.label].size">
              <p
                v-for="[key, value] of props.row.customData[props.column.label]"
                :key="key"
                class="m-1"
              >
                <span :class="getBadgeLikeClass(key)">{{ key }}</span>
                {{ value.join(',') }}
              </p>
            </template>
            <template v-else>-</template>
          </template>
          <template v-else-if="props.column.label == '衣装'">
            <template v-if="props.row.customData[props.column.label].size">
              <div
                v-for="[ikey, ivalue] of props.row.customData[props.column.label]"
                :key="ikey"
                class="m-1"
              >
                <span :class="getBadgeLikeClass(ikey)">{{ ikey }}</span>
                <div v-for="[jkey, jvalue] of ivalue" :key="jkey">
                  <p class="m-0 ml-2 font-weight-bold">{{ jkey }}</p>
                  <p class="m-0 ml-4">{{ jvalue.join(',') }}</p>
                </div>
              </div>
            </template>
            <template v-else>-</template>
          </template>
          <div v-else-if="props.column.label == 'タグ'" class="vs__selected-options">
            <span
              v-for="value of props.row.customData.tags"
              class="tag-bg-color vs__selected small"
              :key="value"
            >
              {{ value }}
            </span>
          </div>
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
          </template>
        </template>
        <div slot="emptystate">
          <b-alert show variant="warning"> 該当する項目がありません。 </b-alert>
        </div>
      </vue-good-table>
    </b-container>
  </b-container>
</template>

<script>
import popoverRow from 'v-calendar/lib/components/popover-row.umd.min';
import dayjs from 'dayjs';
import eventsJson from '../json/events.json';
import resizableTable from '@/mixins/resizableTable.js';

//v-calendarが利用可能な色リスト。mountedの他conputed等で利用しそうなのでここにいれておく。
const color = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'gray',
];

export default {
  mixins: [resizableTable],
  name: 'SearchEvents2',
  components: {
    popoverRow,
  },
  data() {
    return {
      //v-calendarのto-page用に今日（今月）を示すためのオブジェクト。to-dateが使えればよいのだが何故か上手くいかないのでこの形式のオブジェクトを受取るto-pageを使用する。
      //note:どうもバグっぽい？ https://github.com/nathanreyes/v-calendar/issues/203#issuecomment-634024061
      todayObj: {
        month: dayjs().get('month') + 1,
        year: dayjs().get('year'),
      },
      minDate: new Date('2019/9/24'), //けもフレ３リリース日。min-date。
      masterAttributes: [], //全てのイベントを記録したマスターデータ。jsonのデータをv-calendar用に構造変換したもの。これをcomputedでフィルターする。

      //フィルターの表示制御に必要な要素をまとめたフィルターオブジェクト配列。表示有無、選択値、選択項目等を保持する。
      SearchFilter: {
        target: {
          visible: true, //ここがfalseになることはないが一応用意
          value: '',
          list: ['個別検索', 'イベント検索'],
          placeholder: '検索対象',
        },
        category: {
          visible: false,
          value: '',
          list: [],
          placeholder: 'カテゴリー',
        },
        name: { visible: false, value: '', placeholder: '' },
        tags: {
          visible: true,
          valueOK: [],
          valueNG: ['恒常', '有料パック'], //NGタグ初期値
          placeholder: 'タグ',
        },
      },

      //SearchFilterのcategoryにセットする値の元となるlist。mountedにて初期化。中身は('個別検索',[])という形式のMap。
      //あくまでベースなので、実際に取得する場合は別途methodを利用する。
      masterCategoryList: new Map(),

      //SearchFilterのnameにセットする値の元となるlist。mountedにて初期化。
      //全フレンズ、フォト名等のリスト（重複排除済）。SearchFilterの選択に応じてnameに入れる。
      //中身は('フレンズ',[])という形式のMap。
      //あくまでベースなので、実際に取得する場合は別途methodを利用する。
      masterNameList: new Map(),

      //"フレンズ(招待または配布)"といった結合特殊タグを保存するMap。
      //keyは'フレンズ','フォト'等文字列
      //Valueはオブジェクトで、targetTagsにはフレンズ(招待) といった形式のタグ文字列で、
      //combineStringには"フレンズ(招待または配布)"のような結合文字列が入る。
      //特殊タグが存在しないアイテムの場合はKey自体存在しないので、使う際にはまずhasで存在確認すること。
      //mounted内にて実際にjsonの内容を確認して作り出す。これはmounted内にてtagとして追加する他、
      //SearchFilterのtagにセットするリストを作るときにも参照する。
      specialTagMap: new Map(),

      //json元となるスプレッドシート上の分類とカラム名を定義(再現)するためのデータ色々。mountedにて初期化。
      //主にmounted内でjsonを読み込む際に使用されるが、tagリスト生成等でもこの構造があると便利なのでここに持っておく。
      //Mapなので順序が保証される。なのでforEach等でループすれば元のカラム順通りになる。
      //keyは'フレンズ','フォト'等文字列
      //valueは基本['招待', '特効', '配布', '引換']
      originalColumn: new Map(),

      //calendarの初期表示数
      inputCalendarVisible: false,
      inputCalendarRows: 1,
      inputCalendarCols: 1,

      //出力テーブルカラム
      tableColumns: [
        {
          field: 'customData.start',
          label: '開始',
          type: 'date',
          dateInputFormat: 'yyyy/MM/dd',
          dateOutputFormat: 'yyyy/MM/dd',
          firstSortType: 'desc',
          hidden: false,
        },
        {
          field: 'customData.end',
          label: '終了',
          type: 'date',
          dateInputFormat: 'yyyy/MM/dd',
          dateOutputFormat: 'yyyy/MM/dd',
          firstSortType: 'desc',
          hidden: false,
        },
        {
          field: 'popover.label',
          label: 'イベント名',
          hidden: false,
        },
        {
          field: 'customData.フレンズ',
          label: 'フレンズ',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.フォト',
          label: 'フォト',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.衣装',
          label: '衣装',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.家具',
          label: '家具',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.インテリア',
          label: 'インテリア',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.ピクニックアイテム',
          label: 'ピクニックアイテム',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.その他アイテム',
          label: 'その他アイテム',
          hidden: false,
          sortable: false,
        },
        {
          field: 'customData.tags',
          label: 'タグ',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.備考',
          label: '備考',
          hidden: false,
          sortable: false,
        },
      ],
      tableSortOptions: {
        enabled: true,
        initialSortBy: [{ field: 'customData.end', type: 'desc' }],
      },
    };
  },
  created() {
    //eventsJsonからevent情報全部入りのmasterAttributesを作る。
    //その過程で出現したカテゴリ、タグ、個別アイテム名（フレンズ、フォト、衣装、家具、インテリア等）のリストも生成する。

    //SearchFilterの項目listとして使うための情報を集めるset定義。setなので重複を弾ける。後ほどこれらはarrayにして返す。
    //カテゴリー
    //カテゴリーについてはJsonを見るまでもなく想定される値がほぼ判っているのでここで初期値として定義しておく。
    //並び順も考慮しているのでカテゴリーについては後でsortもしない。jsonを走査して知らないカテゴリー名が出てきた時は末尾に追加する。
    //setCategoryImtesは動的に追加されるものはない。最後に一緒にMapにいれるだけだが一応変数として持っておく。
    const setCategoryEvents = new Set(['イベント', 'しょうたい', 'けも級開放', 'メンテナンス']);
    const setCategoryItems = new Set([
      'フレンズ',
      'フォト',
      '衣装',
      '家具',
      'インテリア',
      'ピクニックアイテム',
      'その他アイテム',
    ]);

    //originalColumns初期化。スプレッドシート上のカラム情報を再現できるデータを入れる。
    //setCategoryItemsのアイテム名を利用する。
    setCategoryItems.forEach(i => this.originalColumn.set(i, ['招待', '特効', '配布', '引換']));
    this.originalColumn.set('フレンズ', ['招待', '特効', '配布', '引換', '対象']); //フレンズだけは'対象'があるのでvalueごと上書きする。

    //個別検索で初期値として使用するユニークなフレンズ、フォト等名を収集するSet()を保持するMap()
    const uniqueSetMap = new Map();
    setCategoryItems.forEach(i => uniqueSetMap.set(i, new Set()));
    //'衣装'は２つにわけて管理するので、'衣装'を落として'衣装(衣装名から)','衣装フレンズ'の２つを追加する
    uniqueSetMap.delete('衣装');
    uniqueSetMap.set('衣装(衣装名から)', new Set());
    uniqueSetMap.set('衣装(フレンズ名から)', new Set());

    //各アイテムに'招待', '特効', '配布', '引換', '対象'といった分類が１つでも存在するかを記録するSetを保持するMap()
    const tmpOriginalColumnExist = new Map();
    setCategoryItems.forEach(i => tmpOriginalColumnExist.set(i, new Set()));

    //eventsJson解析ループ関連変数
    let id = 1; //id。v-for等ループ用に振る。
    let colorIndex = 0; //色リストの何番目を使用するかのインデックス

    //eventsJson解析
    for (const row of eventsJson) {
      //恒常を除外する場合ここで以下のようにすれば排除できる。排除するか別配列にいれるかは迷うところ。
      //if (row.タグ.split(',').some(i => i == '恒常')) continue;

      //jsonの開始日時、終了日時をオブジェクト化
      const startDate = dayjs(row.開始, 'YYMMDDHHmm');
      const endDate = dayjs(row.終了, 'YYMMDDHHmm');
      //jsonの行からv-calendarに渡すオブジェクトを生成。まずは単純代入できるものをそのまま渡す。
      const tmpEvent = {
        id: id++,
        highlight: color[colorIndex++], //色は１つずつずらす
        popover: {
          label: row.イベント名,
        },
        dates: [{ start: startDate.toDate(), end: endDate.toDate() }],
        customData: {
          labelDate: startDate.format('MM/DD') + '～' + endDate.format('MM/DD'),
          url: row.url,
          //vue-good-tableは日付を扱えるがDateではなく文字列として扱うのでここに置いておく。
          start: startDate.format('YYYY/MM/DD'),
          end: endDate.format('YYYY/MM/DD'),
          category: row.カテゴリー,
          tags: row.タグ == '' ? [] : row.タグ.split(','),
          備考: '',
          フレンズ: new Map(),
          フォト: new Map(),
          衣装: new Map(),
          家具: new Map(),
          インテリア: new Map(),
          ピクニックアイテム: new Map(),
          その他アイテム: new Map(),
        },
      };

      //カテゴリーをsetに追加
      setCategoryEvents.add(row.カテゴリー);

      //json中の出力カラムを走査し、スプレッドシート上のカラムを復元（分割）する。
      //出力カラムは;区切りなのでまずはそれでsplitする。
      const tmpOutput = row.出力.split(';');
      let tmpOutputIndex = 0; //tmpOutputのindex。tmpOutputをどこまで読んだか示すもの。
      let tmpId = 1; //現在処理対象となる出力カラムid。1から始まってスプレッドシート上終端カラム数までカウントアップする。

      //id:1 備考
      if (tmpOutput[tmpOutputIndex].startsWith(tmpId + ':')) {
        tmpEvent.customData.備考 = tmpOutput[tmpOutputIndex].substring((tmpId + ':').length); //切り出し(先頭は元カラムを示すidなのでそこを削る。)
        tmpOutputIndex++; //処理したらindexを次にずらす
      }
      tmpId++; //処理したらidを次にずらす

      //上で作ったMap中の配列でループ処理
      for (const [iKey, iArray] of this.originalColumn) {
        const tmpColumnExistSet = tmpOriginalColumnExist.get(iKey); //現在のアイテムに対する存在確認Setを取り出す
        if (iKey == '衣装') {
          //衣装の場合はMapへの格納方法が異なるので処理を分ける
          for (const j of iArray) {
            //id検査
            if (tmpOutput[tmpOutputIndex].startsWith(tmpId + ':')) {
              const tmpClothMap = new Map(); //衣装を格納用Map()
              //配列切り出し(先頭は元カラムを示すidなのでそこを削り、残りをカンマでsplitする。)
              for (const l of tmpOutput[tmpOutputIndex]
                .substring((tmpId + ':').length)
                .split(',')) {
                //:で分割。前は衣装名、後ろは/区切りのフレンズ名配列
                const tmpName = l.split(':')[0];
                const tmpList = l.split(':')[1].split('/');
                tmpClothMap.set(tmpName, tmpList);
                const tmpSet1 = uniqueSetMap.get('衣装(衣装名から)'); //衣装名ユニークセットを取得
                tmpSet1.add(tmpName); //衣装名をユニークセットに追加
                const tmpSet2 = uniqueSetMap.get('衣装(フレンズ名から)'); //衣装フレンズ名ユニークセットを取得
                tmpList.forEach(k => tmpSet2.add(k)); //衣装対象フレンズをユニークセットに追加
              }
              tmpEvent.customData[iKey].set(j, tmpClothMap); //配列をMapに格納
              tmpEvent.customData.tags.push(iKey + '(' + j + ')'); //この分類名が存在することをtagに追加
              tmpColumnExistSet.add(j); //この分類名が存在することを記録
              tmpOutputIndex++; //処理したらindexを次にずらす
            }
            tmpId++; //処理したらidを次にずらす
          }
        } else {
          //衣装以外
          for (const j of iArray) {
            //id検査
            if (tmpOutput[tmpOutputIndex].startsWith(tmpId + ':')) {
              const tmpArray = tmpOutput[tmpOutputIndex].substring((tmpId + ':').length).split(','); //配列切り出し(先頭は元カラムを示すidなのでそこを削り、残りをカンマでsplitする。)
              tmpEvent.customData[iKey].set(j, tmpArray); //配列をMapに格納
              const tmpSet = uniqueSetMap.get(iKey); //ユニークセットを取得
              tmpArray.forEach(k => tmpSet.add(k)); //今回出現した配列要素をユニークセットへ追加
              tmpEvent.customData.tags.push(iKey + '(' + j + ')'); //この分類名が存在することをtagに追加
              tmpColumnExistSet.add(j); //この分類名が存在することを記録
              tmpOutputIndex++; //処理したらindexを次にずらす
            }
            tmpId++; //処理したらidを次にずらす
          }
        }
      }

      //色配列を指すインデックスが最後まで行ってたら最初に戻す。
      if (color.length <= colorIndex) colorIndex = 0;

      //masterAttributesに追加
      this.masterAttributes.push(tmpEvent);
    }

    // 収集したユニーク分類名の存在を確認し、結合分類タグを作り出す。 ex:['招待', '特効', '配布', '引換', '対象']
    for (const [iKey, iSet] of tmpOriginalColumnExist) {
      const tmpTags = []; //フレンズ(招待) といった形式のタグ文字列(上にて既に追加したのと同じフォーマット)を格納する配列。後ほどArray.someでチェックするために用意する。
      const tmpPickup = []; //招待,配布,引換といった文字列が一度でも使われていれば一旦この配列に追加する。最後に１つの文字列に変換結合する。
      for (const i of ['招待', '配布', '引換']) {
        if (iSet.has(i)) {
          tmpTags.push(iKey + '(' + i + ')');
          tmpPickup.push(i);
        }
      }
      if (1 < tmpPickup.length) {
        //specialTagMapにセットする
        this.specialTagMap.set(iKey, {
          targetTags: tmpTags,
          combineString: iKey + '(' + tmpPickup.join('または') + ')', //区切り文字指定で結合。"フレンズ(招待または配布)"などとなる。
        });
      }
    }
    // masterAttributesを走査。対応するタグがあった場合、タグに結合タグを追加する。
    for (const i of this.masterAttributes) {
      for (const [, jvalue] of this.specialTagMap) {
        if (i.customData.tags.some(k => jvalue.targetTags.some(l => l == k))) {
          i.customData.tags.push(jvalue.combineString);
        }
      }
    }

    //収集したユニークセットを配列にしてmasterCategoryListに入れる
    //並び順を考慮しているのでsortはしない。初期値以外のものは出現順になる。
    this.masterCategoryList.set('イベント検索', Array.from(setCategoryEvents));
    //個別検索で使うアイテム名一覧では'衣装'を２つに分割する。spliceで'衣装'を消しつつ２つ追加している。
    let tmpClothArray = Array.from(setCategoryItems);
    tmpClothArray.splice(
      tmpClothArray.indexOf('衣装'),
      1,
      '衣装(衣装名から)',
      '衣装(フレンズ名から)'
    );
    this.masterCategoryList.set('個別検索', tmpClothArray);
    //その他uniqueSetMapに登録したもの。sortして渡す。
    uniqueSetMap.forEach((v, k) => this.masterNameList.set(k, Array.from(v).sort()));
  },
  mounted() {
    //カレンダーの初期表示列数を設定する。
    //尚、参考までに以下に初期に検討していたレスポンシブな表示列の例を示す。見た目は良かったがパフォーマンスにHITするので断念した。
    //$screens({ default: 1, c2: 2, c3: 3, c4: 4, c5: 5, c6: 6 })
    this.inputCalendarCols = this.$screens({ default: 1, c2: 2, c3: 3, c4: 4, c5: 5, c6: 6 });
  },
  computed: {
    filteredAttributes() {
      //masterAttributesを入力条件でフィルターしたfilteredAttributesを作成する。
      let tmpAttr = this.masterAttributes;

      //最初にタグを処理する。デフォルトでNG条件があり、初期表示でもデータ量削減が見込める為。
      //NGタグ。選択項目に一致するものが１つでもあったら除外。
      if (0 < this.SearchFilter.tags.valueNG.length) {
        tmpAttr = tmpAttr.filter(
          i => !this.SearchFilter.tags.valueNG.some(j => i.customData.tags.some(k => k == j))
        );
      }
      //OKタグ。選択項目に対するand条件。
      if (0 < this.SearchFilter.tags.valueOK.length) {
        tmpAttr = tmpAttr.filter(i =>
          this.SearchFilter.tags.valueOK.every(j => i.customData.tags.some(k => k == j))
        );
      }

      //targetが選択されている場合は更に絞り込み処理をする
      if (this.SearchFilter.target.value) {
        if (this.SearchFilter.target.value == '個別検索') {
          //個別検索の場合

          //カテゴリーに応じて処理分岐
          if (this.SearchFilter.category.value) {
            if (this.SearchFilter.category.value == '衣装(衣装名から)') {
              //カテゴリーは衣装(衣装名から)
              if (this.SearchFilter.name.value) {
                //衣装名指定がある場合
                //note:Array.some()を使いたいのでMapはArray.fromで適宜配列に直している
                tmpAttr = tmpAttr.filter(i =>
                  Array.from(i.customData.衣装.values()).some(j =>
                    Array.from(j.keys()).some(k => k == this.SearchFilter.name.value)
                  )
                );
              } else {
                //衣装名指定がない場合(衣装名がないものは除外)
                tmpAttr = tmpAttr.filter(i => 0 < i.customData.衣装.size);
              }
            } else if (this.SearchFilter.category.value == '衣装(フレンズ名から)') {
              //カテゴリーは衣装(フレンズ名から)
              if (this.SearchFilter.name.value) {
                //衣装(フレンズ名)がある場合
                //note:Array.some()を使いたいのでMapはArray.fromで適宜配列に直している
                tmpAttr = tmpAttr.filter(i =>
                  Array.from(i.customData.衣装.values()).some(j =>
                    Array.from(j.values()).some(k => k.some(l => l == this.SearchFilter.name.value))
                  )
                );
              } else {
                //衣装名指定がない場合(衣装名がないものは除外)
                tmpAttr = tmpAttr.filter(i => 0 < i.customData.衣装.size);
              }
            } else {
              //カテゴリーは衣裳以外。衣裳以外は処理は同一。
              if (this.SearchFilter.name.value) {
                //名前指定がある場合
                tmpAttr = tmpAttr.filter(i =>
                  Array.from(i.customData[this.SearchFilter.category.value].values())
                    .flat(Infinity)
                    .some(j => j == this.SearchFilter.name.value)
                );
              } else {
                //名前指定がない場合(対象がないものは除外)
                tmpAttr = tmpAttr.filter(
                  i => 0 < i.customData[this.SearchFilter.category.value].size
                );
              }
            }
          }
        } else if (this.SearchFilter.target.value == 'イベント検索') {
          //イベント検索の場合
          //カテゴリー
          if (this.SearchFilter.category.value) {
            tmpAttr = tmpAttr.filter(
              i => i.customData.category == this.SearchFilter.category.value
            );
          }
        }
      }
      //絞り込み結果を返す
      return tmpAttr;
    },
    getCategoryList() {
      //SearchFilterのcategoryにセットするlistを返す。検索対象(target)の選択内容に応じたものを返す。
      if (
        this.SearchFilter.target.value == '個別検索' ||
        this.SearchFilter.target.value == 'イベント検索'
      ) {
        return this.masterCategoryList.get(this.SearchFilter.target.value);
      } else {
        //ここに入ることはないはずだが一応念の為
        return [];
      }
    },
    getNameList() {
      //SearchFilterのnameにセットするlistを返す。
      //tags選択の有無によって処理を切り替える。(単純にfilteredAttributesからlistを作り出すとnameを再選択しようとしても既に絞り込み済のため同じ条件のものしか出てこず、意味をなさない為)
      if (0 < this.SearchFilter.tags.valueNG.length || 0 < this.SearchFilter.tags.valueOK.length) {
        //tag指定がある場合、filteredAttributesは既にtagsで絞り込まれている。なのでfilteredAttributesを走査してnameを収集する。
        const tmpSet = new Set();
        const tmpCategory = this.SearchFilter.category.value;
        if (tmpCategory == 'フレンズ' || tmpCategory == 'フォト') {
          this.filteredAttributes.forEach(i =>
            i.customData[tmpCategory].forEach(j => j.forEach(k => tmpSet.add(k)))
          );
        } else if (tmpCategory == '衣装(衣装名から)') {
          // note:Map.keys()はIteratorなのでArray.from()にいれて配列化している
          this.filteredAttributes.forEach(i =>
            i.customData.衣装.forEach(j => Array.from(j.keys()).forEach(k => tmpSet.add(k)))
          );
        } else if (tmpCategory == '衣装(フレンズ名から)') {
          this.filteredAttributes.forEach(i =>
            i.customData.衣装.forEach(j => j.forEach(k => k.forEach(l => tmpSet.add(l))))
          );
        } else if (
          tmpCategory == '家具' ||
          tmpCategory == 'インテリア' ||
          tmpCategory == 'ピクニックアイテム' ||
          tmpCategory == 'その他アイテム'
        ) {
          this.filteredAttributes.forEach(i =>
            i.customData[tmpCategory].forEach(j => tmpSet.add(j))
          );
        }
        //配列にしてsortした上で返す
        return Array.from(tmpSet).sort();
      } else {
        //tag指定が無い場合はmasterNameListから初期リストを取り出す。
        return this.masterNameList.get(this.SearchFilter.category.value);
      }
    },
    getTagList() {
      //特殊タグ用一時配列を定義。必要タグ配列、不要タグ配列の２つを定義する。
      const tmpSPOKTags = [];
      const tmpSPNGTags = [];

      //カテゴリー値を変数に出す。'衣装'はカテゴリー上では２つに分割しておりこのままだと一括処理が面倒な為ここで元に戻す。
      let tmpCategoryValue = this.SearchFilter.category.value;
      if (tmpCategoryValue == '衣装(衣装名から)') tmpCategoryValue = '衣装';
      if (tmpCategoryValue == '衣装(フレンズ名から)') tmpCategoryValue = '衣装';

      //特殊タグ用一時配列を初期化する。カテゴリーの選択項目が個別アイテムかどうかで処理をわける。
      if (this.originalColumn.has(tmpCategoryValue)) {
        //個別検索。カテゴリーにて指定された特定アイテムに関する特殊タグのみを取り出す。
        for (const [iKey, iArray] of this.originalColumn) {
          if (iKey == tmpCategoryValue) {
            //対象カテゴリー
            //結合文字列 ex: フレンズ(招待または配布)
            //選択カテゴリーがspecialTagMapに登録されているならその情報を必要タグ配列に追加
            if (this.specialTagMap.has(tmpCategoryValue)) {
              tmpSPOKTags.push(this.specialTagMap.get(tmpCategoryValue).combineString);
            }
            //その他文字列 ex:フレンズ(招待)
            iArray.forEach(j => tmpSPOKTags.push(iKey + '(' + j + ')'));
          } else {
            //非対象カテゴリー。結合文字列、その他文字列共に全て不要タグ配列へ追加。(結合文字列の存在チェックはする。)
            if (this.specialTagMap.has(iKey))
              tmpSPNGTags.push(this.specialTagMap.get(iKey).combineString);
            iArray.forEach(j => tmpSPNGTags.push(iKey + '(' + j + ')'));
          }
        }
      } else {
        //イベント検索、もしくはカテゴリー未選択。この場合全ての特殊タグをセットする。
        for (const [iKey, iArray] of this.originalColumn) {
          //結合文字列が存在するなら入れる ex: フレンズ(招待または配布)
          if (this.specialTagMap.has(iKey)) {
            tmpSPOKTags.push(this.specialTagMap.get(iKey).combineString);
          }
          //その他文字列 ex:フレンズ(招待)
          iArray.forEach(j => tmpSPOKTags.push(iKey + '(' + j + ')'));
        }
      }

      //filteredAttributesを全走査して出現タグSetを生成する。
      const tmpSet = new Set();
      this.filteredAttributes.forEach(i => i.customData.tags.forEach(j => tmpSet.add(j)));

      //特殊タグを探し出す。もし特殊タグを発見した場合はtmpSPOKTagsの該当indexを仮配列に記録する。
      const tmpIndexArray = []; //特殊タグの有無を記録する仮配列。
      tmpSet.forEach(i => {
        tmpSPOKTags.forEach((j, jIndex) => {
          if (i == j) {
            tmpIndexArray.push(jIndex); //見つけたindexを記録
            tmpSet.delete(i); //見つけた特殊タグは削除する
          }
        });
        if (tmpSPNGTags.some(j => i == j)) tmpSet.delete(i); //NGリストに入っているものは削除
      });
      tmpIndexArray.sort((a, b) => a - b); //収集したindexを数値ソート
      const tmpArray = Array.from(tmpSet).sort(); //その他タグを配列に変換し、ソート

      //出力配列を用意
      const outputArray = [];
      //出力配列への追加順は検索対象の指定によって変える。
      if (this.originalColumn.has(tmpCategoryValue)) {
        //個別検索。特殊タグが先。
        //特殊タグを入れる
        tmpIndexArray.forEach(i => outputArray.push(tmpSPOKTags[i]));
        //特殊タグ、その他タグ共にサイズがあるなら区切り文字列を入れる
        if (outputArray.length && tmpArray.length) outputArray.push('━━━━━━━━━━');
        //その他タグを入れる
        tmpArray.forEach(i => outputArray.push(i));
      } else {
        //イベント検索、もしくはカテゴリー未選択。その他タグが先。
        //その他タグを入れる
        tmpArray.forEach(i => outputArray.push(i));
        //特殊タグ、その他タグ共にサイズがあるなら区切り文字列を入れる
        if (outputArray.length && tmpArray.length) outputArray.push('━━━━━━━━━━');
        //最初に特殊タグを入れる
        tmpIndexArray.forEach(i => outputArray.push(tmpSPOKTags[i]));
      }

      return outputArray;
    },
    //SearchFilterの選択状態からカレンダーのpopoverに表示させるべき項目名を返す。
    //戻り値はMap()で、フレンズ:[招待,配布],フォト:[招待,配布]などとなる。
    //尚、この関数はpopoverイベントが発生したときに1回だけ呼ばれる。事前にカレンダーすべての日のpopoverを用意しておくわけではない。
    getPopoverColumns() {
      const outMap = new Map();
      //タグ指定がなかった場合にデフォルトで表示させる項目。'対象'はフレンズ以外に存在しないが、表示時にMap.has()にて検査するので含まれていても問題ない。
      const defaultColumns = ['招待', '配布', '引換', '対象'];

      //SearchFilterの内容を調べて表示項目名を作る。
      if (!this.SearchFilter.category.value) {
        //カテゴリーが選択されていない場合(状況によりnullだったり空文字だったりするが、上の判定で問題なくここに入る)
        //デフォルト表示（主要なフレンズ、フォトの招待、配布等を表示）
        outMap.set('フレンズ', defaultColumns);
        outMap.set('フォト', defaultColumns);
      } else if (
        [
          'フレンズ',
          'フォト',
          '衣装(衣装名から)',
          '衣装(フレンズ名から)',
          '家具',
          'インテリア',
          'ピクニックアイテム',
          'その他アイテム',
        ].some(i => i == this.SearchFilter.category.value)
      ) {
        //個別選択カテゴリー

        //カテゴリー名を取り出しておく（衣装のときは２パターンありえるのでまとめておく）
        let tmpCategory = this.SearchFilter.category.value;
        if (tmpCategory == '衣装(衣装名から)' || tmpCategory == '衣装(フレンズ名から)') {
          tmpCategory = '衣装';
        }

        //tagが選択されいているか調べる。
        //this.SearchFilter.tags.valueOKは配列が期待される変数だが、空文字にはなってもnullになることはない模様。なので単にサイズで比較する。
        if (0 < this.SearchFilter.tags.valueOK.length) {
          //tag指定有り
          //指定されたtagに対象タグが存在するか調べるための正規表現パターンを作る。()内をキャプチャしたいので()を重ねている。
          const tmpRegex = new RegExp('^' + tmpCategory + '\\((.*)\\)$');

          //ユニーク文字列を集めるSetを作る。'フレンズ(招待または配布)','フレンズ(配布)'とあっても配布が重複しないようにする為。
          const tmpUniqueStr = new Set();

          //tagsを走査
          for (const i of this.SearchFilter.tags.valueOK) {
            //パターンにマッチするか調べる。戻り値は配列であり別途使いたいので、比較が１回で済むようif中ではなくここで調べる。
            //マッチしない場合はnull,マッチする場合は配列で、0にマッチ全体、1以降にキャプチャが入る。
            const tmpResult = i.match(tmpRegex);
            if (tmpResult) {
              //パターンにマッチ
              //キャプチャされた[1]を'または'で分割し、その結果をtmpUniqueStrに入れる。
              tmpResult[1].split('または').forEach(j => tmpUniqueStr.add(j));
            }
          }

          //カテゴリー名と、tmpUniqueStrに集めた結果を配列にして返す。
          outMap.set(tmpCategory, Array.from(tmpUniqueStr.values()));
        } else {
          //tag指定無し
          //カテゴリー名と、そのデフォルト表示とする
          outMap.set(tmpCategory, defaultColumns);
        }
      }

      return outMap;
    },
    getCalendarStyle() {
      //カレンダーの表示スタイルを返す。カレンダー非表示の時には薄くする。
      return this.inputCalendarVisible ? 'opacity: 1;margin:auto;' : 'opacity: 0.2;margin:auto;';
    },
  },
  methods: {
    selectedTarget() {
      //filterのtargetが選択された場合の処理
      //note:既に選択されているtargetを削除した場合もこのfunctionは呼ばれる。その場合SearchFilter.target.valueはnullである。

      //下位の入力をクリア
      this.SearchFilter.category.value = '';
      this.SearchFilter.name.value = '';
      //下位の表示を切り替え
      this.SearchFilter.category.visible = this.SearchFilter.target.value ? true : false;
      this.SearchFilter.name.visible = false;

      //table表示切替。全て表示。ただしタグのみ非表示。
      for (const i of this.tableColumns) {
        if (i.label != 'タグ') {
          i.hidden = false;
        } else {
          i.hidden = true;
        }
      }
    },
    selectedCategory() {
      //filterのcategoryが選択された場合の処理
      //下位の入力をクリア
      this.SearchFilter.name.value = '';
      //下位の表示を切り替え
      this.SearchFilter.name.visible = this.masterCategoryList
        .get('個別検索')
        .some(i => i == this.SearchFilter.category.value)
        ? true
        : false;

      //nameのplaceholderをカテゴリ－に応じて変更する。初期値はカテゴリー+'名'で、変えたい場合は個別に上書きする。
      this.SearchFilter.name.placeholder = this.SearchFilter.category.value + '名';
      if (this.SearchFilter.category.value == '衣装(衣装名から)')
        this.SearchFilter.name.placeholder = '衣装名';
      if (this.SearchFilter.category.value == '衣装(フレンズ名から)')
        this.SearchFilter.name.placeholder = 'フレンズ名';

      //table表示切替。指定カテゴリーのみ表示。
      let tmpStr = this.SearchFilter.category.value;
      if (tmpStr == '衣装(衣装名から)' || tmpStr == '衣装(フレンズ名から)') tmpStr = '衣装';
      for (const i of this.tableColumns) {
        if (['開始', '終了', 'イベント名', '備考', tmpStr].some(j => j == i.label)) {
          i.hidden = false;
        } else {
          i.hidden = true;
        }
      }
    },
    //行class取得。classの定義はcustom-vue-good-table.scssに。
    getRowStyleClass(row) {
      return 'row-vcal-' + row.highlight;
    },
    //b-badgeのようなタグクラスを取得。定義はkemonofriends3tools.scssに。
    getBadgeLikeClass(str) {
      if (str == '招待') return 'custom-badge badge-invite-color';
      if (str == '特効') return 'custom-badge badge-special-color';
      if (str == '配布') return 'custom-badge badge-distribute-color';
      if (str == '引換') return 'custom-badge badge-exchange-color';
      if (str == '対象') return 'custom-badge badge-target-color';
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
//テーブル内タグ表示用。
//タグはvs__selectedを使用するが、これの背景色は透過色なのでそのまま使用するとrowの色と交じる。
//そのため背景がwhiteの実色（select欄から採取）を以下に設定する。
span.tag-bg-color {
  background-color: #e1f8e1 !important;
}
</style>
