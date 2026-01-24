// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "FYTJ",
		imgurl: "/assets/friend-avatar/zyb.webp",
		desc: "相识超过 3000 天的同伴。现于中国科学院大学就读计算机专业，致力于芯片开发",
		siteurl: "https://github.com/FYTJ",
	},
	{
		id: 2,
		title: "HFDLYS",
		imgurl: "/assets/friend-avatar/hfdlys.webp",
		desc: "软件学院的同班同学。具备相当优秀的工程编程与学习能力，但也常常表现出神秘的一面",
		siteurl: "https://github.com/HFDLYS",
	},
	{
		id: 3,
		title: "上条当咩",
		imgurl: "/assets/friend-avatar/kmj.webp",
		desc: "计算机专业享受者。乐于分享知识与见闻，诠释着 CS 学生应有的姿态",
		siteurl: "https://love.nimisora.icu",
	},
	{
		id: 4,
		title: "Hewkick",
		imgurl: "/assets/friend-avatar/hewkick.webp",
		desc: "同校的 AI 专业好友。具备绩点与科研能力的同时，也是音乐、音游爱好者",
		siteurl: "https://github.com/hewkick",
	},
	{
		id: 5,
		title: "FinnClair-Su",
		imgurl: "/assets/friend-avatar/sxx.webp",
		desc: "同校的直博同学，致力于网安与 LLM 研究。不折不扣的数码爱好者与东方 Project 厨",
		siteurl: "https://github.com/FinnClair-Su",
	},
	
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
