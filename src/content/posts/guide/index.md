---
title: Mizuki 使用指南
published: 2026-01-23
description: "本博客模版的综合使用指南。"
image: "./cover.webp"
tags: ["Guide"]
category: Guide
draft: true
---

本博客模版基于 [Astro](https://astro.build/) 构建。如果在本文中找不到答案，你可以在 [Astro Docs](https://docs.astro.build/) 中查找相关信息。

## 文章的 Front-matter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| 属性 | 描述 |
|---|---|
| `title` | 文章的标题。 |
| `published` | 文章发布的日期。 |
| `pinned` | 是否将文章置顶到列表顶部。 |
| `priority` | 置顶文章的优先级。数值越小优先级越高 (0, 1, 2...)。 |
| `description` | 文章的简短描述。显示在首页。 |
| `image` | 文章的封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：使用 `public` 目录下的图片<br/>3. 无前缀：相对于 markdown 文件的路径 |
| `tags` | 文章的标签。 |
| `category` | 文章的分类。 |
| `licenseName` | 文章内容的许可证名称。 |
| `author` | 文章的作者。 |
| `sourceLink` | 文章内容的来源链接或参考。 |
| `draft` | 如果为 true，则文章为草稿，不会显示。 |

## 文章文件放置位置

你的文章文件应该放在 `src/content/posts/` 目录下。你也可以创建子目录来更好地组织文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```

## 草稿管理

本文目前处于草稿状态，尚未发布。因此，它对普通读者不可见。内容仍在编写中，可能需要进一步编辑和审核。

当文章准备好发布时，你可以在 Front-matter 中将 "draft" 字段更新为 "false"：

```markdown
---
title: Draft Example
published: 2024-01-11T04:40:26.381Z
tags: [Markdown, Blogging, Demo]
category: Examples
draft: false
---
```

## 文章别名

### 文章别名 (Alias)

你可以通过在 front-matter 中添加 `alias` 字段为任何文章设置别名：

```yaml
---
title: My Special Article
published: 2024-01-15
alias: "my-special-article"
tags: ["Example"]
category: "Technology"
---
```

设置别名 (Alias) 后：
- 文章可以通过自定义 URL 访问（例如 `/posts/my-special-article/`）
- 默认的 `/posts/{slug}/` URL 仍然有效
- RSS/Atom 订阅源将使用自定义别名
- 所有内部链接将自动使用自定义别名

**重要提示：**
- Alias 不应包含 `/posts/` 前缀（会自动添加）
- 避免在 Alias 中使用特殊字符和空格
- 为了最佳的 SEO 实践，请使用小写字母和连字符
- 确保所有文章的 Alias 是唯一的
- 不要包含前导或尾随斜杠

## Markdown 扩展功能

### GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片，页面加载时会从 GitHub API 拉取仓库信息。

::github{repo="matsuzaka-yuki/Mizuki"}

使用代码 `::github{repo="matsuzaka-yuki/Mizuki"}` 创建一个 GitHub 仓库卡片。

```markdown
::github{repo="matsuzaka-yuki/Mizuki"}
```

### 提示块 (Admonitions)

支持以下类型的提示块：`note` `tip` `important` `warning` `caution`

:::note
高亮用户应该注意的信息，即使是浏览时。
:::

:::tip
帮助用户更成功的可选信息。
:::

:::important
用户成功所必需的关键信息。
:::

:::warning
由于潜在风险，需要用户立即注意的关键内容。
:::

:::caution
操作的潜在负面后果。
:::

#### 基础语法

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

#### 自定义标题

提示块的标题可以自定义。

:::note[MY CUSTOM TITLE]
这是一个带有自定义标题的笔记。
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

#### GitHub 语法

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) 也同样支持。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### 剧透 (Spoiler)

你可以向文本添加剧透隐藏效果。文本也支持 **Markdown** 语法。

内容 :spoiler[被隐藏了 **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!
```

## 视频嵌入

只需从 YouTube 或其他平台复制嵌入代码，并将其粘贴到 markdown 文件中。

```yaml
---
title: Include Video in the Post
published: 2023-10-19
// ...
---

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
```

### YouTube

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Bilibili

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" &autoplay=0> </iframe>
