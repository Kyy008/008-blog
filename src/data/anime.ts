// 本地番剧数据配置
export type AnimeItem = {
	title: string;
	cover: string;
	description: string;
	year: string;
	link: string;
};

const localAnimeList: AnimeItem[] = [
	{	
		title: "魔法少女小圆",
		cover: "/assets/anime/xiaoyuan.webp",
		description: "个人剧情向 TOP1 作品（配合《叛逆的物语》食用），圆神😭",
		year: "2011",
		link: "https://www.bilibili.com/bangumi/media/md2539",
	},
	{
		title: "少女终末旅行",
		cover: "/assets/anime/zhongmo.webp",
		description: "",
		year: "2017",
		link: "https://www.bilibili.com/bangumi/media/md6463",
	},
	{
		title: "进击的巨人",
		cover: "/assets/anime/juren.webp",
		description: "",
		year: "2013",
		link: "https://www.dmla4.com/video/3702.html",
	},
	{
		title: "请问您今天要来点兔子吗？",
		cover: "/assets/anime/diantu.webp",
		description: "Kyy008的单推角色【香风智乃】的出处作品☺️",
		year: "2014",
		link: "https://www.bilibili.com/bangumi/media/md2762",
	},
	{
		title: "Re：从零开始的异世界生活",
		cover: "/assets/anime/re0.webp",
		description: "",
		year: "2020",
		link: "https://www.bilibili.com/bangumi/media/md28224394",
	},
	{
		title: "百变小樱",
		cover: "/assets/anime/ying.webp",
		description: "",
		year: "1998",
		link: "https://www.bilibili.com/bangumi/media/md3756",
	},
	{
		title: "某科学的超电磁炮",
		cover: "/assets/anime/pao.webp",
		description: "Kyy008的二次元入坑作",
		year: "2009",
		link: "https://www.bilibili.com/bangumi/media/md425",
	},
	{
		title: "学园孤岛",
		cover: "/assets/anime/zombie.webp",
		description: "让 Kyy008 深刻体会到陪伴和精神支柱是身处绝境的拯救与治愈。可惜剧情不是很刀（bushi",
		year: "2015",
		link: "https://www.bilibili.com/bangumi/media/md2592",
	}

];

export default localAnimeList;
