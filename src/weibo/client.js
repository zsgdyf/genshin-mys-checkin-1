const _ = require('lodash');
const { get } = require('axios');
const { stringify } = require('qs');
const { load } = require('cheerio');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const containerid = '100808fc439dedbb06ca5fd858848e521b8716';

module.exports = class WbClient {
  constructor(sampleUrl, kaCookie) {
    const sampleParams = Object.fromEntries(new URL(sampleUrl).searchParams.entries());
    this.params = _.pick(sampleParams, ['gsid', 'from', 'c', 's', 'ua']);
    this.headers = {
      'user-agent': 'Weibo/50822 (iPhone; iOS 14.2.1; Scale/3.00)',
    };
    this.kaHeaders = {
      cookie: kaCookie,
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone13,2__weibo__11.0.0__iphone__os14.2.1)',
    };
  }

  async getGiftList() {
    const { data } = await get('https://api.weibo.cn/2/page', {
      params: {
        ...this.params,
        containerid,
      },
      headers: this.headers,
    });

    const list = (() => {
      for (const { card_group } of data.cards) {
        if (!card_group) continue;
        for (const { group } of card_group) {
          if (!group) continue;
          const tmp = group.filter(({ scheme }) => String(scheme).startsWith('https://ka.sina.com.cn'));
          if (tmp.length) return tmp;
        }
      }
      return [];
    })();

    return list.map(({ title_sub, scheme }) => ({
      id: String(/(?<=gift\/)\d+/.exec(scheme)),
      name: title_sub,
    }));
  }

  checkin(retry = 0) {
    return get('https://api.weibo.cn/2/page/button', {
      params: {
        ...this.params,
        request_url: `http://i.huati.weibo.com/mobile/super/active_checkin?pageid=${containerid}&in_page=1`,
      },
      headers: this.headers,
    })
      .then(async ({ data }) => {
        if (data.error_msg) {
          if (retry >= 10) {
            console.log(data.error_msg);
            throw new Error('失败次数过多，放弃签到');
          }
          if (data.error_msg.includes('(402003)')) {
            console.log(data.error_msg);
            console.log('将在5秒后重试');
            await sleep(5000);
            return this.checkin(retry + 1);
          }
          if (!data.error_msg.includes('(382004)')) throw new Error(data.error_msg);
          console.log(data.error_msg);
          return;
        }
        console.log(`签到成功，${_.get(data, 'button.name')}`);
      })
      .catch(e => {
        global.failed = true;
        console.error('签到请求失败');
        console.error(String(e));
      });
  }

  async getMyGiftBox() {
    const { data } = await get('https://ka.sina.com.cn/html5/mybox', {
      headers: this.kaHeaders,
    });
    const $ = load(data);
    return Array.from($('.gift-box .deleBtn')).map(el => $(el).attr('data-itemid'));
  }

  getGiftCode({ id, name }, retry = 0) {
    return get('https://ka.sina.com.cn/innerapi/draw', {
      params: {
        gid: 10725,
        itemId: id,
        channel: 'wblink',
      },
      headers: {
        ...this.kaHeaders,
        referer: `https://ka.sina.com.cn/html5/gift/${id}?${stringify({
          ..._.pick(this.params, ['from', 'ua']),
          channel: 'wblink',
        })}`,
      },
    })
      .then(async ({ data: { msg, data } }) => {
        if (data && data.kahao) {
          console.log(`「${name}」领取成功`);
          return data.kahao;
        }
        console.log(`「${name}」领取失败：${String(msg).replace(/亲爱的.+?，/, '')}`);
        if (retry >= 10) {
          throw new Error('失败次数过多，放弃领取');
        }
        if (msg.includes('领卡拥挤')) {
          console.log('将在5秒后重试');
          await sleep(5000);
          return this.getGiftCode({ id, name }, retry + 1);
        }
      })
      .catch(e => {
        global.failed = true;
        console.error('礼包领取请求失败');
        console.error(String(e));
      });
  }
};
