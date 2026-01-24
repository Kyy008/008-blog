# Twikoo 评论系统私有化部署全流程指南

本文档将指导你以“自下而上”的顺序（服务端部署 -> HTTPS 配置 -> 前端集成），在自己的 Ubuntu 服务器上部署 Twikoo 评论系统，并集成到当前的静态博客中。

---

## 前置准备

*   一台拥有公网 IP 的 Ubuntu 服务器。
*   一个解析到该服务器 IP 的域名（例如 `comment.yourdomain.com`）。
*   基本的 Linux 命令行操作能力。

---

## 第一步：Docker 部署 Twikoo 后端

我们将使用 Docker 和 Docker Compose 来运行 Twikoo 服务端。这种方式便于管理和升级，且数据易于备份。

### 1.1 安装 Docker 和 Docker Compose

如果你还没有安装 Docker，请先执行以下命令：

```bash
# 更新软件源
sudo apt update

# 安装 Docker
sudo apt install docker.io -y

# 安装 Docker Compose (如果你使用较新版本的 docker，可能已经内置了 docker compose 命令，可以跳过此步或检查版本)
sudo apt install docker-compose -y

# 启动 Docker 并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker
```

### 1.2 创建部署目录

在服务器上创建一个目录用于存放 Twikoo 的配置和数据：

```bash
mkdir -p ~/twikoo
cd ~/twikoo
```

### 1.3 编写 docker-compose.yml

创建并编辑 `docker-compose.yml` 文件：

```bash
nano docker-compose.yml
```

写入以下内容：

```yaml
version: '3'
services:
  twikoo:
    image: imaegoo/twikoo
    container_name: twikoo
    restart: always
    ports:
      - 8080:8080
    environment:
      - TWIKOO_THROTTLE=1000 # 请求限流配置（可选）
    volumes:
      - ./data:/app/data
```

*   **端口映射**：`8080:8080` 表示将容器内的 8080 端口映射到宿主机的 8080 端口。
*   **数据卷**：`./data:/app/data` 表示将评论数据保存在当前目录下的 `data` 文件夹中，**请务必做好该目录的备份**。

### 1.4 启动服务

```bash
sudo docker-compose up -d
```

启动后，Twikoo 应该已经在服务器的 `8080` 端口运行了。你可以通过 `curl localhost:8080` 测试是否连通。

---

## 第二步：配置 Nginx 反向代理与 HTTPS (Certbot)

为了安全（避免评论数据被窃听）以及满足现代浏览器对 Mixed Content 的限制（HTTPS 网站必须加载 HTTPS 资源），我们需要为 Twikoo 配置 HTTPS。

### 2.1 安装 Nginx

```bash
sudo apt install nginx -y
```

### 2.2 配置 Nginx 反向代理

创建一个新的 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/twikoo
```

写入以下内容（请将 `comment.yourdomain.com` 替换为你的实际域名）：

```nginx
server {
    listen 80;
    server_name comment.yourdomain.com; # 替换为你的域名

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
        
        # WebSocket 支持 (Twikoo 的某些功能可能需要)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用该配置：

```bash
sudo ln -s /etc/nginx/sites-available/twikoo /etc/nginx/sites-enabled/
sudo nginx -t # 测试配置是否有语法错误
sudo systemctl reload nginx
```

此时，你应该可以通过 `http://comment.yourdomain.com` 访问到 Twikoo 服务了（虽然现在还是 HTTP）。

### 2.3 使用 Certbot 申请 SSL 证书

安装 Certbot 及其 Nginx 插件：

```bash
sudo apt install certbot python3-certbot-nginx -y
```

运行 Certbot 自动配置 SSL：

```bash
sudo certbot --nginx -d comment.yourdomain.com
```

*   Certbot 会询问你是否强制重定向 HTTP 到 HTTPS，建议选择 **2 (Redirect)**。
*   Certbot 会自动修改你的 Nginx 配置文件，添加 SSL 相关的配置。

完成后，你的 Twikoo 后端地址即为：`https://comment.yourdomain.com`。

---

## 第三步：前端集成 (本项目配置)

现在后端已经就绪，我们需要在博客项目中启用 Twikoo。

### 3.1 修改配置文件

打开项目中的 `src/config.ts` 文件。

### 3.2 修改 `commentConfig`

找到 `commentConfig` 部分，将其修改为如下内容：

```typescript
// src/config.ts

export const commentConfig: CommentConfig = {
	enable: true, // 1. 将 false 改为 true，启用评论功能
	twikoo: {
		// 2. 填入你在第二步中配置好的 HTTPS 地址
		// 注意：不要带最后的斜杠 '/'
		envId: "https://comment.yourdomain.com", 
		lang: SITE_LANG,
	},
};
```

### 3.3 本地预览验证

在本地启动博客项目：

```bash
pnpm dev
```

打开任意一篇文章，滚动到底部，你应该能看到评论框加载出来了。

---

## 第四步：初始化与管理

### 4.1 设置管理员密码

第一次访问评论区时，点击评论框右下角的**“小齿轮”图标**。系统会提示你设置一个**管理密码**。请务必牢记。

### 4.2 配置管理面板

设置完密码后，再次点击小齿轮并输入密码，即可进入 Twikoo 管理面板。在这里你可以：
*   **版本管理**：查看版本信息。
*   **评论管理**：审核、删除、回复评论。
*   **配置管理**：
    *   **邮件通知**：强烈建议配置 SMTP 服务（如 QQ 邮箱、Gmail），这样有人评论时你会立刻收到邮件。
    *   **反垃圾**：配置 Akismet 等反垃圾服务。
    *   **显示设置**：自定义评论框的提示文字、表情包等。

### 4.3 导入数据 (可选)

如果你以前使用过 Valine 或 Artalk 等其他评论系统，可以在管理面板中找到“导入”功能进行迁移。

---

## 故障排查

*   **评论框一直 loading**：
    *   检查浏览器控制台 (F12 -> Console) 是否有报错。
    *   如果是 `Mixed Content` 错误，说明你的博客是 HTTPS，但 Twikoo `envId` 填的是 HTTP。请确保后端已配置 SSL。
    *   如果是 `404 Not Found`，检查 `envId` 域名是否正确解析。
    *   如果是 `502 Bad Gateway`，检查服务器上的 Docker 容器是否正在运行 (`sudo docker ps`)。
*   **无法保存配置**：
    *   检查服务器上 `docker-compose.yml` 中挂载的 `./data` 目录是否有写入权限。

---

祝你的博客评论区热闹非凡！
