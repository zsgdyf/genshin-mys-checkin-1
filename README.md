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

- 支持多帐号
- 有一点使用门槛，请活用 google

### 准备

1. **微博手机客户端 API 链接 (1)**  
   使用 whistle 之类的抓包工具，微博手机客户端进入原神超话得到，安卓/iOS均可  
   ※ 该链接开头为 `https://api.weibo.cn/2/page`，其实也不一定要这个开头的链接，只要链接带有 `gsid` `from` `c` `s` 四个参数即可
2. **手机网页版微博的 cookie (2)**  
   有两种方式可以获得：
   1. https://m.weibo.cn
   2. 使用抓包工具，在微博手机客户端内访问某些页面，例如领取原神超话签到礼包的页面
3. **一个 webhook (3)**（可选）  
   当有礼包领取成功时，会将兑换码发至该 webhook，目前仅使用 GET 方式调用，可用以下占位符：
   - `{{id}}` - 礼包ID
   - `{{name}}` - 礼包名
   - `{{code}}` - 兑换码
   - `{{index}}` - 账户序号，从 0 开始

   ※ 你可以使用 [Server酱](http://sc.ftqq.com/3.version) 或 [IFTTT](https://ifttt.com/) 之类的工具推送至微信或 Telegram 等
4. 将你现在还没领过的礼包先领了，因为每天只能领一个，没领会拖慢进度

### Secrets

#### `WB_CONFIG`

将我们上面准备好的东西组成下面这样 JSON 形式的数组，如果要多账号的话你应该懂怎么做

```json
[
  {
    "url": "(1)",
    "cookie": "(2)",
    "webhook": "(3)"
  }
]
```

然后对这个 JSON 进行 base64 编码就行了
