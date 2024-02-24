# my-cloudflare

我的 Cloudflare 工具集合。

```sh
# 克隆项目
git clone https://github.com/techstay/my-cloudflare.git
# 安装依赖
pnpm update
```

## workers

目前只有一个 glados 签到 worker。

首先添加以下 secret。

```sh
wrangler secret put TG_BOT_TOKEN
wrangler secret put TG_CHAT_ID
# glados cookies
wrangler secret put GLADOS_K
wrangler secret put GLADOS_K_SIG
```

然后上传 worker，北京时间每天上午 9 点就可以自动签到了。

```sh
wrangler deploy
```
