# Bilibili 专栏文章关键内容提取与 PDF 生成工作流

## 概述

本工作流用于从 Bilibili 专栏文章中提取关键内容并生成高质量 PDF，去除了页面中的导航、侧边栏、标签页和底部区域等干扰元素，专注于文章正文内容。

## 准备工作

### 1. 安装 Chrome 浏览器

```bash
# 更新包列表
apt update

# 安装 Google Chrome 浏览器
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
apt update -qq && apt install -qq -y google-chrome-stable
```

### 2. 安装中文字体

```bash
apt update && apt install -y fonts-noto-cjk fonts-wqy-zenhei
```

### 3. 安装 Node.js 和 Puppeteer

```bash
# 确保 Node.js 已安装（本工作流使用 Node.js 22.x）

# 初始化项目并安装 Puppeteer
npm init -y && npm install puppeteer-core
```

## 工作流程

### 1. 创建优化的内容提取脚本

创建 `generate-optimized-pdf.js` 文件：

```javascript
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('正在启动浏览器...');
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    console.log('正在创建新页面...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const url = 'https://www.bilibili.com/opus/1181258307271131136';
    console.log(`正在访问页面: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('页面加载成功！正在移除指定元素...');
    
    // 移除指定的 DOM 元素
    const elementsToRemove = [
      'header', // 页面头部
      '.right-sidebar-wrap', // 右侧侧边栏
      '.bili-tabs', // 标签页区域
      '.opus-module-bottom' // 页面底部区域
    ];

    for (const selector of elementsToRemove) {
      await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (element) {
          console.log(`正在移除元素: ${sel}`);
          element.remove();
        } else {
          console.log(`元素未找到: ${sel}`);
        }
      }, selector);
    }

    console.log('元素移除完成！正在生成优化后的 PDF...');
    const outputPath = path.join(__dirname, 'bilibili_opus_optimized_1181258307271131136.pdf');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    console.log(`优化后的 PDF 已生成: ${outputPath}`);
    
    const title = await page.title();
    console.log(`页面标题: ${title}`);
    
    await browser.close();
    console.log('浏览器已关闭');
    
  } catch (error) {
    console.error('错误:', error);
    try {
      const { execSync } = require('child_process');
      console.log('尝试使用 wget 获取页面内容...');
      execSync('wget -O bilibili_optimized_page.html https://www.bilibili.com/opus/1181258307271131136 2>&1');
      console.log('页面内容已保存到 bilibili_optimized_page.html');
    } catch (wgetError) {
      console.error('wget 也失败了:', wgetError);
    }
  }
})();
```

### 2. 执行脚本生成 PDF

```bash
# 运行脚本生成优化后的 PDF
node generate-optimized-pdf.js
```

## 工作流程详细步骤

### 步骤 1：浏览器启动与页面访问

- 使用 Puppeteer 启动无头 Chrome 浏览器
- 配置浏览器视口大小为 1280x800
- 访问目标 Bilibili 专栏文章页面
- 等待页面加载完成（网络闲置状态）

### 步骤 2：DOM 元素移除

脚本会移除以下干扰元素：

1. **页面头部** (`header`) - 包含导航栏、搜索框和用户信息
2. **右侧侧边栏** (`.right-sidebar-wrap`) - 包含推荐内容、热门文章和作者信息
3. **标签页区域** (`.bili-tabs`) - 包含评论、目录、推荐等标签页
4. **页面底部** (`.opus-module-bottom`) - 包含文章发布信息、分享按钮和评论输入框

### 步骤 3：PDF 生成与优化

- 使用 Puppeteer 的 `page.pdf()` 方法生成 PDF
- 配置 A4 纸张尺寸
- 启用背景图像打印
- 设置合理的页面边距（1cm）
- 确保所有页面加载完成后再生成 PDF

## 生成的文件

- **优化后的 PDF**：`bilibili_opus_optimized_1181258307271131136.pdf`
- **原始 HTML 备份**：`bilibili_optimized_page.html`（仅在脚本失败时生成）

## 验证和质量检查

### 1. 检查 PDF 文件

```bash
ls -l bilibili_opus_optimized_1181258307271131136.pdf
```

### 2. 验证字体安装

```bash
fc-list :lang=zh
```

## 注意事项和最佳实践

### 1. 字体支持

- 确保已安装中文字体，否则可能会出现文字乱码或方框
- 建议安装 Noto CJK 和文泉驿正黑体

### 2. 浏览器兼容性

- 使用最新版本的 Chrome 浏览器以获得最佳性能和兼容性
- 避免使用过时的浏览器版本

### 3. 脚本优化

- 可根据需要调整 `elementsToRemove` 数组来添加或删除需要移除的元素
- 可调整视口大小和 PDF 配置参数以获得最佳效果

### 4. 错误处理

- 脚本包含基本的错误处理机制
- 如果 Puppeteer 方法失败，会尝试使用 wget 下载原始 HTML

### 5. 安全性

- 避免在脚本中硬编码敏感信息
- 定期更新依赖包以修复安全漏洞

## 扩展功能

### 批量处理

```javascript
// 可通过修改脚本来支持批量处理多个页面
const urls = [
  'https://www.bilibili.com/opus/1181258307271131136',
  'https://www.bilibili.com/opus/another-article-id'
];

for (const url of urls) {
  // 执行相同的处理流程
  await processArticle(url);
}
```

### 自定义页面选择器

```javascript
// 根据不同页面结构调整选择器
const elementsToRemove = [
  '.header-container',
  '.sidebar-content',
  '.article-tags',
  '.article-footer'
];
```

## 故障排除

### 1. Chrome 浏览器未找到

```bash
# 检查 Chrome 安装状态
which google-chrome-stable

# 重新安装 Chrome
apt remove -y google-chrome-stable && apt install -y google-chrome-stable
```

### 2. 字体未正确加载

```bash
# 检查字体文件是否存在
ls -l /usr/share/fonts/

# 重新生成字体缓存
fc-cache -fv
```

### 3. PDF 生成失败

```bash
# 检查浏览器启动是否成功
ps aux | grep chrome

# 检查脚本运行时的错误信息
node generate-optimized-pdf.js 2>&1
```

---

## 总结

本工作流提供了一个可靠的方法来从 Bilibili 专栏文章中提取关键内容并生成高质量的 PDF。通过去除页面中的干扰元素，用户可以获得专注于文章正文的干净文档，适合阅读和存档。

该工作流支持脚本化操作，便于自动化和批量处理，同时提供了详细的错误处理和故障排除指南。
