# genshin-mys-checkin

- 每天早上 7:00 ~ 7:10 随机时间签到
- 部分失败不会使整体流程终止，并且你会收到一封来自 GitHub 的 Actions 失败提醒邮件
- 运行前会自动同步本仓库，并使用本仓库文件解决冲突，如有自定义需求请自行修改 workflows

## 米游社

- 支持多帐号及多角色
- 如果角色信息请求失败，提示登陆失效，请退出米游社再重新登录，然后更新 cookie

### Secrets

#### `COOKIE`  

米游社网页版 cookie，如需多帐号签到，以 `#` 隔开

### 参考

- [y1ndan/genshin-impact-helper](https://github.com/y1ndan/genshin-impact-helper)
- [yinghualuowu/GenshinDailyHelper](https://github.com/yinghualuowu/GenshinDailyHelper)

## 微博超话（试作型）

- 自动签到、领取礼包，并可以通过 webhook 发送兑换码，支持多帐号
- 配置较为繁琐，有一定使用门槛（懂的都懂，不懂的我也没办法）
- 可能无法通过 GitHub Actions 使用

### 准备

你需要构造这样一个 JSON，如果要多账号的话你应该懂怎么做

```json
[
  {
    "url": "",
    "cookie": "",
    "webhook": "",
    "proxy": "",
    "outputScheme": false
  }
]
```

#### `url`

使用 whistle 之类的抓包工具，微博手机客户端进入原神超话得到 API 链接，安卓/iOS均可

※ 该链接开头为 `https://api.weibo.cn/2/page`，其实也不一定要这个开头的链接，只要链接带有 `gsid` `from` `c` `s` 四个参数即可

#### `cookie`

有两种方式可以获得：

1. https://m.weibo.cn
2. 使用抓包工具，在微博手机客户端内访问某些页面，例如领取原神超话签到礼包的页面

#### `webhook`（可选）

当有礼包领取成功时，会将兑换码发至该 webhook，目前仅使用 GET 方式调用，可用以下占位符：

- `{{id}}` - 礼包ID
- `{{name}}` - 礼包名
- `{{code}}` - 兑换码
- `{{index}}` - 账户序号，从 0 开始

※ 你可以使用 [Server酱](http://sc.ftqq.com/3.version) 或 [IFTTT](https://ifttt.com/) 之类的工具推送至微信或 Telegram 等

#### `proxy`（可选）

签到使用的代理，支持 http / https / socks

#### `outputScheme`（可选，默认 `false`）

行为存在异常时是否输出验证链接，通过 GitHub Actions 使用时建议 `false`，防止信息泄露

### 使用

因为异地签到会出现“行为存在异常”问题，因此只建议两种使用方式：

1. 在常用地使用，如何自动化请自行解决
2. 搞一个常用地的代理，配置 `proxy`，这样可能可以在 GitHub Actions 中成功签到，你可以在本地配好先试试

#### 在本地使用

将上面构造好的 JSON 文件命名为 `wbconfig.json`，置于项目根目录，然后 `npm start`

#### 在 GitHub Actions 上使用

将上面构造好的 JSON 进行 base64 编码，设置为 `WB_CONFIG` secrets
