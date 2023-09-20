# Twitter Likes to Telegram

## 感谢
本项目 Fork 自 [https://github.com/NeverBehave/Tweet2Telegram](https://github.com/NeverBehave/Tweet2Telegram)

---

## 当前项目状态

~~虽然目前说API已经开始收费并停止工作，但是实测目前APIv1还是可以使用。如果后续出现问题将会把Repo置入Archive状态。~~

APIv1 也无法使用，所以采用了模拟用户请求的方式

介于现在推特API变化巨大，本项目后续进入维护状态，不再开发新功能。

感谢使用！

---

[![Twitter fetch likes to Telegram](https://github.com/NeverBehave/Tweet2Telegram/actions/workflows/fetchLikes.yml/badge.svg?branch=main)](https://github.com/NeverBehave/Tweet2Telegram/actions/workflows/fetchLikes.yml)

如果你在使用, 记得点击右上角 Watch, 获取后续功能更新

[English Readme](./README.en.md)

## What 

获取点赞推文内容, 发送到指定 Telegram 群/频道/私聊

- 基于 Github Action 和 Gists, 无需外置服务器
- 支持获取图片, 视频, GIF

## Why

类似与收藏, 希望所有的点赞内容可以**完整的**转发到一个频道(不只是链接)

Telegram 的导出功能也比 Twitter 舒服

## How

使用方式:

1. Fork
2. `.env.example` 所有变量, 填写进项目 `settings -> secrets`

### Prerequisite

~~- `Twitter API KEY` 和 `ACCESS TOKEN`
    - 申请并创建一个 APP https://developer.twitter.com/en/portal/dashboard~~

- 抓取访问 twitter 访问头中的信息填如以下变量
```
TWITTER_AUTHORIZATION=
TWITTER_X_CSRF_TOKEN=
TWITTER_COOKIE=
```

- 创建一个内容为 `{}` 的 `gist`: 
    - https://gist.github.com
    - 文件名默认为 `data.json`
    - 比如`https://gist.github.com/NeverBehave/606d7e14436187b4d45e8657fafd40ab`中
        - `606d7e14436187b4d45e8657fafd40ab` 就是 `GIST_ID`
- 申请一个 Telegram Bot 并加入你想要发送的群/频道
    - [@Botfather](https://t.me/botfather)
    - 获取频道ID, 转发一条频道消息到 [@JSONDumpBot](https://t.me/JSONDumpBot)
    - `CHANNELBOT`变量对应的是 `BOT_TOKEN`
- `GIST_TOKEN` 为 [GitHub token](https://github.com/settings/tokens)
    - 需要把相应(gist read/write)的选项勾上

## Adjustment

### Trigger

- Push 
- 每 15 分钟运行一次, 每次获取 100 条
    - 真的真的不会有人一口气搞那么多吧
    - 不够用就加快频率吧
- repository_dispatch: `type: fetchLikes`
- workflow_dispatch: 手动触发或使用 [RESTFUL API](https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event) 触发
    - 可以配合 iOS 捷径在推特客户端开启/关闭时调用，节约资源

## Demo

https://t.me/joinchat/T3XZK0WWXrIJ-_BG
