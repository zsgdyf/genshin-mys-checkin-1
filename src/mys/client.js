const _ = require('lodash');
const { get, post } = require('axios');
const dvid = require('./dvid');
const ds = require('./ds');

const act_id = 'e202009291139501';

const maskUid = uid => uid.substr(-3).padStart(uid.length, '*');

module.exports = class MysClient {
  constructor(cookie) {
    this.headers = {
      'x-rpc-device_id': dvid(),
      'x-rpc-client_type': '5',
      'x-rpc-app_version': '2.3.0',
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.3.0',
      origin: 'https://webstatic.mihoyo.com',
      referer: `https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=${act_id}&utm_source=bbs&utm_medium=mys&utm_campaign=icon`,
      cookie,
    };
  }

  getRoles() {
    return get('https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn', {
      headers: this.headers,
    })
      .then(({ data }) => {
        const list = _.get(data, 'data.list');
        if (!list) throw new Error(JSON.stringify(data));
        return list;
      })
      .catch(e => {
        global.failed = true;
        console.error('角色信息请求失败');
        console.error(String(e));
        return [];
      });
  }

  checkin({ region, game_uid: uid, region_name }) {
    return post(
      'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
      { act_id, region, uid },
      { headers: { ...this.headers, ds: ds() } },
    )
      .then(({ data }) => {
        console.log(maskUid(uid), region_name, data);
        if (![0, -5003].includes(data.retcode)) global.failed = true;
      })
      .catch(e => {
        global.failed = true;
        console.error(maskUid(uid), region_name, '签到请求失败');
        console.error(String(e));
      });
  }
};
