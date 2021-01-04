const _ = require('lodash');
const Fs = require('fs-extra');
const Base64 = require('js-base64');
const { get } = require('axios');
const MysClient = require('./src/mys/client');
const WbClient = require('./src/weibo/client');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const sleep = (ms = Math.floor((1 + Math.random()) * 5000)) => new Promise(resolve => setTimeout(resolve, ms));

const getWbConfig = () => {
  if (Fs.existsSync('wbconfig.json')) {
    try {
      return Fs.readJsonSync('wbconfig.json');
    } catch (error) {
      console.error('wbconfig.json 格式错误');
      console.error(String(e));
    }
  }
  if (!Base64.isValid(process.env.WB_CONFIG)) return [];
  try {
    return JSON.parse(Base64.decode(process.env.WB_CONFIG));
  } catch (e) {
    console.error('WB_CONFIG 配置错误');
    console.error(String(e));
  }
  return [];
};

(async () => {
  // mys
  for (const cookie of (process.env.COOKIE || '').split('#')) {
    if (!cookie) continue;

    const mysClient = new MysClient(cookie);

    const roles = await mysClient.getRoles();
    await sleep();

    for (const role of roles) {
      await mysClient.checkin(role);
      await sleep();
    }
  }

  // weibo
  for (const [i, { webhook, ...config }] of Object.entries(getWbConfig())) {
    console.log(`WB[${i}]`);
    const wbClient = new WbClient(config);

    if (!(await wbClient.checkin())) continue;
    await sleep();

    const giftList = await wbClient.getGiftList().catch(e => {
      global.failed = true;
      console.error('礼包列表请求失败');
      console.error(String(e));
    });
    if (!giftList) continue;
    if (!giftList.length) {
      console.log('暂无可领取礼包');
      continue;
    }

    const myGiftBox = await wbClient.getMyGiftBox().catch(e => {
      global.failed = true;
      console.error('已领取礼包列表请求失败');
      console.error(String(e));
    });
    if (!myGiftBox) continue;

    const gift = giftList.find(({ id }) => !myGiftBox.includes(id));
    if (!gift) {
      console.log('暂无可领取礼包');
      continue;
    }
    await sleep();

    const code = await wbClient.getGiftCode(gift);
    if (!code) continue;

    if (webhook) {
      await get(_.template(webhook)(_.mapValues({ ...gift, code, index: i }, v => encodeURIComponent(v))))
        .then(() => console.log('Webhook 调用成功'))
        .catch(e => {
          global.failed = true;
          console.error('Webhook 调用失败');
          console.error(String(e));
        });
    }
  }

  if (global.failed) process.exit(1);
})();
