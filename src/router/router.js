import Vue from 'vue';
import VueRouter from 'vue-router';
import { setTitle, setDescription } from '@/mixins/title';

import Home from '@/views/Home.vue';
import SearchFriends from '@/views/SearchFriends.vue';
import SearchFriends2 from '@/views/SearchFriends2.vue';
import SearchPhoto from '@/views/SearchPhoto.vue';
import SearchEvents from '@/views/SearchEvents.vue';
import SearchEvents2 from '@/views/SearchEvents2.vue';
import Calc from '@/views/Calc.vue';
import dev from '@/views/Dev.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      description:
        'アプリ版『けものフレンズ３』隊長さんのための少し便利なツールを提供しています。 特殊な条件でのフレンズ/フォト/イベント/しょうたい検索の他、プレイに役立つ各種計算などが行えます。',
    },
  },
  {
    path: '/friends',
    name: 'SearchFriends',
    component: SearchFriends,
    meta: {
      title: 'フレンズ検索',
      description: 'アプリ版「けものフレンズ３」のフレンズを特殊な条件で検索することができます。',
    },
  },
  {
    path: '/friends2',
    name: 'SearchFriends2',
    component: SearchFriends2,
    meta: {
      title: 'フレンズ検索(開発版β)',
      description: 'アプリ版「けものフレンズ３」のフレンズを特殊な条件で検索することができます。',
    },
  },
  {
    path: '/photo',
    name: 'photo',
    component: SearchPhoto,
    meta: {
      title: 'フォト検索',
      description: 'アプリ版「けものフレンズ３」のフォトを特殊な条件で検索することができます。',
    },
  },
  {
    path: '/events',
    name: 'events',
    component: SearchEvents,
    meta: {
      title: 'イベント・しょうたい検索',
      description:
        'アプリ版「けものフレンズ３」のイベントやしょうたいを特殊な条件で検索することができます。',
    },
  },
  {
    path: '/events2',
    name: 'events2',
    component: SearchEvents2,
    meta: {
      title: 'イベント・しょうたい検索(開発版β)',
      description:
        'アプリ版「けものフレンズ３」のイベントやしょうたいを特殊な条件で検索することができます。',
    },
  },
  {
    path: '/calc',
    name: 'calc',
    component: Calc,
    meta: {
      title: '各種計算',
      description: 'アプリ版「けものフレンズ３」のプレイに役立つ各種計算などが行えます。',
    },
  },
  {
    path: '/dev',
    name: '開発用',
    component: dev,
    meta: { title: '開発用', description: 'sandbox' },
  },
];

const router = new VueRouter({
  //ローカルでテスト動作させる場合、modeがhistoryだとFirefoxでは問題ないがChrome等ではURL絡みのナビゲーションエラーになる。modeをhashにすると暫定対処できる。本番はhistoryとする。
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

//title及びdescriptionの更新
router.beforeEach((to, from, next) => {
  setTitle(to.meta.title);
  setDescription(to.meta.description);
  next();
});

export default router;
