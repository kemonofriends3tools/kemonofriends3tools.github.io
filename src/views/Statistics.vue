<template>
  <b-container fluid="xl">
    <h1>統計</h1>
    <b-alert show variant="warning" class="small">
      当サイトに登録されたデータを元にしています。努力はしておりますがデータ不足により一部内容が正しくない場合があります。ご了承下さい。
    </b-alert>
    <b-card class="mb-4" title="フレンズ">
      <b-card-group columns>
        <b-card title="総フレンズ数">
          <b-card-text>
            <p class="text-right mb-0">
              {{ stat.get('総フレンズ数') }}
              <b-link href="/friends" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt" />
              </b-link>
              <br />
              <span class="small">
                はなまるチェンジ込み。ユニークフレンズ数は「はなまるチェンジ以外」を参照
              </span>
            </p>
          </b-card-text>
        </b-card>
        <b-card title="はなまるチェンジ">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('はなまるチェンジ')" />
          </b-card-text>
        </b-card>
        <b-card title="フレンズ名長さ">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フレンズ名長さ')" />
          </b-card-text>
        </b-card>
        <b-card title="属性">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フレンズ属性')" />
          </b-card-text>
        </b-card>
        <b-card title="サブ属性">
          <b-card-text>
            <b-row>
              <b-col>合計</b-col>
              <b-col class="text-right">
                {{ stat.get('フレンズサブ属性合計') }}
                <span class="small">
                  ({{
                    Math.round(
                      (stat.get('フレンズサブ属性合計') / stat.get('総フレンズ数')) * 10000
                    ) / 100
                  }}%)
                </span>
              </b-col>
            </b-row>
            <StatisticsSimpleTable :tableData="stat.get('フレンズサブ属性')" />
          </b-card-text>
        </b-card>
        <b-card title="初期けも級">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('初期けも級')" />
          </b-card-text>
        </b-card>
        <b-card title="パーティドレス">
          <b-card-text>
            <p class="text-right">
              {{ stat.get('パーティドレス') }}
              <span class="small">
                ({{
                  Math.round((stat.get('パーティドレス') / stat.get('総フレンズ数')) * 10000) / 100
                }}%)
              </span>
              <b-link href="/friends?v=4&t4=12" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt" />
              </b-link>
              <br />
              <span class="small">
                フォトポケ12以上<br />
                告知なく追加される為、おそらく漏れ有
              </span>
            </p>
          </b-card-text>
        </b-card>
        <b-card title="野生大開放">
          <b-card-text>
            <p class="text-right">
              {{ stat.get('野生解放5') }}
              <span class="small">
                ({{
                  Math.round((stat.get('野生解放5') / stat.get('総フレンズ数')) * 10000) / 100
                }}%)
              </span>
              <b-link href="/friends?v=5&t5=5" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt" />
              </b-link>
              <br />
              <span class="small">
                野生解放5段階以上
              </span>
            </p>
          </b-card-text>
        </b-card>
        <b-card
          v-for="i of ['けもステ', '体力', '攻撃', '守り', '回避', 'プラズム']"
          :key="i"
          :title="i"
        >
          <b-card-text>
            <span v-if="i != '回避' && i != 'プラズム'" class="small">
              LV70時の値にて比較
            </span>
            <StatisticsSimpleTable :tableData="stat.get('フレンズ' + i)" />
          </b-card-text>
        </b-card>
        <b-card v-for="i of ['Beat', 'Action', 'Try']" :key="i" :title="i + '3枚以上'">
          <b-card-text>
            <b-row>
              <b-col>合計</b-col>
              <b-col class="text-right">
                {{ stat.get('フラッグ3' + i).length }}
                <span class="small">
                  ({{
                    Math.round(
                      (stat.get('フラッグ3' + i).length / stat.get('総フレンズ数')) * 10000
                    ) / 100
                  }}%)
                </span>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ul class="small m-0 pl-1 pr-0">
                  <li v-for="i of stat.get('フラッグ3' + i)" :key="i">{{ i }}</li>
                </ul>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-card title="MP">
          <b-card-text>
            <span class="small">ミラクルに必要なMP</span>
            <StatisticsSimpleTable :tableData="stat.get('フレンズMP')" list />
          </b-card-text>
        </b-card>
        <b-card v-for="i of ['待機スキル発動率', '待機スキル発動回数']" :key="i" :title="i">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get(i)" />
          </b-card-text>
        </b-card>
        <b-card title="キセキとくせい未実装">
          <b-card-text>
            <b-row>
              <b-col>合計</b-col>
              <b-col class="text-right">
                {{ stat.get('キセキとくせい未実装').length }}
                <span class="small">
                  ({{
                    Math.round(
                      (stat.get('キセキとくせい未実装').length / stat.get('総フレンズ数')) * 10000
                    ) / 100
                  }}%)
                </span>
                <b-link href="/friends?v=44&t44=未実装" target="_blank" rel="noopener">
                  <i class="fas fa-external-link-alt" />
                </b-link>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ul class="small m-0 pl-1 pr-0">
                  <li v-for="i of stat.get('キセキとくせい未実装')" :key="i">{{ i }}</li>
                </ul>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-card title="なないろとくせい実装済">
          <b-card-text>
            <b-row>
              <b-col>合計</b-col>
              <b-col class="text-right">
                {{ stat.get('なないろとくせい実装済').length }}
                <span class="small">
                  ({{
                    Math.round(
                      (stat.get('なないろとくせい実装済').length / stat.get('総フレンズ数')) * 10000
                    ) / 100
                  }}%)
                </span>
                <b-link href="/friends?v=46,47&t46=実装済" target="_blank" rel="noopener">
                  <i class="fas fa-external-link-alt" />
                </b-link>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-card title="CV掛け持ち数">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('CV掛け持ち数')" />
          </b-card-text>
        </b-card>
        <b-card title="CV後日実装">
          <b-card-text>
            <StatisticsSimpleTable
              v-if="stat.get('CV後日実装') && 0 < stat.get('CV後日実装')['left'].length"
              :tableData="stat.get('CV後日実装')"
            />
            <span v-else>なし</span>
          </b-card-text>
        </b-card>
        <b-card title="直近実装フレンズ">
          <b-card-text>
            <b-row>
              <b-col>
                {{ stat.get('直近実装フレンズ日付') }}
                <span class="small">({{ stat.get('直近実装フレンズ日付差分') }})</span><br />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ul class="small m-0 pl-1 pr-0">
                  <li v-for="i of stat.get('直近実装フレンズ名前')" :key="i">{{ i }}</li>
                </ul>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-card title="入手区分">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フレンズ入手区分')" />
          </b-card-text>
        </b-card>
      </b-card-group>
    </b-card>
    <b-card class="mb-4" title="フォト">
      <b-alert show variant="warning" class="small">
        フォトはワイルドフォトを中心にデータが不足しがちです。傾向を見る程度にお考えください。
      </b-alert>
      <b-card-group columns>
        <b-card title="総フォト数">
          <b-card-text class="text-right mb-0">
            {{ stat.get('総フォト数') }}
            <b-link href="/photo?j=material,normal,wild" target="_blank" rel="noopener">
              <i class="fas fa-external-link-alt" />
            </b-link>
            <br />
            <span class="small">
              ワイルドフォト・強化素材フォト込み
            </span>
          </b-card-text>
        </b-card>
        <b-card title="フォト種別">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フォト種別')" />
          </b-card-text>
        </b-card>
        <b-card title="フォト名長さ">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フォト名長さ')" />
          </b-card-text>
        </b-card>
        <b-card title="属性">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('フォト属性')" />
            <span v-if="stat.get('未入力フォト有')" class="small">
              「無」にデータ不足フォトが含まれている可能性大<br />
              (正しくは強化素材の{{ stat.get('強化素材フォト件数') }}件のみになるはず)
            </span>
          </b-card-text>
        </b-card>
        <b-card title="★">
          <b-card-text>
            <span v-if="stat.get('★無フォト有')" class="small">
              「無」はデータ不足フォトの可能性大(主にワイルドフォト)
            </span>
            <StatisticsSimpleTable :tableData="stat.get('フォト★')" />
          </b-card-text>
        </b-card>
        <b-card v-for="i of ['体力', '攻撃', '守り']" :key="i" :title="i">
          <b-card-text>
            <span class="small"
              >限界突破無、LV最大にて比較<br />(データ不足が多い為、参考程度に留めてください)</span
            >
            <StatisticsSimpleTable :tableData="stat.get('フォト' + i)" />
          </b-card-text>
        </b-card>
        <b-card title="直近実装フォト">
          <b-card-text>
            <b-row>
              <b-col>
                {{ stat.get('直近実装フォト日付') }}
                <span class="small">({{ stat.get('直近実装フォト日付差分') }})</span><br />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ul class="small m-0 pl-1 pr-0">
                  <li v-for="i of stat.get('直近実装フォト名前')" :key="i">{{ i }}</li>
                </ul>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
        <b-card title="特殊入手フォト">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('特殊入手フォト')" />
          </b-card-text>
        </b-card>
        <b-card title="最多イラストレーター">
          <b-card-text>
            <StatisticsSimpleTable :tableData="stat.get('最多イラストレーター')" />
          </b-card-text>
        </b-card>
      </b-card-group>
    </b-card>
    <b-card class="mb-2 p-0" title="その他">
      <b-card-group columns>
        <b-card title="サービス日数">
          <b-card-text class="mb-0 small">
            <StatisticsSimpleTable :tableData="stat.get('サービス日数')" />
            <p class="mt-1 mb-0">
              丸一日メンテでログインできなかった日などが存在する為、リリース日から毎日ログインしていたとしてもゲーム内ログイン日数は上記日数とは一致しません
            </p>
          </b-card-text>
        </b-card>
        <b-card title="アニバーサリー">
          <b-card-text class="mb-0 small">
            <StatisticsSimpleTable :tableData="stat.get('アニバーサリー')" />
          </b-card-text>
        </b-card>
        <b-card v-for="i of ['コラボイベント一覧', 'タイアップ一覧']" :key="i" :title="i">
          <b-card-text>
            <b-row>
              <b-col>合計</b-col>
              <b-col class="text-right">
                {{ stat.get(i)[0].length }}
                <b-link :href="stat.get(i)[1]" target="_blank" rel="noopener">
                  <i class="fas fa-external-link-alt" />
                </b-link>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <ul class="small m-0 pl-1 pr-0">
                  <li v-for="j of stat.get(i)[0]" :key="j">{{ j }}</li>
                </ul>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
      </b-card-group>
      <b-card class="mb-2" title="イベント予想">
        <b-alert show variant="warning" class="d-block d-sm-none small">
          スマホの場合表が大きいので横画面での閲覧を推奨します。
        </b-alert>
        <b-alert show variant="warning" class="small">
          <ul class="mb-0">
            <li>
              過去の開催頻度から単純に推測したものです。大雑把かつ細かい条件を考慮していないのであまり真に受けないでください。
            </li>
            <li>
              絶対差は「『次回予想と本日日付との差』の絶対値」です。早い話、0に近ければ近いほど来る可能性が高いと思われます。
            </li>
          </ul>
        </b-alert>
        <vue-good-table
          compactMode
          :rows="eventTableRows"
          :columns="eventaTableColumns"
          :sort-options="{
            enabled: true,
            initialSortBy: { field: '絶対差', type: 'asc' },
          }"
          styleClass="vgt-table striped bordered condensed  vgt-table-noBorder"
        >
          <template v-slot:table-column="props">
            {{ props.column.label }}
            <!-- resizable table用のハンドル。それとここの親であるthにposition:relativeを入れる必要があるが、.vgt-table thにて既にそう定義されているようなので特に何もしない。 -->
            <div class="resizableTableHandle" @mousedown="resizableTableEventHandler($event)">
              &nbsp;
            </div>
          </template>
          <template v-slot:table-row="props">
            <template v-if="['種別', '初回', '直近'].some(i => i == props.column.label)">
              {{ props.formattedRow[props.column.field] }}
              <a
                v-if="props.row[props.column.label + 'url']"
                :href="props.row[props.column.label + 'url']"
                target="_blank"
                rel="noopener"
              >
                <i class="fas fa-external-link-alt" />
              </a>
            </template>
            <template v-else-if="['平均間隔', '絶対差'].some(i => i == props.column.label)">
              {{ props.formattedRow[props.column.field] }}日
            </template>
            <template v-else>
              {{ props.formattedRow[props.column.field] }}
            </template>
          </template>
          <div slot="emptystate">
            <b-alert show variant="warning">該当する項目がありません。</b-alert>
          </div>
        </vue-good-table>
      </b-card>
    </b-card>
  </b-container>
</template>

<script>
import friendsJson from '../json/friends.json';
import photoNormalJson from '../json/photo_normal.json';
import photoWildJson from '../json/photo_wild.json';
import photoMaterialJson from '../json/photo_material.json';
import eventsJson from '../json/events.json';

import daysToReadableString from '@/mixins/daysToReadableString.js';
import StatisticsSimpleTable from '@/components/StatisticsSimpleTable.vue';

import dayjs from 'dayjs';

export default {
  name: 'Statistics',
  mixins: [daysToReadableString],
  components: {
    StatisticsSimpleTable,
  },
  data() {
    return {
      stat: new Map(), //ページに表示する各統計値を格納するMap
      //イベント予想テーブルカラム
      eventaTableColumns: [
        {
          field: '種別',
          label: '種別',
        },
        {
          field: '開催数',
          label: '開催数',
          type: 'number',
          sortable: true,
          formatFn: this.eventTableFormatFnRaw,
          sortFn: this.eventTableNumberColumnSortFn,
        },
        {
          field: '初回',
          label: '初回',
          type: 'date',
          dateInputFormat: 'yyyyMMddHHmm',
          dateOutputFormat: 'yyyy/MM/dd',
        },
        {
          field: '直近',
          label: '直近',
          type: 'date',
          dateInputFormat: 'yyyyMMddHHmm',
          dateOutputFormat: 'yyyy/MM/dd',
        },
        {
          field: '平均間隔',
          label: '平均間隔',
          type: 'number',
          sortable: true,
          formatFn: this.eventTableFormatFnRaw,
          sortFn: this.eventTableNumberColumnSortFn,
        },
        {
          field: '次回予想',
          label: '次回予想',
          type: 'date',
          dateInputFormat: 'yyyyMMddHHmm',
          dateOutputFormat: 'yyyy/MM/dd',
        },
        {
          field: '絶対差',
          label: '絶対差',
          type: 'number',
          sortable: true,
          formatFn: this.eventTableFormatFnRaw,
          sortFn: this.eventTableNumberColumnSortFn,
        },
      ],
      //イベント予想テーブル実データ
      eventTableRows: [],
    };
  },
  beforeMount() {
    //値が動的に変化することはないのでbeforeMount()にてすべて調査、セットする

    //masterJson取得(jsonからディープコピー)
    let masterJsonFriends = JSON.parse(JSON.stringify(friendsJson));
    let masterJsonPhotoNormal = JSON.parse(JSON.stringify(photoNormalJson));
    let masterJsonPhotoWild = JSON.parse(JSON.stringify(photoWildJson));
    let masterJsonPhotoMaterial = JSON.parse(JSON.stringify(photoMaterialJson));
    let masterJsonEvents = JSON.parse(JSON.stringify(eventsJson));

    //フレンズ
    {
      //作業変数宣言
      //はなまるチェンジ
      let tmpHanamaruChange = 0;
      const tmpHanamaruChangeRegex = new RegExp(/^【/);
      //フレンズ名長さ
      const tmpFriendsNameLengthCollector = {
        最大値: 0,
        最大値noHc: 0,
        最小値: Number.MAX_SAFE_INTEGER,
        最大フレンズ: [],
        最大フレンズnoHc: [],
        最小フレンズ: [],
      };

      //属性・サブ属性
      const tmpTypeWork = [
        {
          属性名: 'ファニー',
          属性URL: '/friends?t1=ファニー',
          サブ属性URL: '/friends?v=2&t2=ファニー',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
        {
          属性名: 'フレンドリー',
          属性URL: '/friends?t1=フレンドリー',
          サブ属性URL: '/friends?v=2&t2=フレンドリー',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
        {
          属性名: 'リラックス',
          属性URL: '/friends?t1=リラックス',
          サブ属性URL: '/friends?v=2&t2=リラックス',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
        {
          属性名: 'ラブリー',
          属性URL: '/friends?t1=ラブリー',
          サブ属性URL: '/friends?v=2&t2=ラブリー',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
        {
          属性名: 'アクティブ',
          属性URL: '/friends?t1=アクティブ',
          サブ属性URL: '/friends?v=2&t2=アクティブ',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
        {
          属性名: 'マイペース',
          属性URL: '/friends?t1=マイペース',
          サブ属性URL: '/friends?v=2&t2=マイペース',
          属性カウンタ: 0,
          サブ属性カウンタ: 0,
        },
      ];
      let tmpTypeSubCounter = 0;
      //初期けも級
      let tmpKemoKyuuCounter = [0, 0, 0, 0];
      //パーティドレス(フォトポケ12)
      let tmpPhotoPoke12 = 0;
      //野生解放5
      let tmpYaseiKaihou5 = 0;
      //ステータス
      let tmpStatus = new Map([
        [
          'けもステ',
          {
            比較対象: '70けもステ',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          '体力',
          {
            比較対象: '70体力',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          '攻撃',
          {
            比較対象: '70攻撃',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          '守り',
          {
            比較対象: '70守り',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          '回避',
          {
            比較対象: '回避',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          'プラズム',
          {
            比較対象: 'プラズム',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
        [
          'MP',
          {
            比較対象: 'MP',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フレンズ: [],
            最小フレンズ: [],
          },
        ],
      ]);
      //フラッグ3枚以上
      const tmpFlag3Beat = [];
      const tmpFlag3Action = [];
      const tmpFlag3Try = [];
      //待機スキル
      const tmpTaiki = {
        発動率最大: 100,
        発動率最小: Number.MAX_SAFE_INTEGER,
        発動率最大フレンズ: [],
        発動率最小フレンズ: [],
        発動率最大url: '/friends?v=38&s=発動率：100%25&r=true',
        発動率最小url: '/friends?v=38&s=発動率：',
        発動回数無限大: '∞',
        発動回数最大: 0,
        発動回数最小: Number.MAX_SAFE_INTEGER,
        発動回数無限大フレンズ: [],
        発動回数最大フレンズ: [],
        発動回数最小フレンズ: [],
        発動回数無限大url: '/friends?v=38&s=発動回数：∞&r=true',
        発動回数最大url: '/friends?v=38&s=発動回数：',
        発動回数最小url: '/friends?v=38&s=発動回数：',
      };
      //キセキとくせい未実装
      const tmpKisekiNashi = [];
      //なないろとくせい実装済
      const tmpNanairoAri = [];
      //CV掛け持ち数
      let tmpCvMap = new Map();
      //CV後日実装
      let tmpCvGozituMap = new Map();
      //直近実装フレンズ
      let tmpNewDate = 0;
      let tmpNewName = '';
      //フレンズ入手区分
      const tmpKubun = new Map([
        ['配布', []],
        ['恒常', []],
        ['コラボフレンズ', []],
      ]);

      //Jsonを走査
      masterJsonFriends.forEach(i => {
        //はなまるチェンジ
        if (tmpHanamaruChangeRegex.test(i.名前)) tmpHanamaruChange++;
        //フレンズ名長さ
        //最大値検索
        if (tmpFriendsNameLengthCollector.最大値 < i.名前.length) {
          tmpFriendsNameLengthCollector.最大値 = i.名前.length;
          tmpFriendsNameLengthCollector.最大フレンズ = [i.名前]; //新配列に差し替え
        } else if (tmpFriendsNameLengthCollector.最大値 == i.名前.length) {
          tmpFriendsNameLengthCollector.最大フレンズ.push(i.名前);
        }
        //最大値(HC除く)検索
        if (!i.名前.startsWith('【') && tmpFriendsNameLengthCollector.最大値noHc < i.名前.length) {
          tmpFriendsNameLengthCollector.最大値noHc = i.名前.length;
          tmpFriendsNameLengthCollector.最大フレンズnoHc = [i.名前]; //新配列に差し替え
        } else if (
          !i.名前.startsWith('【') &&
          tmpFriendsNameLengthCollector.最大値noHc == i.名前.length
        ) {
          tmpFriendsNameLengthCollector.最大フレンズnoHc.push(i.名前);
        }
        //最小値検索
        if (tmpFriendsNameLengthCollector.最小値 > i.名前.length) {
          tmpFriendsNameLengthCollector.最小値 = i.名前.length;
          tmpFriendsNameLengthCollector.最小フレンズ = [i.名前]; //新配列に差し替え
        } else if (tmpFriendsNameLengthCollector.最小値 == i.名前.length) {
          tmpFriendsNameLengthCollector.最小フレンズ.push(i.名前);
        }

        //属性・サブ属性
        tmpTypeWork.forEach(j => {
          if (i.属性 == j.属性名) j.属性カウンタ++;
          if (i.サブ属性 == j.属性名) {
            j.サブ属性カウンタ++;
            tmpTypeSubCounter++;
          }
        });
        //初期けも級
        if (!isNaN(i.初期けも級) && 1 <= i.初期けも級 && i.初期けも級 <= 4)
          tmpKemoKyuuCounter[i.初期けも級 - 1]++;
        //パーティドレス(フォトポケ12)
        if (12 <= i.フォトポケ) tmpPhotoPoke12++;
        //野生解放5
        if (5 <= i.野生解放) tmpYaseiKaihou5++;
        //ステータス
        tmpStatus.forEach(j => {
          if (!Number(i[j.比較対象]).isNaN) {
            //空文字は処理スキップ
            //最大値検索
            if (j.最大値 < i[j.比較対象]) {
              j.最大値 = i[j.比較対象];
              j.最大フレンズ = [i.名前]; //新配列に差し替え
            } else if (j.最大値 == i[j.比較対象]) {
              j.最大フレンズ.push(i.名前);
            }
            //最小値検索
            if (j.最小値 > i[j.比較対象]) {
              j.最小値 = i[j.比較対象];
              j.最小フレンズ = [i.名前]; //新配列に差し替え
            } else if (j.最小値 == i[j.比較対象]) {
              j.最小フレンズ.push(i.名前);
            }
          }
        });
        //フラッグ3枚以上
        const tmpFlag3Concat = i.flag1 + i.flag2 + i.flag3 + i.flag4 + i.flag5;
        if (new RegExp('b{3}').test(tmpFlag3Concat)) tmpFlag3Beat.push(i.名前);
        if (new RegExp('(a[0-9]+){3}').test(tmpFlag3Concat)) tmpFlag3Action.push(i.名前);
        if (new RegExp('(t[0-9]+){3}').test(tmpFlag3Concat)) tmpFlag3Try.push(i.名前);
        //待機スキル
        let tmpTaikiCurrentRate = i.たいきスキル詳細.match(/発動率：([0-9]+)%/iu);
        let tmpTaikiCurrentTimes = i.たいきスキル詳細.match(/発動回数：(∞|[0-9]+)/iu);
        //match失敗時はnullが返ってくるので安全策
        if (tmpTaikiCurrentRate && 1 < tmpTaikiCurrentRate.length)
          tmpTaikiCurrentRate = tmpTaikiCurrentRate[1];
        if (tmpTaikiCurrentTimes && 1 < tmpTaikiCurrentTimes.length)
          tmpTaikiCurrentTimes = tmpTaikiCurrentTimes[1];
        //発動率
        if (tmpTaikiCurrentRate) {
          //空文字やnullは処理スキップ
          //最大値検索
          if (tmpTaikiCurrentRate == 100) {
            tmpTaiki.発動率最大フレンズ.push(i.名前);
          }
          //最小値検索
          if (tmpTaiki.発動率最小 > tmpTaikiCurrentRate) {
            tmpTaiki.発動率最小 = tmpTaikiCurrentRate;
            tmpTaiki.発動率最小フレンズ = [i.名前]; //新配列に差し替え
          } else if (tmpTaiki.発動率最小 == tmpTaikiCurrentRate) {
            tmpTaiki.発動率最小フレンズ.push(i.名前);
          }
        }
        //発動回数
        if (tmpTaikiCurrentTimes) {
          //空文字やnullは処理スキップ
          //最大値検索
          if (tmpTaikiCurrentTimes == '∞') {
            //無限大
            tmpTaiki.発動回数無限大フレンズ.push(i.名前);
          } else {
            //最大
            if (tmpTaiki.発動回数最大 < tmpTaikiCurrentTimes) {
              tmpTaiki.発動回数最大 = tmpTaikiCurrentTimes;
              tmpTaiki.発動回数最大フレンズ = [i.名前]; //新配列に差し替え
            } else if (tmpTaiki.発動回数最大 == tmpTaikiCurrentTimes) {
              tmpTaiki.発動回数最大フレンズ.push(i.名前);
            }
          }
          //最小値検索
          if (tmpTaiki.発動回数最小 > tmpTaikiCurrentTimes) {
            tmpTaiki.発動回数最小 = tmpTaikiCurrentTimes;
            tmpTaiki.発動回数最小フレンズ = [i.名前]; //新配列に差し替え
          } else if (tmpTaiki.発動回数最小 == tmpTaikiCurrentTimes) {
            tmpTaiki.発動回数最小フレンズ.push(i.名前);
          }
        }

        //キセキとくせい未実装
        if (i.キセキとくせい名 == '未実装') tmpKisekiNashi.push(i.名前);
        //なないろとくせい実装済
        if (0 < i.なないろとくせい名.length && i.なないろとくせい名 != '未実装')
          tmpNanairoAri.push(i.名前);
        //CV掛け持ち数
        let tmptmpCvMapCounter = 1;
        if (tmpCvMap.has(i.CV)) tmptmpCvMapCounter = tmpCvMap.get(i.CV) + 1;
        tmpCvMap.set(i.CV, tmptmpCvMapCounter);
        //CV後日実装
        if (i.CV == '後日実装') tmpCvGozituMap.set(i.名前, i.実装日);
        //直近実装フレンズ
        if (tmpNewDate < i.実装日) {
          tmpNewDate = i.実装日;
          tmpNewName = [i.名前];
        } else if (tmpNewDate == i.実装日) {
          tmpNewName.push(i.名前);
        }
        //フレンズ入手区分
        tmpKubun.forEach((v, k) => {
          if (0 <= i.備考.indexOf(k)) v.push(i.名前);
        });
      });

      //statに値をセット
      //フレンズ数
      this.stat.set('総フレンズ数', masterJsonFriends.length);
      //はなまるチェンジ
      this.stat.set('はなまるチェンジ', {
        left: ['はなまるチェンジ', 'はなまるチェンジ以外'],
        right: [tmpHanamaruChange, masterJsonFriends.length - tmpHanamaruChange],
        rightPercentage: [
          Math.round((tmpHanamaruChange / masterJsonFriends.length) * 10000) / 100,
          Math.round(
            ((masterJsonFriends.length - tmpHanamaruChange) / masterJsonFriends.length) * 10000
          ) / 100,
        ],
        rightUrls: ['/friends?v=50&s=^【&r=true', '/friends?v=1,3,49,50&s=^[^【]&r=true'],
      });
      //フレンズ名長さ
      this.stat.set('フレンズ名長さ', {
        left: ['最長', '最長(HC除く)', '最短'],
        right: [
          tmpFriendsNameLengthCollector.最大値 + ' 文字',
          tmpFriendsNameLengthCollector.最大値noHc + ' 文字',
          tmpFriendsNameLengthCollector.最小値 + ' 文字',
        ],
        rightList: [
          tmpFriendsNameLengthCollector.最大フレンズ,
          tmpFriendsNameLengthCollector.最大フレンズnoHc,
          tmpFriendsNameLengthCollector.最小フレンズ,
        ],
        rightUrls: [
          '/friends?v=1,3,49,50&s=^.{' + tmpFriendsNameLengthCollector.最大値 + '}%24&r=true',
          '/friends?v=1,3,49,50&s=^[^【].{' +
            (tmpFriendsNameLengthCollector.最大値noHc - 1) +
            '}%24&r=true',
          '/friends?v=1,3,49,50&s=^.{' + tmpFriendsNameLengthCollector.最小値 + '}%24&r=true',
        ],
      });
      //属性・サブ属性
      const tmpTypeArrayMain = {
        left: [],
        leftIsIcon: true,
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      const tmpTypeArraySub = {
        left: [],
        leftIsIcon: true,
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      tmpTypeWork.forEach(j => {
        tmpTypeArrayMain.left.push(j.属性名);
        tmpTypeArrayMain.right.push(j.属性カウンタ);
        tmpTypeArrayMain.rightPercentage.push(
          Math.round((j.属性カウンタ / masterJsonFriends.length) * 10000) / 100
        );
        tmpTypeArrayMain.rightUrls.push(j.属性URL);
        tmpTypeArraySub.left.push(j.属性名);
        tmpTypeArraySub.right.push(j.サブ属性カウンタ);
        tmpTypeArraySub.rightPercentage.push(
          Math.round((j.サブ属性カウンタ / masterJsonFriends.length) * 10000) / 100
        );
        tmpTypeArraySub.rightUrls.push(j.サブ属性URL);
      });
      this.stat.set('フレンズ属性', tmpTypeArrayMain);
      this.stat.set('フレンズサブ属性', tmpTypeArraySub);
      this.stat.set('フレンズサブ属性合計', tmpTypeSubCounter);
      //初期けも級
      const tmpKemoKyuuWork = {
        left: [],
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      tmpKemoKyuuCounter.forEach((i, index) => {
        let tmpKemoKyuuName = '★';
        for (let j = 0; j < index; j++) tmpKemoKyuuName += '★';
        tmpKemoKyuuWork.left.push(tmpKemoKyuuName);
        tmpKemoKyuuWork.right.push(i);
        tmpKemoKyuuWork.rightPercentage.push(
          Math.round((i / masterJsonFriends.length) * 10000) / 100
        );
        tmpKemoKyuuWork.rightUrls.push('/friends?t3=' + tmpKemoKyuuName.length);
      });
      this.stat.set('初期けも級', tmpKemoKyuuWork);
      this.stat.set('パーティドレス', tmpPhotoPoke12);
      this.stat.set('野生解放5', tmpYaseiKaihou5);
      //ステータス
      //登録時はそのままだとフォトと名前が被るので頭に'フレンズ'を足す
      let tmpStatusWork;
      ['けもステ', '体力', '攻撃', '守り', '回避', 'プラズム', 'MP'].forEach(i => {
        tmpStatusWork = tmpStatus.get(i);
        if (i == '回避') {
          //回避なら表示用に%等を追加する
          tmpStatusWork.最大値 = '+' + tmpStatusWork.最大値 + '%';
          tmpStatusWork.最小値 = '+' + tmpStatusWork.最小値 + '%';
        }
        this.stat.set('フレンズ' + i, {
          left: ['最大', '最小'],
          right: [tmpStatusWork.最大値, tmpStatusWork.最小値],
          rightList: [tmpStatusWork.最大フレンズ, tmpStatusWork.最小フレンズ],
        });
      });
      //フラッグ3枚以上
      this.stat.set('フラッグ3Beat', tmpFlag3Beat);
      this.stat.set('フラッグ3Action', tmpFlag3Action);
      this.stat.set('フラッグ3Try', tmpFlag3Try);
      //待機スキル
      this.stat.set('待機スキル発動率', {
        left: ['最大', '最小'],
        right: [tmpTaiki.発動率最大 + '%', tmpTaiki.発動率最小 + '%'],
        rightList: [tmpTaiki.発動率最大フレンズ, tmpTaiki.発動率最小フレンズ],
        rightUrls: [
          tmpTaiki.発動率最大url,
          tmpTaiki.発動率最小url + tmpTaiki.発動率最小 + '%25&r=true',
        ],
      });
      this.stat.set('待機スキル発動回数', {
        left: ['∞', '最大', '最小'],
        right: [
          tmpTaiki.発動回数無限大,
          tmpTaiki.発動回数最大 + '回',
          tmpTaiki.発動回数最小 + '回',
        ],
        rightList: [
          tmpTaiki.発動回数無限大フレンズ,
          tmpTaiki.発動回数最大フレンズ,
          tmpTaiki.発動回数最小フレンズ,
        ],
        rightUrls: [
          tmpTaiki.発動回数無限大url,
          tmpTaiki.発動回数最大url + tmpTaiki.発動回数最大 + '&r=true',
          tmpTaiki.発動回数最小url + tmpTaiki.発動回数最小 + '回&r=true',
        ],
      });
      //キセキとくせい未実装
      this.stat.set('キセキとくせい未実装', tmpKisekiNashi);
      //なないろとくせい実装済
      this.stat.set('なないろとくせい実装済', tmpNanairoAri);
      //CV掛け持ち数
      let tmpCvMapOut = new Map();
      tmpCvMap.delete(''); //空（CV未入力）は削除しておく
      //key,valueを逆転し、2件以上のみ抽出
      tmpCvMap.forEach((v, k) => {
        if (2 <= v) {
          if (tmpCvMapOut.has(v)) {
            tmpCvMapOut.get(v).push(k);
          } else {
            tmpCvMapOut.set(v, [k]);
          }
        }
      });
      //ソートして出力配列形式に変換
      const tmpCvMapOutArray = {
        left: [],
        right: [],
        rightList: [],
        rightListUrls: [],
      };
      [...tmpCvMapOut]
        .sort((a, b) => a[0] - b[0])
        .reverse()
        .forEach(v => {
          tmpCvMapOutArray.left.push(v[0]);
          tmpCvMapOutArray.rightList.push(v[1]);
          const tmpArray = [];
          v[1].forEach(v2 => tmpArray.push('/friends?v=48&t48=' + v2));
          tmpCvMapOutArray.rightListUrls.push(tmpArray);
        });
      this.stat.set('CV掛け持ち数', tmpCvMapOutArray);
      //CV後日実装
      const tmptmpCvGozituMapOutArray = {
        left: [],
        right: [],
        rightList: [],
      };
      tmpCvGozituMap.forEach((v, k) => {
        tmptmpCvGozituMapOutArray.left.push(k);
        tmptmpCvGozituMapOutArray.right.push(dayjs(v, 'YYYYMMDD').format('YYYY/MM/DD'));
        tmptmpCvGozituMapOutArray.rightList.push([
          dayjs().diff(dayjs(v, 'YYYYMMDD'), 'day') + '日前',
          ' (' + this.daysToReadableString(dayjs(v, 'YYYYMMDD'), true) + ')',
        ]);
      });
      this.stat.set('CV後日実装', tmptmpCvGozituMapOutArray);
      //直近実装フレンズ
      this.stat.set(
        '直近実装フレンズ日付',
        tmpNewDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')
      );
      this.stat.set(
        '直近実装フレンズ日付差分',
        this.daysToReadableString(dayjs(tmpNewDate, 'YYYYMMDD'), true)
      );
      this.stat.set('直近実装フレンズ名前', tmpNewName);
      //フレンズ入手区分
      const tmpKubunWork = {
        left: [],
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      tmpKubun.forEach((v, k) => {
        tmpKubunWork.left.push(k);
        tmpKubunWork.right.push(v.length);
        tmpKubunWork.rightPercentage.push(
          Math.round((v.length / masterJsonFriends.length) * 10000) / 100
        );
        tmpKubunWork.rightUrls.push('/friends?t50=' + k);
      });
      this.stat.set('フレンズ入手区分', tmpKubunWork);
    }

    //フォト
    {
      //作業変数宣言
      //フォト名長さ
      const tmpPhotoNameLengthCollector = {
        最大値: 0,
        最小値: Number.MAX_SAFE_INTEGER,
        最大フォト: [],
        最小フォト: [],
      };
      //属性
      const tmpPhotoTypeWork = [
        {
          属性名: 'photoType1',
          属性URL: '/photo?t1=photoType1',
          属性カウンタ: 0,
        },
        {
          属性名: 'photoType2',
          属性URL: '/photo?t1=photoType2',
          属性カウンタ: 0,
        },
        {
          属性名: '',
          属性URL: '',
          属性カウンタ: 0,
        },
      ];
      //フォト★
      let tmpPhotoStarCounter = [0, 0, 0, 0, 0];
      //ステータス
      let tmpPhotoStatus = new Map([
        [
          '体力',
          {
            比較対象: '0体力',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フォト: [],
            最小フォト: [],
          },
        ],
        [
          '攻撃',
          {
            比較対象: '0攻撃',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フォト: [],
            最小フォト: [],
          },
        ],
        [
          '守り',
          {
            比較対象: '0守り',
            最大値: 0,
            最小値: Number.MAX_SAFE_INTEGER,
            最大フォト: [],
            最小フォト: [],
          },
        ],
      ]);
      //最多イラストレーター
      let tmpIllustratorMap = new Map();
      //直近実装フォト
      let tmpPhotoNewDate = 0;
      let tmpPhotoNewName = '';
      //特殊入手フォト
      const tmpPhotoTypeSP = new Map([
        ['ストーリー配布', []],
        ['迷宮ゾーン入手', []],
        ['有料パック販売のみ', []],
      ]);

      //Jsonを走査(結合して走査)
      let masterJsonPhoto = [
        ...masterJsonPhotoNormal,
        ...masterJsonPhotoWild,
        ...masterJsonPhotoMaterial,
      ];
      masterJsonPhoto.forEach(i => {
        //フォト名長さ
        //最大値検索
        if (tmpPhotoNameLengthCollector.最大値 < i.名前.length) {
          tmpPhotoNameLengthCollector.最大値 = i.名前.length;
          tmpPhotoNameLengthCollector.最大フォト = [i.名前]; //新配列に差し替え
        } else if (tmpPhotoNameLengthCollector.最大値 == i.名前.length) {
          tmpPhotoNameLengthCollector.最大フォト.push(i.名前);
        }
        //最小値検索
        if (tmpPhotoNameLengthCollector.最小値 > i.名前.length) {
          tmpPhotoNameLengthCollector.最小値 = i.名前.length;
          tmpPhotoNameLengthCollector.最小フォト = [i.名前]; //新配列に差し替え
        } else if (tmpPhotoNameLengthCollector.最小値 == i.名前.length) {
          tmpPhotoNameLengthCollector.最小フォト.push(i.名前);
        }
        //属性
        tmpPhotoTypeWork.forEach(j => {
          if (i.属性 == j.属性名) j.属性カウンタ++;
        });
        //フォト★
        if (i['☆'] == '') {
          tmpPhotoStarCounter[0]++;
        } else if (!isNaN(i['☆']) && 1 <= i['☆']) {
          tmpPhotoStarCounter[i['☆']]++;
        }
        //ステータス
        tmpPhotoStatus.forEach(j => {
          if (!Number(i[j.比較対象]).isNaN) {
            //空文字は処理スキップ
            //最大値検索
            if (j.最大値 < i[j.比較対象]) {
              j.最大値 = i[j.比較対象];
              j.最大フォト = [i.名前]; //新配列に差し替え
            } else if (j.最大値 == i[j.比較対象]) {
              j.最大フォト.push(i.名前);
            }
            //最小値検索
            if (j.最小値 > i[j.比較対象]) {
              j.最小値 = i[j.比較対象];
              j.最小フォト = [i.名前]; //新配列に差し替え
            } else if (j.最小値 == i[j.比較対象]) {
              j.最小フォト.push(i.名前);
            }
          }
        });
        //最多イラストレーター
        let tmpIllustratorMapCounter = 1;
        if (tmpIllustratorMap.has(i.イラストレータ名))
          tmpIllustratorMapCounter = tmpIllustratorMap.get(i.イラストレータ名) + 1;
        tmpIllustratorMap.set(i.イラストレータ名, tmpIllustratorMapCounter);
        //直近実装フレンズ
        if (tmpPhotoNewDate < i.実装日) {
          tmpPhotoNewDate = i.実装日;
          tmpPhotoNewName = [i.名前];
        } else if (tmpPhotoNewDate == i.実装日) {
          tmpPhotoNewName.push(i.名前);
        }
        //特殊入手フォト
        tmpPhotoTypeSP.forEach((v, k) => {
          if (0 <= i.備考.indexOf(k)) v.push(i.名前);
        });
      });

      //statに値をセット
      //フォト数
      this.stat.set('総フォト数', masterJsonPhoto.length);
      this.stat.set('フォト種別', {
        left: ['通常', 'ワイルド', '強化素材'],
        right: [
          masterJsonPhotoNormal.length,
          masterJsonPhotoWild.length,
          masterJsonPhotoMaterial.length,
        ],
        rightPercentage: [
          Math.round((masterJsonPhotoNormal.length / masterJsonPhoto.length) * 10000) / 100,
          Math.round((masterJsonPhotoWild.length / masterJsonPhoto.length) * 10000) / 100,
          Math.round((masterJsonPhotoMaterial.length / masterJsonPhoto.length) * 10000) / 100,
        ],
        rightUrls: ['/photo?j=normal', '/photo?j=wild', '/photo?j=material'],
      });
      //フォト名長さ
      this.stat.set('フォト名長さ', {
        left: ['最長', '最短'],
        right: [
          tmpPhotoNameLengthCollector.最大値 + ' 文字',
          tmpPhotoNameLengthCollector.最小値 + ' 文字',
        ],
        rightList: [tmpPhotoNameLengthCollector.最大フォト, tmpPhotoNameLengthCollector.最小フォト],
        rightUrls: [
          '/photo?v=1,2,10,12,13&s=^.{' + tmpPhotoNameLengthCollector.最大値 + '}%24&r=true',
          '/photo?v=1,2,10,12,13&s=^.{' + tmpPhotoNameLengthCollector.最小値 + '}%24&r=true',
        ],
      });
      //属性
      const tmpTypeArrayMain = {
        left: [],
        leftIsIcon: true,
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      tmpPhotoTypeWork.forEach(j => {
        tmpTypeArrayMain.left.push(j.属性名);
        tmpTypeArrayMain.right.push(j.属性カウンタ);
        tmpTypeArrayMain.rightPercentage.push(
          Math.round((j.属性カウンタ / masterJsonPhoto.length) * 10000) / 100
        );
        tmpTypeArrayMain.rightUrls.push(j.属性URL);
      });
      this.stat.set('フォト属性', tmpTypeArrayMain);
      this.stat.set('強化素材フォト件数', masterJsonPhotoMaterial.length);
      if (masterJsonPhotoMaterial.length < tmpPhotoTypeWork[2]['属性カウンタ'])
        this.stat.set('未入力フォト有', true);
      //フォト★
      const tmpPhotoStarWork = {
        left: [],
        right: [],
        rightPercentage: [],
        rightUrls: [],
      };
      tmpPhotoStarCounter.forEach((i, index) => {
        let tmpPhotoStarStr = '';
        for (let j = 0; j < index; j++) tmpPhotoStarStr += '★';
        tmpPhotoStarWork.left.push(tmpPhotoStarStr);
        tmpPhotoStarWork.right.push(i);
        tmpPhotoStarWork.rightPercentage.push(
          Math.round((i / masterJsonPhoto.length) * 10000) / 100
        );
        tmpPhotoStarWork.rightUrls.push(
          '/photo?j=material,normal,wild&t2=' + tmpPhotoStarStr.length
        );
      });
      if (0 < tmpPhotoStarCounter[0]) {
        //★無しが存在
        tmpPhotoStarWork.left[0] = '無'; //★無しは'無'表記に
        this.stat.set('★無フォト有', true); //注釈制御用
      } else {
        //★無しが存在しない。先頭要素を削除
        tmpPhotoStarWork.left.shift();
        tmpPhotoStarWork.right.shift();
        tmpPhotoStarWork.rightPercentage.shift();
        tmpPhotoStarWork.rightUrls.shift();
      }
      this.stat.set('フォト★', tmpPhotoStarWork);
      //ステータス
      //登録時はそのままだとフレンズと名前が被るので頭に'フォト'を足す
      let tmpStatusWork;
      ['体力', '攻撃', '守り'].forEach(i => {
        tmpStatusWork = tmpPhotoStatus.get(i);
        this.stat.set('フォト' + i, {
          left: ['最大', '最小'],
          right: [tmpStatusWork.最大値, tmpStatusWork.最小値],
          rightList: [tmpStatusWork.最大フォト, tmpStatusWork.最小フォト],
        });
      });
      //最多イラストレーター
      let tmpIllustratorMapOut = new Map();
      tmpIllustratorMap.delete(''); //空（CV未入力）は削除しておく
      //key,valueを逆転し、2件以上のみ抽出
      tmpIllustratorMap.forEach((v, k) => {
        if (2 <= v) {
          if (tmpIllustratorMapOut.has(v)) {
            tmpIllustratorMapOut.get(v).push(k);
          } else {
            tmpIllustratorMapOut.set(v, [k]);
          }
        }
      });
      //ソートして出力配列形式に変換
      const tmpIllustratorMapArray = {
        left: [],
        right: [],
        rightList: [],
        rightListUrls: [],
      };
      [...tmpIllustratorMapOut]
        .sort((a, b) => a[0] - b[0])
        .reverse()
        .forEach(v => {
          tmpIllustratorMapArray.left.push(v[0]);
          tmpIllustratorMapArray.rightList.push(v[1]);
          const tmpArray = [];
          v[1].forEach(v2 => tmpArray.push('/photo?v=11&t11=' + v2));
          tmpIllustratorMapArray.rightListUrls.push(tmpArray);
        });
      this.stat.set('最多イラストレーター', tmpIllustratorMapArray);
      //直近実装フォト
      this.stat.set(
        '直近実装フォト日付',
        tmpPhotoNewDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')
      );
      this.stat.set(
        '直近実装フォト日付差分',
        this.daysToReadableString(dayjs(tmpPhotoNewDate, 'YYYYMMDD'), true)
      );
      this.stat.set('直近実装フォト名前', tmpPhotoNewName);
      //特殊入手フォト
      let tmpPhotoTypeSPWork = {
        left: [],
        right: [],
        rightList: [],
        rightUrls: [],
      };
      tmpPhotoTypeSP.forEach((v, k) => {
        tmpPhotoTypeSPWork.left.push(k);
        tmpPhotoTypeSPWork.right.push(v.length);
        tmpPhotoTypeSPWork.rightList.push(v);
        tmpPhotoTypeSPWork.rightUrls.push('/photo?j=material,normal,wild&t13=' + k);
      });
      this.stat.set('特殊入手フォト', tmpPhotoTypeSPWork);
    }

    //その他(イベント)
    {
      //イベント情報
      //eventsCollectorを作るための定義情報のみを集めた配列。要素は以下の順
      //種別、必須タグ配列、除外タグ配列("フレンズ(招待)"などはjsonだと"しょうたい"なので注意)、URL
      const eventsCollectorWork = [
        ['ドレスアップ招待', ['ドレスアップ'], [], '/events?ok=ドレスアップ&ng='],
        ['フォトガチャ', ['フォトガチャ'], [], '/events?ok=フォトガチャ&ng='],
        ['アンケート', ['アンケート'], [], '/events?ok=アンケート&ng='],
        ['メインストーリー(S3以降)', ['メインストーリー'], [], '/events?ok=メインストーリー&ng='],
        [
          'とくべつくんれん',
          ['とくべつくんれん', 'シナリオ'],
          [],
          '/events?ok=とくべつくんれん,シナリオ&ng=',
        ],
        ['マップキー', ['マップキー', 'シナリオ'], [], '/events?ok=マップキー,シナリオ&ng='],
        ['体力測定', ['体力測定', 'シナリオ'], [], '/events?ok=体力測定,シナリオ&ng='],
        ['共闘', ['共闘'], ['しょうたい'], '/events?ok=共闘&ng=しょうたい'],
        ['大掃除', ['大掃除'], ['しょうたい'], '/events?ok=大掃除&ng=しょうたい'],
        ['野生大開放', ['野生大開放'], ['しょうたい'], '/events?ok=野生大開放&ng=しょうたい'],
        [
          '期間限定○月しょうたい',
          ['期間限定○月しょうたい'],
          [],
          '/events?ok=期間限定○月しょうたい&ng=',
        ],
        [
          'コラボイベント',
          ['コラボイベント', 'シナリオ'],
          [],
          '/events?ok=コラボイベント,シナリオ&ng=',
        ],
        ['タイアップ', ['タイアップ', '配布'], [], '/events?ok=タイアップ,配布&ng='],
        ['キセキとくせい開放', ['キセキとくせい開放'], [], '/events?ok=キセキとくせい開放&ng='],
        [
          '無料ガチャ(マップキー除く)',
          ['無料ガチャ'],
          ['マップキー'],
          '/events?ok=無料ガチャ&ng=マップキー',
        ],
        [
          '期間限定クエスト',
          ['すぺしゃるクエスト:期間限定クエスト'],
          [],
          '/events?ok=すぺしゃるクエスト:期間限定クエスト&ng=',
        ],
        [
          'スタミナ回復速度上昇',
          ['スタミナ回復速度上昇'],
          [],
          '/events?ok=スタミナ回復速度上昇&ng=',
        ],
        [
          '獲得増加(なかよしポイント)',
          ['獲得増加(なかよしポイント)'],
          [],
          '/events?ok=獲得増加(なかよしポイント)&ng=',
        ],
        [
          '成功確率増加(フレンズ成長)',
          ['成功確率増加(フレンズ成長)'],
          [],
          '/events?ok=成功確率増加(フレンズ成長)&ng=',
        ],
        [
          '成功確率増加(フォト強化)',
          ['成功確率増加(フォト強化)'],
          [],
          '/events?ok=成功確率増加(フォト強化)&ng=',
        ],
      ];
      const eventsCollector = [];
      eventsCollectorWork.forEach(i => {
        eventsCollector.push({
          種別: i[0],
          必須タグ: i[1],
          除外タグ: i[2],
          url: i[3],
          イベント名: [],
          イベントurl: [],
          イベント日付: [],
          平均間隔: null,
          次回予想: null, //データなしはnullにしないとvue-good-tableのフォーマットでエラーが出る
          絶対差: null, //次回予想と現在日付との差の絶対値（絶対差）
        });
      });

      //Jsonを走査
      masterJsonEvents.forEach(i => {
        //イベント情報
        //タグの存在チェックから
        if (i[4]) {
          eventsCollector.forEach(j => {
            if (
              j.必須タグ.every(k => 0 <= i[4].indexOf(k)) &&
              j.除外タグ.every(k => i[4].indexOf(k) < 0)
            ) {
              //メインストーリーの予想をより正確にすべく、メインストーリーの場合は日付チェックでS3以降のみ対象とする
              if (j.種別 !== 'メインストーリー(S3以降)' || 2211111800 <= i[2]) {
                //メインストーリー以外の場合は無条件でここに入る
                if (i[1].match(/[「『](.*)[」』]/, '$1')) {
                  //イベント名に対し正規表現で括弧内トリミングを試みる。大抵の場合うまくゆく
                  j.イベント名.push(i[1].match(/[「『](.*)[」』]/, '$1')[1]);
                } else {
                  //失敗した場合は全文を追加
                  j.イベント名.push(i[1]);
                }
                j.イベントurl.push(i[0]);
                j.イベント日付.push(i[2]);
              }
            }
          });
        }
      });
      //イベント情報 開催頻度計算
      eventsCollector.forEach(i => {
        if (1 < i.イベント日付.length) {
          let sum = 0;
          for (let index = 0; index < i.イベント日付.length - 1; index++) {
            sum += dayjs(i.イベント日付[index + 1], 'YYMMDDHHmm').diff(
              dayjs(i.イベント日付[index], 'YYMMDDHHmm'),
              'day'
            );
          }
          i.平均間隔 = Math.round(sum / (i.イベント日付.length - 1));
          i.次回予想 = dayjs(i.イベント日付[i.イベント日付.length - 1], 'YYMMDDHHmm')
            .add(i.平均間隔, 'day')
            .format('YYYYMMDDHHmm');
          //絶対差計算
          i.絶対差 = Math.abs(dayjs().diff(dayjs(i.次回予想, 'YYYYMMDDHHmm'), 'day'));
        }
      });

      //サービス日数
      this.stat.set('サービス日数', {
        left: ['リリース日(2019/09/24)から', '運営主体変更(2021/07/30)から'],
        right: [
          dayjs().diff(dayjs('2019/09/24'), 'day') + '日',
          dayjs().diff(dayjs('2021/07/30'), 'day') + '日',
        ],
        rightList: [
          ['(' + this.daysToReadableString(dayjs('2019/09/24')) + ')'],
          ['(' + this.daysToReadableString(dayjs('2021/07/30')) + ')'],
        ],
      });

      //アニバーサリー
      let tmpNextAnniversaryDate = dayjs()
        .set('month', 8)
        .set('date', 24);
      let tmpNextHalfAnniversaryDate = dayjs()
        .set('month', 2)
        .set('date', 24);
      //今年のアニバーサリーを過ぎていたら１年追加
      if (tmpNextAnniversaryDate.diff(dayjs()) < 0)
        tmpNextAnniversaryDate = tmpNextAnniversaryDate.add(1, 'year');
      if (tmpNextHalfAnniversaryDate.diff(dayjs()) < 0)
        tmpNextHalfAnniversaryDate = tmpNextHalfAnniversaryDate.add(1, 'year');
      this.stat.set('アニバーサリー', {
        left: ['次のアニバーサリー (9/24) まで', '次のハーフ・アニバーサリー (3/24) まで'],
        right: [
          tmpNextAnniversaryDate.diff(dayjs(), 'day') + '日',
          tmpNextHalfAnniversaryDate.diff(dayjs(), 'day') + '日',
        ],
        //日数の補足としてリーダブルな文字列をつけるが、30日以下だとn日が並ぶだけで無意味なので30日以上の場合のみ追加する
        rightList: [
          [
            30 < tmpNextAnniversaryDate.diff(dayjs(), 'day')
              ? '(' + this.daysToReadableString(tmpNextAnniversaryDate) + ')'
              : '',
          ],
          [
            30 < tmpNextHalfAnniversaryDate.diff(dayjs(), 'day')
              ? '(' + this.daysToReadableString(tmpNextHalfAnniversaryDate) + ')'
              : '',
          ],
        ],
      });
      //イベント情報
      eventsCollector.forEach(i => {
        //dataのeventTableRowsに追加する
        this.eventTableRows.push({
          種別: i.種別,
          開催数: i.イベント日付.length,
          種別url: i.url,
          初回: '20' + i.イベント日付[0],
          初回url: i.イベントurl[0],
          直近: '20' + i.イベント日付[i.イベント日付.length - 1],
          直近url: i.イベントurl[i.イベントurl.length - 1],
          平均間隔: i.平均間隔,
          次回予想: i.次回予想,
          絶対差: i.絶対差,
        });

        //ついでにコラボ、タイアップの情報も格納する
        if (i.種別 == 'コラボイベント') {
          this.stat.set('コラボイベント一覧', [
            i.イベント名,
            '/events?ok=コラボイベント,シナリオ&ng=',
          ]);
        } else if (i.種別 == 'タイアップ') {
          this.stat.set('タイアップ一覧', [i.イベント名, '/events?ok=タイアップ,配布&ng=']);
        }
      });
    }
  },
  methods: {
    //vue-good-tableデータ生出力用formatter
    eventTableFormatFnRaw(v) {
      //数値の場合はそのまま。数値にできない場合は'-'
      return Number.isInteger(v) ? v : '-';
    },
    //vue-good-table用numberカラムのsort用function
    //値が無効(空文字やnull)の場合は優先度を最低にする
    eventTableNumberColumnSortFn(x, y) {
      //入力には’’や0が来る可能性があるがisNaN('')はtrueとなってしまうためNumber.isIntegerで比較する
      //数値にできない場合は優先度を最低(Number.MAX_SAFE_INTEGER)にする
      const ix = Number.isInteger(x) ? x : Number.MAX_SAFE_INTEGER;
      const iy = Number.isInteger(y) ? y : Number.MAX_SAFE_INTEGER;
      return ix < iy ? -1 : ix > iy ? 1 : 0;
    },
  },
};
</script>
<style scoped></style>
