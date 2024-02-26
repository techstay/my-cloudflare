# my-cloudflare

我的 Cloudflare 工具集合。

## 开始使用

```sh
# 克隆项目
git clone https://github.com/techstay/my-cloudflare.git
# 安装依赖
pnpm install
# 添加 glados cookies
wrangler secret put GLADOS_K
wrangler secret put GLADOS_K_SIG
# telegram 推送
wrangler secret put TG_BOT_TOKEN
wrangler secret put TG_CHAT_ID
# pushplus 推送加
wrangler secret put PUSHPLUS_TOKEN
# 上传 worker
wrangler deploy
```
