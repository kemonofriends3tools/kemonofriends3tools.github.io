<template>
  <b-container fluid class="mt-2">
    <h1>イベント・しょうたい検索</h1>
    <b-container fluid>
      <b-alert show variant="info" class="small mb-1">
        使い方に少々クセがあります。詳しくは下の「使い方」を押してください。
      </b-alert>
      <div class="text-right">
        <b-button v-b-toggle.collapse0.collapse1.collapse2.collapse3.collapse4 variant="info">
          <b-icon
            class="align-text-bottom mx-1"
            icon="question-circle-fill"
            variant="light"
          />使い方
        </b-button>
      </div>

      <!-- table-attached-headerのfirst/last-childを見ているのでこのdivは必要 -->
      <div>
        <div class="table-attached-header">
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
                  この欄にある指名検索とタグ検索はAND条件で連動しており、選択できる項目が動的に絞り込まれます。<br />
                  なにかおかしいなと思ったら他の検索条件を見直してみてください（詳しくは「使い方」を参照）。
                </b-alert>
              </b-col>
              <b-col cols="12" class="px-1">
                <b-collapse id="collapse0">
                  <b-alert show variant="info" class="small mb-1">
                    <p>
                      上にある通り、各入力欄で選択出来る項目は、他の検索条件の影響を受けます。<br />
                      例えば除外タグに『有料パック』があると、指名検索でピクニックを選んでも項目はほとんど出てきません（ピクニックアイテムはほぼ全てが有料パックの為）。<br />
                      逆に指名検索で『フレンズ＞ドール』と選ぶと、タグではドールが関係したイベントに関連したものしか出てきません。<br />
                      なにかおかしいな？足りないな？と思ったらこの欄の条件全体を見直してみてください。一般的にはタグの指定に問題があることが多いので、なにか変だなとおもったらタグの指定を外してみて下さい。
                    </p>
                    <p class="mb-0">
                      この欄にあるセレクトボックスは全て文字入力で項目を絞り込むことが出来ます。<br />
                      特に指名検索にてフレンズ名等を指定する場合、一部だけでも入力すれば探し出すのが非常に楽になります。
                    </p>
                  </b-alert>
                </b-collapse>
              </b-col>
              <b-col cols="12" class="px-1">
                <b-collapse id="collapse1">
                  <b-alert show variant="info" class="small mb-1">
                    １：検索したいもの（フレンズ名や家具名等）が判っている場合はここで指定して下さい。<br />
                    衣装は衣装名からとフレンズからの２通りで検索出来ます。<br />
                    上の方でも書きましたがセレクトボックスは文字入力で項目を絞り込むことが出来ます。フレンズ名やフォト名などを指定する場合は一部（頭文字でなくても構いません）だけでも入力すると選ぶのが楽になります。
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row class="w-100 mr-0 my-1">
              <b-col
                cols="12"
                sm="auto"
                class="pr-0 align-self-center"
                style="width:calc(9rem - 1px);"
                >指名検索：</b-col
              >
              <b-col cols="12" sm="auto" class="pl-2 pr-1 flex-grow-1">
                <b-row class="w-100 p-0 m-0">
                  <b-col cols="12" md="4" class="pl-2 pr-0 pb-1 flex-grow-1 align-self-center">
                    <v-select
                      v-model="SearchFilter.category.value"
                      :options="SearchFilter.category.list"
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
                  <b-col cols="12" md="8" class="pl-2 pr-0 pb-1 flex-grow-1 align-self-center">
                    <v-select
                      v-model="SearchFilter.name.value"
                      :options="getNameList"
                      :placeholder="SearchFilter.name.placeholder"
                      @search:focus="SearchFilter.name.value = ''"
                      class="background-white"
                      style="width: 100%"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <em>{{ search }}</em>
                          に一致する項目は存在しません。
                        </template>
                        <template v-else>
                          <template v-if="SearchFilter.category.value">
                            選択可能な{{ SearchFilter.name.placeholder }}はありません。
                          </template>
                          <template v-else>
                            先にカテゴリーを選んで下さい。
                          </template>
                        </template>
                      </template>
                    </v-select>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12" class="px-1">
                <b-collapse id="collapse2">
                  <b-alert show variant="info" class="small mb-1">
                    ２：含めたい／除外したいタグを指定します。<br />
                    除外の方にデフォルトで『恒常』や『有料パック』が含まれている点に注意して下さい。これらは一般的に邪魔になることが多いと思われるため指定していますが、恒常フレンズや家具等を探している場合は外す必要があるかもしれません。
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
                  :selectable="option => !option.startsWith('◆')"
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
              <b-col cols="12" sm="auto" class="pr-0 align-self-center" style="width:9rem;"
                >次のタグを除く：</b-col
              >
              <b-col cols="12" sm="auto" class="pr-1 flex-grow-1">
                <v-select
                  multiple
                  v-model="SearchFilter.tags.valueNG"
                  :options="getTagList"
                  :placeholder="SearchFilter.tags.placeholder"
                  class="background-white"
                  :selectable="option => !option.startsWith('◆')"
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
                      ３：一番下の表の表示列、及びカレンダーのポップアップ内の表示項目を切り替えます。<br />
                      表示列・項目を切り替えるだけなので、ここを触ってもデータ行数が変化することはありません。
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
      <div class="table-attached-header" style="background: #fdfcf9 !important">
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
              <b-collapse id="collapse4">
                <b-alert show variant="info" class="small mb-1">
                  ４：カレンダーを見たいのであればカレンダー表示をONにしてください。<br />
                  便利なのですが上で絞り込みが足りなかったりすると（データ量が多いと）表示時に重くなります。一旦表示してしまえばあとはそれ程重くはありません。<br />
                  カレンダーを表示した状態で上の検索条件を触ると動的に再表示しようとするので重くなります。色々と条件を変えて試したい場合はいったんカレンダー表示をOFFにすることをオススメします。
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
                  style="width:5rem"
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
                  style="width:5rem"
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
            <text-highlight :queries="SearchFilter.name.value" :caseSensitive="false">
              {{ props.formattedRow[props.column.field] }}
            </text-highlight>
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
              <div
                v-for="[key, value] of props.row.customData[props.column.label]"
                :key="key"
                class="m-1"
              >
                <span :class="getBadgeLikeClass(key)">{{ key }}</span>
                <ul class="list-unstyled pl-2">
                  <li v-for="i of value" :key="i">
                    <text-highlight :queries="SearchFilter.name.value" :caseSensitive="false">
                      {{ i }}
                    </text-highlight>
                  </li>
                </ul>
              </div>
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
                  <p class="m-0 pl-2 font-weight-bold">
                    <text-highlight :queries="SearchFilter.name.value" :caseSensitive="false">
                      {{ jkey }}
                    </text-highlight>
                  </p>
                  <ul class="list-unstyled pl-4">
                    <li v-for="i of jvalue" :key="i">
                      <text-highlight :queries="SearchFilter.name.value" :caseSensitive="false">
                        {{ i }}
                      </text-highlight>
                    </li>
                  </ul>
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
            <text-highlight :queries="SearchFilter.name.value" :caseSensitive="false">
              {{ props.formattedRow[props.column.field] }}
            </text-highlight>
          </template>
        </template>
        <div slot="emptystate">
          <b-alert show variant="warning">該当する項目がありません。</b-alert>
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

//v-calendarが利用可能な色リスト。createdの他computed等で利用しそうなのでここにいれておく。
const calendarColor = [
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

//カテゴリーリストのアイテム（大本）。
//スプレッドシートのアイテム定義と同一であり、衣装を分割していないオリジナル。
//表の表示切り替え可能項目のうち、アイテムに関するボタン名でもある。
//様々な処理でよく利用するので、ここに定数として定義しておく。
const originalCategoryItems = [
  'フレンズ',
  'フォト',
  '衣装',
  '家具',
  'インテリア',
  'ピクニックアイテム',
  'その他アイテム',
];

//スプレッドシート上の列定義
//主にcreated内でjsonを読み込む際に元の列を再現するために使用されるが、tagリスト生成等でもこの構造があると便利なのでここに定義する。
//Mapなので順序が保証される。なのでforEach等でループすれば元のカラム順通りになる。
//元はcreated内でループで初期化していたが処理等を考慮し定数化した。
const originalColumn = new Map([
  ['フレンズ', ['招待', '特効', '配布', '引換', '対象']], //フレンズだけは'対象'がある
  ['フォト', ['招待', '特効', '配布', '引換']],
  ['衣装', ['招待', '特効', '配布', '引換']],
  ['家具', ['招待', '特効', '配布', '引換']],
  ['インテリア', ['招待', '特効', '配布', '引換']],
  ['ピクニックアイテム', ['招待', '特効', '配布', '引換']],
  ['その他アイテム', ['招待', '特効', '配布', '引換']],
]);

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
        category: {
          value: '',
          list: [
            'フレンズ',
            'フォト',
            '衣装(衣装名から)',
            '衣装(フレンズ名から)',
            '家具',
            'インテリア',
            'ピクニックアイテム',
            'その他アイテム',
          ],
          placeholder: 'カテゴリー',
        },
        name: { value: '', placeholder: '先にカテゴリーを選んで下さい' },
        tags: {
          valueOK: [],
          valueNG: ['恒常', '有料パック'], //NGタグ初期値
          placeholder: 'タグ',
        },
      },

      //SearchFilterのnameにセットする値の元となるlist。createdにて初期化。
      //全フレンズ、フォト名等のリスト（重複排除済）。SearchFilterの選択に応じてnameに入れる。
      //中身は('フレンズ',[])という形式のMap。
      //あくまでベースなので、実際に取得する場合は別途methodを利用する。
      masterNameList: new Map(),

      //"フレンズ(招待または配布)","フレンズ(招待)"といった特殊タグを保存するMap。
      //keyは'フレンズ','フォト'等のアイテム名文字列
      //Valueは特殊タグ文字列の配列で、結合特殊タグふくめ最終的な表示順で入っている。
      //特殊タグが存在しないカテゴリーの場合はKey自体存在しない（指名で使う際にはhasで存在確認すること）。
      //初期化はcreated内にてjsonの内容を確認し、特殊タグを作って保存している。つまり収録されている特殊タグは全て実存するタグである。
      //主にgetTagList()にて使い回すことを目的としている。
      masterSPTagMap: new Map(),

      //"フレンズ(招待または配布)"といった結合特殊タグを保存するMap。
      //keyは'フレンズ','フォト'等文字列
      //Valueはオブジェクトで、targetTagsにはフレンズ(招待) といった形式のタグ文字列で、
      //combineStringには"フレンズ(招待または配布)"のような結合文字列が入る。
      //特殊タグが存在しないアイテムの場合はKey自体存在しないので、使う際にはまずhasで存在確認すること。
      //created内にて実際にjsonの内容を確認して作り出す。これはcreated内にてtagとして追加する他、
      //SearchFilterのtagにセットするリストを作るときにも参照する。
      specialTagMap: new Map(),

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
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.フォト',
          label: 'フォト',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.衣装',
          label: '衣装',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.家具',
          label: '家具',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.インテリア',
          label: 'インテリア',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.ピクニックアイテム',
          label: 'ピクニックアイテム',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.その他アイテム',
          label: 'その他アイテム',
          hidden: true,
          sortable: false,
        },
        {
          field: 'customData.tags',
          label: 'タグ',
          hidden: false,
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
        initialSortBy: [{ field: 'customData.start', type: 'desc' }],
      },
    };
  },
  created() {
    //eventsJsonからevent情報全部入りのmasterAttributesを作る。
    //その過程で出現したカテゴリ、タグ、アイテム名（フレンズ、フォト、衣装、家具、インテリア等）のリストも生成する。

    //指名検索で初期値として使用するユニークなフレンズ、フォト等名を収集するSet()を保持するMap()
    const uniqueSetMap = new Map();
    originalCategoryItems.forEach(i => uniqueSetMap.set(i, new Set()));
    //'衣装'は２つにわけて管理するので、'衣装'を落として'衣装(衣装名から)','衣装フレンズ'の２つを追加する
    uniqueSetMap.delete('衣装');
    uniqueSetMap.set('衣装(衣装名から)', new Set());
    uniqueSetMap.set('衣装(フレンズ名から)', new Set());

    //各アイテムに'招待', '特効', '配布', '引換', '対象'といった分類が１つでも存在するかを記録するSetを保持するMap()
    const tmpOriginalColumnExist = new Map();
    originalCategoryItems.forEach(i => tmpOriginalColumnExist.set(i, new Set()));

    //eventsJson解析ループ関連変数
    let id = 1; //id。v-for等ループ用に振る。

    //eventsJson解析
    for (const row of eventsJson) {
      //jsonの開始日時、終了日時をオブジェクト化
      const startDate = dayjs(row.開始, 'YYMMDDHHmm');
      const endDate = dayjs(row.終了, 'YYMMDDHHmm');

      //jsonの行からv-calendarに渡すオブジェクトを生成。まずは単純代入できるものをそのまま渡す。
      const tmpEvent = {
        id: id++,
        highlight: '', //色は後ほどfilteredAttributes()にて正しいものを入れる
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

      //カテゴリーをタグとして追加（イベントとその他は意味がなさそうなので除外）
      if (
        row.カテゴリー != 'イベント' &&
        row.カテゴリー != 'その他' &&
        row.カテゴリー != 'けも級開放'
      ) {
        tmpEvent.customData.tags.unshift(row.カテゴリー);
      }

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
      for (const [iKey, iArray] of originalColumn) {
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

      //masterAttributesに追加
      this.masterAttributes.push(tmpEvent);
    }

    // 収集したユニーク分類名の存在を確認し、結合特殊タグ（フレンズ(招待または配布)など）を作り出す。
    for (const [iKey, iSet] of tmpOriginalColumnExist) {
      const tmpTags = []; //フレンズ(招待) といった形式のタグ文字列(上にて既に追加したのと同じフォーマット)を格納する配列。後ほどArray.someでチェックするために用意する。
      const tmpPickup = []; //招待,配布,引換といった文字列が一度でも使われていれば一旦この配列に追加する。最後に１つの文字列に変換結合する。
      for (const i of ['招待', '配布', '引換']) {
        if (iSet.has(i)) {
          tmpTags.push(iKey + '(' + i + ')');
          tmpPickup.push(i);
        }
      }
      //結合特殊タグは要素が複数の場合のみ作る。（１つしかない場合は'または'でつなぐ結合特殊タグは必要ない。）
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

      //指名検索
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
            tmpAttr = tmpAttr.filter(i => 0 < i.customData[this.SearchFilter.category.value].size);
          }
        }
      }

      //色(highlight)を付けて回る。
      let colorIndex = 0; //色リストの何番目を使用するかのインデックス
      tmpAttr.forEach(i => {
        if (calendarColor.length <= colorIndex) colorIndex = 0; //色配列を指すインデックスが最後まで行ってたら最初に戻す。
        i.highlight = calendarColor[colorIndex++]; //色は１つずつずらす。
      });

      //絞り込み結果を返す
      return tmpAttr;
    },
    getNameList() {
      //SearchFilterのnameにセットするlistを返す。
      //tags選択の有無によって処理を切り替える。(単純にfilteredAttributesからlistを作り出すとnameを再選択しようとしても既に絞り込み済のため同じ条件のものしか出てこず、意味をなさない為)
      if (0 < this.SearchFilter.tags.valueNG.length || 0 < this.SearchFilter.tags.valueOK.length) {
        //tag指定がある場合、filteredAttributesは既にtagsで絞り込まれている。なのでfilteredAttributesを走査してnameを収集する。
        const tmpSet = new Set();
        const tmpCategory = this.SearchFilter.category.value;
        if (tmpCategory) {
          if (tmpCategory == '衣装(衣装名から)') {
            // note:Map.keys()はIteratorなのでArray.from()にいれて配列化している
            this.filteredAttributes.forEach(i =>
              i.customData.衣装.forEach(j => Array.from(j.keys()).forEach(k => tmpSet.add(k)))
            );
          } else if (tmpCategory == '衣装(フレンズ名から)') {
            this.filteredAttributes.forEach(i =>
              i.customData.衣装.forEach(j => j.forEach(k => k.forEach(l => tmpSet.add(l))))
            );
          } else {
            //フレンズ、フォト、家具、インテリア、ピクニックアイテム、その他アイテム
            this.filteredAttributes.forEach(i =>
              i.customData[tmpCategory].forEach(j => j.forEach(k => tmpSet.add(k)))
            );
          }
        }
        //配列にしてsortした上で返す
        return Array.from(tmpSet).sort();
      } else {
        //tag指定が無い場合はmasterNameListから初期リストを取り出す。
        return this.masterNameList.get(this.SearchFilter.category.value);
      }
    },
    getTagList() {
      //一般タグリストの雛形。最終的に並び順はこのとおりとなる。データに存在しないタグはここから自動で抜かれる。
      const commonTagsMap = new Map([
        ['汎用タグ', new Set(['恒常', '有料パック', 'シナリオ', '配布'])],
        [
          'しょうたい',
          new Set(['しょうたい', '週末ピックアップ', 'ドレスアップ', '無料ガチャ', 'フォトガチャ']),
        ],
        ['メンテナンス', new Set(['メンテナンス', 'データ更新', 'バージョンアップ'])],
        ['主要シナリオ', new Set(['メインストーリー', 'アライさん隊長日誌', 'セーバルぶらり旅'])],
        ['イベント(恒常)', new Set(['ちからくらべ', 'とくべつくんれん', 'シーサーバル道場'])],
        [
          'イベント(一般)',
          new Set([
            '〇〇のしずく',
            'マップキー',
            '体力測定',
            '共闘',
            '大掃除',
            '野生大開放',
            '期間限定○月しょうたい',
          ]),
        ],
        [
          'イベント(特殊)',
          new Set(['ログインボーナス', 'すぺしゃるクエスト:期間限定クエスト', 'コラボイベント']),
        ],
        ['フレンズ(開放)', new Set(['けも級開放', 'キセキとくせい開放', 'フォトポケランク開放'])],
        [
          '支援',
          new Set([
            'ゴールドあつめ',
            'スタミナ減少(主要ストーリー)',
            '成功確率増加(フレンズ成長)',
            '獲得増加(くんれんメダル)',
            '獲得増加(けもけも弁当)',
            '獲得増加(なかよしポイント)',
            '獲得増加(ドロップアイテム)',
          ]),
        ],
        [
          '引換',
          new Set([
            '引換(おしゃれメダル)',
            '引換(ちゅーばーのあかし)',
            '引換(インテリアメダル)',
            '引換(ラッキーメダル)',
            '引換(リウキウおしゃれメダル)',
            '引換(水着メダル)',
          ]),
        ],
      ]);

      //filteredAttributesを全走査して出現タグSetを生成する。
      const tmpSet = new Set();
      this.filteredAttributes.forEach(i => i.customData.tags.forEach(j => tmpSet.add(j)));

      //先に特殊タグ（アイテムの存在によって自動生成される『フレンズ(招待)』等のこと。このメソッド内では以下『特殊タグ』と呼称する）のリストを作る。
      //生の出現タグSetには一般タグに加えこれら特殊タグが含まれているので、これらを存在確認しながら抜いてゆく（のこりが一般タグとなる）。
      //リストに出すOKタグ配列、リストには含めないNGタグ配列の２つを定義する。
      //これらはカテゴリー選択されている場合に関係ないタグを非表示にするためであって、ページ上検索欄の含むタグ/除くタグとは関係ない。それらの検索欄にはどちらも同じgetTagList()の戻り値が入る。
      const tmpSPOKTags = [];
      const tmpSPNGTags = [];

      //カテゴリー値を変数に出す。'衣装'はカテゴリー上では２つに分割しておりこのままだと一括処理が面倒な為ここで元に戻す。
      let tmpCategoryValue = this.SearchFilter.category.value;
      if (tmpCategoryValue == '衣装(衣装名から)') tmpCategoryValue = '衣装';
      if (tmpCategoryValue == '衣装(フレンズ名から)') tmpCategoryValue = '衣装';

      //特殊タグ用一時配列を初期化する。指名検索のカテゴリーが選択されているかどうかで処理をわける。
      if (tmpCategoryValue) {
        //カテゴリー選択済。カテゴリーにて指定された特定アイテムに関する特殊タグのみを取り出す。
        for (const [iKey, iArray] of originalColumn) {
          if (iKey == tmpCategoryValue) {
            //対象カテゴリー
            //結合文字列 ex: フレンズ(招待または配布)
            //選択カテゴリーがspecialTagMapに登録されているならその情報をOKタグ配列に追加
            if (this.specialTagMap.has(tmpCategoryValue)) {
              tmpSPOKTags.push(this.specialTagMap.get(tmpCategoryValue).combineString);
            }
            //その他文字列 ex:フレンズ(招待)
            iArray.forEach(j => tmpSPOKTags.push(iKey + '(' + j + ')'));
          } else {
            //非対象カテゴリー。結合文字列、その他文字列共に全てNGタグ配列へ追加。(結合文字列の存在チェックはする。)
            if (this.specialTagMap.has(iKey))
              tmpSPNGTags.push(this.specialTagMap.get(iKey).combineString);
            iArray.forEach(j => tmpSPNGTags.push(iKey + '(' + j + ')'));
          }
        }
      } else {
        //カテゴリー未選択。この場合全ての特殊タグをOKタグ配列へセットする。
        for (const [iKey, iArray] of originalColumn) {
          //結合文字列が存在するなら入れる ex: フレンズ(招待または配布)
          if (this.specialTagMap.has(iKey)) {
            tmpSPOKTags.push(this.specialTagMap.get(iKey).combineString);
          }
          //その他文字列 ex:フレンズ(招待)
          iArray.forEach(j => tmpSPOKTags.push(iKey + '(' + j + ')'));
        }
      }

      //出現タグSetから特殊タグを探し出す。もし特殊タグを発見した場合はOKタグ配列中のindexを仮配列に記録し、出現タグSetから抜く。
      const tmpIndexArray = []; //特殊タグを見つけたときにOKタグ配列のindexを記録する仮配列。あとでsortしたいので、比較の容易なindex値として収集する。
      tmpSet.forEach(i => {
        const tmpIndex = tmpSPOKTags.indexOf(i); //tmpSPOKTagsから要素を探してindexを取得（存在しない場合は-1）
        if (0 <= tmpIndex) tmpIndexArray.push(tmpIndex); //特殊タグがあるならindexを記録
      });
      tmpIndexArray.sort((a, b) => a - b); //収集したOKタグ配列indexを数値ソート
      tmpIndexArray.forEach(i => tmpSet.delete(tmpSPOKTags[i])); //出現タグSetから見つけた特殊タグを削除する
      tmpSPNGTags.forEach(i => tmpSet.delete(i)); //NGリストに入っているものは出現タグSetから削除する

      //以上の情報を利用し、最終的な特殊タグリストを作る
      const tmpSPTagsArray = [];
      tmpSPTagsArray.push('◆アイテム区分 ━━━━━━━━');
      tmpIndexArray.forEach(i => tmpSPTagsArray.push(tmpSPOKTags[i]));

      //次に、一般タグリストを作る。
      //初期値の入った一般タグリストを走査
      commonTagsMap.forEach(v => {
        const tmpDeleteList = []; //削除リスト。以下でforEachでループするがiteratorループ中にループ要素を操作（削除）すると具合が悪いので、この削除リストを用いてループ後に消す。
        v.forEach(v2 => {
          if (tmpSet.has(v2)) {
            //雛形の要素が出現タグSetに存在する＞出現タグSetから削除
            tmpSet.delete(v2);
          } else {
            //雛形の要素が出現タグSetに存在しない＞削除リストに追加
            tmpDeleteList.push(v2);
          }
        });
        tmpDeleteList.forEach(i => v.delete(i)); //削除リストを使って初期値として設定されている値を削除
      });
      //この時点で一般タグリストには実在確認のとれた要素のみが残っており、tmpSetは基本空となっているはずである（ただしtmpSetには雛形になかったものが入っている可能性があるので、ちゃんと別途処理する）。
      //一般タグリストを配列化
      const tmpCommonTagsArray = [];
      commonTagsMap.forEach((v, k) => {
        if (v.size) {
          //要素が存在するならKey名を表題にしてデータを追加。
          tmpCommonTagsArray.push('◆' + k + ' ━━━━━━━━');
          v.forEach(v2 => tmpCommonTagsArray.push(v2));
        }
      });
      if (tmpSet.size) {
        //こちらは雛形に無いデータが存在した場合。表題は『その他』としてデータに追加。
        const tmpSetArray = Array.from(tmpSet).sort(); //その他タグを配列に変換し、ソートしておく
        tmpCommonTagsArray.push('◆その他 ━━━━━━━━');
        tmpSetArray.forEach(v2 => tmpCommonTagsArray.push(v2));
      }

      //戻り値を返すが、カテゴリー選択の有無によって特殊タグと一般タグの並び順を変える。
      if (tmpCategoryValue) {
        //カテゴリー選択時。特殊タグが先。
        return tmpSPTagsArray.concat(tmpCommonTagsArray);
      } else {
        //カテゴリー未選択時。一般タグが先。
        return tmpCommonTagsArray.concat(tmpSPTagsArray);
      }
    },
    //SearchFilterの選択状態からカレンダーのpopoverに表示させるべき項目名を返す。
    //戻り値はMap()で、フレンズ:[招待,配布],フォト:[招待,配布]などとなる。
    //尚、この関数はpopoverイベントが発生したときに1回だけ呼ばれる。事前にカレンダーすべての日のpopoverを用意しておくわけではない。
    getPopoverColumns() {
      const outMap = new Map();

      //表示させる区分配列。存在しない区分（例えば'対象'はフレンズ以外に存在しない）があっても、表示時にはMap.has()にて検査しているので問題ない。
      const defaultColumns = ['招待', '特効', '配布', '引換', '対象'];

      //各カラムの表示設定(hidden)を調べて表示すべきMap(カテゴリー：区分配列)を作る。
      this.tableColumns.forEach(i => {
        if (
          //表示制御対象項目（これ以外はpopoverで表示させる対象ではない）
          originalCategoryItems.some(j => j == i.label)
        ) {
          if (!i.hidden) outMap.set(i.label, defaultColumns);
        }
      });

      return outMap;
    },
    getCalendarStyle() {
      //カレンダーの表示スタイルを返す。カレンダー非表示の時には薄くする。
      return this.inputCalendarVisible ? 'opacity: 1;margin:auto;' : 'opacity: 0.2;margin:auto;';
    },
  },
  methods: {
    selectedCategory() {
      //filterのcategoryが選択された場合の処理
      //下位の入力をクリア
      this.SearchFilter.name.value = '';

      //nameのplaceholderをカテゴリ－に応じて変更する。
      if (this.SearchFilter.category.value) {
        //初期値はカテゴリー+'名'で、変えたい場合は個別に上書きする。
        this.SearchFilter.name.placeholder = this.SearchFilter.category.value + '名';
        if (this.SearchFilter.category.value == '衣装(衣装名から)')
          this.SearchFilter.name.placeholder = '衣装名';
        if (this.SearchFilter.category.value == '衣装(フレンズ名から)')
          this.SearchFilter.name.placeholder = 'フレンズ名';
      } else {
        //選択されていない場合
        this.SearchFilter.name.placeholder = '先にカテゴリーを選んで下さい';
      }

      //table表示切替。選択されたカテゴリーの列表示をONに、それ以外はoffにする。（非選択の場合全てoffになる。）
      let tmpStr = this.SearchFilter.category.value;
      if (tmpStr == '衣装(衣装名から)' || tmpStr == '衣装(フレンズ名から)') tmpStr = '衣装';
      this.tableColumns.forEach(i => {
        //tmpStrがラベルに一致してるなら表示に。それ以外なら非表示に。
        if (originalCategoryItems.includes(i.label)) i.hidden = i.label == tmpStr ? false : true;
      });
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
