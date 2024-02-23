export interface Env {
	TG_BOT_TOKEN: string,
	TG_CHAT_ID: string,
	GLADOS_K: string,
	GLADOS_K_SIG: string
}

export default {
	async scheduled (event, env, ctx) {
		console.log('cron processed')
	},
	async fetch (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		async function fetchHitokoto () {
			const response = await fetch('https://international.v1.hitokoto.cn')
			const { hitokoto: hitokotoText, from: hitokotoFrom } = await response.json() as { hitokoto: string, from: string }
			return `${hitokotoText}——${hitokotoFrom}`
		}

		async function pushTelegramBot (content: string) {
			const pushUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`
			const form = new FormData()
			form.append('chat_id', env.TG_CHAT_ID)
			form.append('text', `${content}\n`)
			await fetch(pushUrl, {
				method: 'POST',
				body: form
			})
		}

		async function checkinGlados () {
			const checkinUrl = 'https://glados.rocks/api/user/checkin'
			const checkinStatusUrl = 'https://glados.rocks/api/user/status'
			const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
			const payload = { 'token': 'glados.one' }
			const cookies: Record<string, string> = {
				'koa:sess': env.GLADOS_K,
				'koa:sess.sig': env.GLADOS_K_SIG
			}
			const headers = {
				'Origin': 'https://glados.rocks',
				'User-Agent': userAgent,
				'Content-Type': 'application/json;charset=UTF-8',
				Cookie: Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join(';')
			}

			const checkinResponse = await fetch(checkinUrl, {
				headers: headers,
				method: 'POST',
				body: JSON.stringify(payload),
			})
			const checkinResponseJson = await checkinResponse.json()
			// console.log(checkinResponseJson)

			const { code: checkinResultCode, message: checkinMessage } = checkinResponseJson as { code: string, message: string }

			if (checkinResultCode !== '1') {
				await pushTelegramBot(`GLADOS签到异常： ${checkinMessage}`)
			} else {
				await pushTelegramBot(`GLADOS签到成功： ${checkinMessage}`)

				const checkinStatusResponse = await fetch(checkinStatusUrl, {
					headers: headers
				})
				const { data: { email }, data: { leftDays } } = await checkinStatusResponse.json() as { data: { email: string, leftDays: string } }
				await pushTelegramBot(`账号${email}，剩余时长${Math.floor(parseFloat(leftDays))}天`)
				await pushTelegramBot(await fetchHitokoto())
			}
		}

		await checkinGlados()
		return new Response(await fetchHitokoto())
	}
} satisfies ExportedHandler
