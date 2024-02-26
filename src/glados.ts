import { hitokoto } from './toolkit';
import notify from './notify';
import { Env } from './env';

export const checkinGlados = async (env: Env) => {
	if (!env.GLADOS_K || !env.GLADOS_K_SIG) {
		return false;
	}
	const checkinUrl = 'https://glados.rocks/api/user/checkin';
	const checkinStatusUrl = 'https://glados.rocks/api/user/status';
	const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
	const payload = { token: 'glados.one' };
	const cookies = {
		'koa:sess': env.GLADOS_K,
		'koa:sess.sig': env.GLADOS_K_SIG,
	};
	const headers = {
		Origin: 'https://glados.rocks',
		'User-Agent': userAgent,
		'Content-Type': 'application/json;charset=UTF-8',
		Cookie: Object.entries(cookies)
			.map(([key, value]) => `${key}=${value}`)
			.join(';'),
	};
	// 签到
	const checkinResponse = await fetch(checkinUrl, {
		headers: headers,
		method: 'POST',
		body: JSON.stringify(payload),
	});
	const checkinResponseJson = await checkinResponse.json();
	console.log(checkinResponseJson);
	const { code: checkinResultCode, message: checkinMessage } = checkinResponseJson as { code: number; message: string };

	// 获取签到信息
	if (checkinResultCode === 0 || checkinResultCode === 1) {
		const checkinStatusResponse = await fetch(checkinStatusUrl, {
			headers: headers,
		});

		const {
			data: { email },
			data: { leftDays },
		} = (await checkinStatusResponse.json()) as { data: { email: string; leftDays: string } };
		const pushMessage = `GLADOS签到成功： ${checkinMessage}
账号${email}，剩余时长${Math.floor(parseFloat(leftDays))}天
${await hitokoto()}`;

		await notify(env, pushMessage);
	} else {
		await notify(env, `GLADOS签到异常：  resultCode:${checkinResultCode}, message: ${checkinMessage}`);
	}
	return true;
};
