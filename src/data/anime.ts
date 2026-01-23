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
		description: "可爱的画风下，叙述着黑暗的故事。拥有别具一格的艺术表达、充满哲思的蕴藏内涵",
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
		description: "剧情、热血向，自由与桎梏的对抗",
		year: "2013",
		link: "https://www.dmla4.com/video/3702.html",
	},
	{
		title: "请问您今天要来点兔子吗？",
		cover: "/assets/anime/diantu.webp",
		description: "Kyy008的单推角色【香风智乃】的出处作品。仅凭萌系与日常的剧情足以治愈心灵",
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
		description: "观看于2018年，是Kyy008的二次元入坑作，bilibili的站名起源",
		year: "2009",
		link: "https://www.bilibili.com/bangumi/media/md425",
	}
];

export default localAnimeList;
