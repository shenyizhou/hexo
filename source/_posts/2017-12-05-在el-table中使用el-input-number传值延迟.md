---
title: 在el-table中使用el-input-number传值延迟
date: 2017-12-05 20:09:30
categories:
- Vue
tags:
- Vue
- ElementUI
---

### 要说的就这么多

``` HTML
<el-table ...>
  ...
  <el-table-column ...>
    <template scope="scope">
      <div>
        <el-input-number v-model="scope.row.quantity" @change="(value) => handleInput(value, scope.row.quantity)" ...>
        </el-input-number>
      </div>
    </template>
  </el-table-colum>
  ...
</el-table>
```

``` JavaScript
handleInput (value, quantity) {
  console.log(value) // 真实值
  console.log(quantity) // 前一个值
},
```
<!-- more -->

### 直接这样就没事

``` HTML
<el-table ...>
  ...
  <el-table-column ...>
    <template scope="scope">
      <div>
        <el-input
          v-model="scope.row.quantity" @change="handleInput(scope.row)" class="count-input" onkeypress="return event.keyCode>=48&&event.keyCode<=57">
          <el-button slot="prepend" @click="del(scope.row)"><i class="el-icon-minus"></i></el-button>
          <el-button slot="append" @click="add(scope.row)"><i class="el-icon-plus"></i></el-button>
        </el-input>
      </div>
    </template>
  </el-table-colum>
  ...
</el-table>
```
