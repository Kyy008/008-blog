
export interface Device {
	name: string;
	image: string;
	specs: string;
	link: string;
}

export const devicesData: Device[] = [
	{
		name: "iPhone 14 Plus",
		image: "/images/device/iphone.png",
		specs: "256GB",
		link: "https://www.apple.com/iphone",
	},
	{
		name: "MacBook Pro",
		image: "/images/device/mac.png",
		specs: "14-inch / Apple M4 Pro / 24GB / 1TB SSD",
		link: "https://www.apple.com/macbook-pro/",
	},
	{
		name: "iPad Pro",
		image: "/images/device/ipad.png",
		specs: "11-inch / 512GB",
		link: "https://www.apple.com/ipad-pro/",
	},
	{
		name: "华为手环 10",
		image: "/images/device/shouhuan.png",
		specs: "NFC",
		link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086010507510&sbomCode=2901020055202",
	},
	{
		name: "AirPods Pro 2",
		image: "/images/device/app.png",
		specs: "",
		link: "https://www.apple.com.cn/airpods/",
	},
];
