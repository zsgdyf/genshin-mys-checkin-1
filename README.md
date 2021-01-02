# genshin-mys-checkin

- 每天早上 7:00 ~ 7:10 随机时间签到
- 签到失败不会使整体流程终止，并且你会收到一封来自 GitHub 的 Actions 失败提醒邮件
- 运行前会自动同步本仓库，并使用本仓库文件解决冲突，如有自定义需求请自行修改 workflows

## 米游社

- 支持多帐号及多角色
- 如果角色信息请求失败，提示登陆失效，请退出米游社再重新登录，然后更新 cookie

### Secrets

- `COOKIE`  
  米游社网页版 cookie，如需多帐号签到，以 `#` 隔开

### 参考

- [y1ndan/genshin-impact-helper](https://github.com/y1ndan/genshin-impact-helper)
- [yinghualuowu/GenshinDailyHelper](https://github.com/yinghualuowu/GenshinDailyHelper)

## 微博超话

开发中
