---
title: CSharp无法引用DLL的BUG
date: 2017-06-28 20:17:46
categories:
- C#
tags:
- C#
---

## 关于无法加载DLL\"XXX.dll\":找不到指定的模块（异常来自HRESULT:0x8007007E）

<!-- more -->

### 真的是历经曲折，改过项目属性，放到一切可能的路径里，尝试过绝对路径也尝试过相对路径

然而，唉

### 再用depends（下载地址：http://www.dependencywalker.com/）打开dll

发现一大堆未引入的Dll

#### 这给了我很大的启发

好之后的事情我也羞于启齿了

这吊BUG居然耗了我两天的光阴
