import { Env } from './env';
import { checkinGlados } from './glados';
import { hitokoto } from './toolkit';

export default {
	async scheduled (event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		await Promise.all([checkinGlados(env)]);
	},

	async fetch (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response(await hitokoto());
	},
};
