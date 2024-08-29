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

	// wxpusher
	const wxpusherNotify = async () => {
		if (!env.WXPUSHER_TOKEN || !env.WXPUSHER_TOPICS) {
			return false;
		}
		const pushUrl = 'http://wxpusher.zjiecode.com/api/send/message';
		const topicIds = env.WXPUSHER_TOPICS.split(',').map((id) => parseInt(id, 10));
		const body = {
			appToken: env.WXPUSHER_TOKEN,
			content: content,
			contentType: 1,
			topicIds: topicIds,
		};
		const response = await fetch(pushUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		response.json().then((data) => {
			return (data as { code: number }).code === 1000;
		});
	};

	try {
		const results = await Promise.allSettled([telegramNotify(), pushplusNotify(), wxpusherNotify()]);
		const tasks = ['telegram', 'pushplus', 'wxpusher'];

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
