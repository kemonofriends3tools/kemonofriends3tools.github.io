//@はwebpackの機能にてデフォルトでsrcに解決される
import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import vuegtag from 'vue-gtag';

Vue.use(vuegtag, {
  config: { id: 'G-D4MYVEK3TJ' },
});

import '@/assets/scss/kemonofriends3tools.scss';

//dayjs。localeをここで指定しておく。
//pluginとしてisSameOrAfterを入れておく。
//必要ならisSameOrBefore、CustomParseFormat、IsBetween、MinMaxあたりは役立つかも。
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
dayjs.locale('ja');
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

//vue-cookies
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);
Vue.$cookies.config('10y'); //有効期限10年

//vue-good-table
import VueGoodTablePlugin from 'vue-good-table';
Vue.use(VueGoodTablePlugin);
import '@/assets/scss/custom-vue-good-table.scss';

//v-calendar
import VCalendar from 'v-calendar';
Vue.use(VCalendar, {
  screens: {
    //calenderの幅は約256px。それにサイト両側のマージン等を目で確認しながら決定。環境が異なったらダメかもしれないがとりあえず破綻はしていない。
    c2: '600px',
    c3: '854px',
    c4: '1120px',
    c5: '1370px',
    c6: '1630px',
  },
  locales: {
    ja: {
      firstDayOfWeek: 1,
      masks: {
        title: 'YYYY年MM月',
        input: ['YYYY/MM/DD (W)', 'YYYY/MM/DD'],
        dayPopover: 'YYYY/MM/DD(W)',
      },
    },
  },
});

//vue2-timepicker
//Vue.useはうまくいかなかったので各コンポーネント内でimportする。
//cssはここで登録しておく。
import 'vue2-timepicker/dist/VueTimepicker.css';

//vue-select
import vSelect from 'vue-select';
Vue.component('v-select', vSelect);
import '@/assets/scss/custom-vue-select.scss';

//BootstrapVue + icon
//iconを全部入れると500KiB程サイズが増える。必要なものだけ持ってくること。
import {
  BootstrapVue,
  BIcon,
  BIconFunnel,
  BIconCalendar3,
  BIconEye,
  BIconSearch,
  BIconQuestionCircleFill,
  BIconServer,
  BIconArrowCounterclockwise,
} from 'bootstrap-vue';
Vue.use(BootstrapVue);
import '@/assets/scss/custom-honoka.scss'; //bootstrapのカスタムテーマ
Vue.component('BIcon', BIcon);
Vue.component('BIconFunnel', BIconFunnel);
Vue.component('BIconCalendar3', BIconCalendar3);
Vue.component('BIconEye', BIconEye);
Vue.component('BIconSearch', BIconSearch);
Vue.component('BIconQuestionCircleFill', BIconQuestionCircleFill);
Vue.component('BIconServer', BIconServer);
Vue.component('BIconArrowCounterclockwise', BIconArrowCounterclockwise);

//vue-text-highlight
import TextHighlight from 'vue-text-highlight/dist/component';
Vue.component('text-highlight', TextHighlight);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
