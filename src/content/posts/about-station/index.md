---
title: 关于本站
published: 2026-01-24
description: 本站起源，一切从这里开始。
image: ./cover.webp
tags: [本站, 杂谈]
category: 杂谈
draft: false
---

在一切开始之前，不妨说说这个站点本身。

# 技术栈

## 模板

基于现代化的静态网站生成器 [Astro](https://astro.build/) 构建，使用了 [Tailwind CSS](https://tailwindcss.com/) 进行样式设计。

相较于 WordPress 等传统动态 CMS，Astro 更加轻量化。它生成的静态页面拥有极快的加载速度和优秀的性能表现，同时也大大降低了服务器的维护成本。

使用了开源主题 **Mizuki** ，这是一个功能丰富的二次元主题 Astro 博客模版。

::github{repo="matsuzaka-yuki/Mizuki"}

本站的源码仓库，本站由该仓库配置的 CI/CD 流程自动化部署而来：

::github{repo="Kyy008/008-blog"}


## 看板娘模型

本站左下角的香风智乃（仅适配电脑端），使用的是来源于 Bilibili 的开源 Live 2D 模型。感谢原作者的制作与分享:spoiler[，仅需在会员购支付0.01元就可以获得这个模型（]

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV14h4y1s7dz&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## Live2D 技术

我们需要一个应用于浏览器环境的 Live2D 组件依赖技术。由于原 Mizuki 模板自带的 [Pio](https://github.com/Dreamer-Paul/Pio) 看板娘插件仅支持 Cubism 2 模型，而本站使用的香风智乃模型基于 Cubism 3 制作，导致原插件不兼容。因此，本站改用了可以同时兼容 Cubism 2 至 Cubism 5 的 `oh-my-live2d` 库进行替代。

模型仓库参考：

::github{repo="oh-my-live2d/oh-my-live2d"}
