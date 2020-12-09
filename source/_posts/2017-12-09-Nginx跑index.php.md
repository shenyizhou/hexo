---
title: Nginx跑index.php
date: 2017-12-09 14:32:54
categories:
- Nginx
tags:
- Nginx
- PHP
---

### 一切起源是想在本地服务器搭个showdoc

<!-- more -->

#### 遇到的第一个问题就是：*配置好端口和server_name怎么还是404？？？*

先说说`nginx`的url匹配规则，先找对应端口下（不输入默认为80）有没有`server_name`匹配的，没有就用该端口下第一个server配置，如果对应端口下一个配置都没就404

然后本地服务器想配域名好像有点麻烦，改`etc/hosts`只针对本机访问，所以只好用端口号区分，比如说我们用的82端口

#### 但是第二个问题又来了：*访问倒霉的index.php会直接下载一个文件！！！*

于是各种问百老师：nginx本身并没有解析php的能力，需要依赖`php-fpm`或`hhvm`提供`FastCGI`（和`CGI`也就是一个进程和多个进程的区别）来解析php

#### 但是第三个问题又来了：*虽然好像解析了但是怎么变成502了。。。*

于是乎是因为没有加location配置，所以最后当当当：

``` conf
server {
  listen	82; # 必填，监听端口
  root	/home/work/showdoc; # 必填，对应的linux文件夹路径
  index	index.php; # 必填，默认主页
  location ~ \.php$ {
    fastcgi_pass   127.0.0.1:9000; # 必填
    fastcgi_index  index.php; # 可删
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name; # 可删
    include        fastcgi_params; # 必填
  }
}
```

*（喂猫fastcgi_param是可以删除的啊。。难道不会影响底下的include吗。。。哦这居然差了个s）*
