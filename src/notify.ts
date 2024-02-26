import { Env } from './env';

const notify = async (env: Env, content: string) => {
	//telegram
	const telegramNotify = async () => {
		if (!(env.TG_BOT_TOKEN && env.TG_CHAT_ID)) {
			if (env.TG_BOT_TOKEN || env.TG_CHAT_ID) {
				console.log('TG_BOT_TOKEN或TG_CHAT_ID未配置');
			}
			return false;
		}
		const pushUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
		const form = new FormData();
		form.append('chat_id', env.TG_CHAT_ID);
		form.append('text', `${content}\n`);
		const response = await fetch(pushUrl, {
			method: 'POST',
			body: form,
		});
		return response.status === 200;
	};

	// pushplus
	const pushplusNotify = async () => {
		if (!env.PUSHPLUS_TOKEN) {
			return false;
		}
		const pushUrl = 'http://www.pushplus.plus/send';
		const body = {
			token: env.PUSHPLUS_TOKEN,
			content: content,
		};
		const response = await fetch(pushUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		return response.status === 200;
	};

	try {
		const results = await Promise.allSettled([telegramNotify(), pushplusNotify()]);
		const tasks = ['telegram', 'pushplus'];

		results.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				console.log(`Notify ${tasks[index]} OK:`, result);
			} else {
				console.error(`Notify ${tasks[index]} Failed:`, result);
			}
		});
	} catch (error) {
		console.error('Error during notification:', error);
	}
};

export default notify;
