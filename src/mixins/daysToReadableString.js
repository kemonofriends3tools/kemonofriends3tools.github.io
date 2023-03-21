import dayjs from 'dayjs';

export default {
  data() {
    return {
      /**
       * DayJSで示された日付を"何年何ヶ月何日前"といった読みやすい文字列に変換する
       * @param {Object} target 調べたい対象の日付
       * @param {boolean} suffix 接尾辞をつけるかどうか
       * @returns {string} "何年何ヶ月何日前"といった文字列。時間以下は表示しない。本日の場合は"本日"と出力する。
       */
      daysToReadableString: (target, suffix) => {
        //日数差を取得。未来日付の場合マイナスになるので絶対値を取る
        let days = Math.abs(dayjs().diff(target, 'day'));
        let out = '';
        if (days == 0) {
          out = '本日';
        } else {
          //年
          if (365 <= days) {
            out += Math.floor(days / 365).toString() + '年';
            days = Math.floor(days % 365);
          }
          //月
          if (days != 0 && 365 / 12 < days) {
            out += Math.floor(days / (365 / 12)).toString() + 'ヶ月';
            days = Math.floor(days % (365 / 12));
          }
          //日
          if (days != 0 && 0 < days) out += days.toString() + '日';
          //本日日付と比較して接尾辞をつける（本日の場合はここに入ってこないので考慮せずとも良い）
          if (suffix) {
            if (dayjs().isAfter(target)) {
              out += '前';
            } else {
              out += '後';
            }
          }
        }
        return out;
      },
    };
  },
};
