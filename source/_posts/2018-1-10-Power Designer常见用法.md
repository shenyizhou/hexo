---
title: Power Designer常见用法
date: 2018-1-9 21:20:32
categories:
- Database
tags:
- Power Designer
---

### 同时显示Name和Code

`Tools -> Display Preferences -> Table -> Advanced -> Columns -> List Columns (Select)`勾选`Code`并置顶，再右键表`Format -> Content -> Stereotype`选择`Owner and Name`

<!-- more -->

### 建立外键
`Toolbox`中选择`Reference`连接两张表，编辑其中一张表，`Dependencies -> Properties -> Joins`选择需要设置成外键的字段

### 建立索引

编辑表，`Indexes -> Properties -> Columns -> Add Columns`勾选需要设为索引的字段

### 设置自增项

编辑表，`Columns`中勾选对应字段的`Identity`，再在`Physical Options`中添加`auto_incement = 1`

### 设置默认值

编辑表，`Columns`中选对应字段，`Properties -> Standard Checks -> Default`设置成需要的值

### 设置创建时间和修改时间

创建时间默认值设置为`CURRENT_TIMESTAMP`

修改时间默认值设置为`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

*mysql timestamp不能为null，datetime可以为null，另外mysql中常用数据类型有：varchar(255)、double、int(11)、tinyint(1)、datetime、timestamp*

### 增加注释

编辑表，`Columns -> Customize Columns and Filter`勾选`Comment`

### 导出SQL

`Database -> Generate Database -> Preview`复制到`Navicat`中执行（`Navicat`可在勾选`查看 -> ER图`后点击`对象`显示，`刷新 -> 重新生成ER图`可以优化ER图格式）
