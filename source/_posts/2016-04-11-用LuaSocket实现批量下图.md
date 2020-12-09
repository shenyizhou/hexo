---
title: 用LuaSocket实现批量下图
date: 2016-04-11 09:14:17
categories:
- Lua
tags:
- Lua
- LuaSocket
---

# 步骤一 创建目录

```
local start_time = os.time() --获取当前时间作为目录名
local dir = "D:\\Picture\\Spider\\" .. start_time .. "\\" --windows结构目录名
if (os.execute("mkdir "..dir) == 0) then print(">> 创建目录成功：" .. dir) --创建目录
else print(">> 创建目录失败：" .. dir) return -1 end --失败返回
```
<!-- more -->

# 步骤二 开始下图

```
local http = require("socket.http")
local http_dir = "http://XXXXXXXXXXXXXXXXXX" --http目录 （这里网址不方便透露XD
local comic_num = 151226 --第一本漫画编号(很神奇，漫画存放的顺序就是按照日期，一天一本)
local pic_num = 1 --第一张图片编号
local n = 0 --下载图片数
for comic_num = 151226, 151201, -1 do
	os.execute("mkdir "..dir .. "\\" .. comic_num .. "\\") --创建漫画目录
	for pic_num =1, 30 do
		data, ret = http.request(http_dir .. comic_num .. "/" .. pic_num .. ".jpg") --获取图片
		if(data ~= nil) then
			print(">> 下载图片中：" .. http_dir .. comic_num .. "/" .. pic_num .. ".jpg")
			local if_download = io.open(dir .. "/" .. comic_num .. "/" .. pic_num .. ".jpg", "wb"):write(data) --把图片写入文件
			if (if_download == true) then
				print(">> 下载成功")
				n = n + 1
			else print(">> 下载失败")
			end
		else print(">> 获取图片失败，原因：" .. ret)
		end
	end
end
```


# 步骤三 统计数据

```
print(">> 完成于：" .. os.date()
    .. "\n>> 耗时：" .. os.time() - start_time .. "秒"
    .. "\n>> 下载图片数量：" .. n
    .. "\n>> 保存目录：" .. dir)
```
