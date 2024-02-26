export const hitokoto = async () => {
	const response = await fetch('https://international.v1.hitokoto.cn');
	const { hitokoto: hitokotoText, from: hitokotoFrom } = (await response.json()) as { hitokoto: string; from: string };
	return `${hitokotoText}——${hitokotoFrom}`;
};
