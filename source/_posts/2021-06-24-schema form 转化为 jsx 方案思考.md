---
title: schema form 转化为 jsx 方案思考
date: 2021-06-24 23:01:30
categories:
    - 前端综合
tags:
    - 表单
---

# 背景

-   直播中后台绝大部分(90%)的页面使用 schema form 搭建
-   schema form 虽然带来了效率的提升，但由于只支持 json，无法自定义地实现一些定制化的需求

<!-- more -->

# 痛点

-   json 自身的局限性，导致框架不满足需求时，只能被动等待框架支持该功能
-   无法利用 React jsx 一些方便的特性，无法侵入到组件内部去动态修改一些逻辑
-   无法自由自在地进行布局，目前 schema form 只有从上到下的展示
-   有时候封装一个自定义组件只是为了一个特殊的展示

# 目标

-   使用 jsx 的方式支持 json 所有已有的功能点，同时尽可能不改变用户已有的认知
-   最大化地满足用户定制化的需求，使得用 jsx 的写法能替代大部分(70%)使用自定义组件的场景
-   在保证自由度的需求上，尽可能简化写法，方便用户的开发

# 特性

-   实现 jsx 功能
-   提供 json 到 jsx 的一键转化功能
-   提供布局组件

# 使用方式

原有的使用方式是：

```javascript
const schema = [
    {
        key: 'radio1',
        type: 'Radio',
        ui: {
            label: '表单项 1'
        },
        value: 1,
        options: [
            {
                name: '联动',
                value: 1
            },
            {
                name: '不联动',
                value: 0
            }
        ],
        props: {
            placeholder: '占位信息'
        }
    },
    {
        key: 'input1',
        type: 'Input',
        ui: {
            label: '表单项 2'
        },
        listeners: [
            {
                watch: ['radio1'],
                condition: 'radio1.value == 1',
                set: {
                    value: '联动'
                }
            }
        ]
    },
    {
        key: 'input2',
        type: 'Input',
        ui: {
            label: '表单项 3'
        }
    }
];

<XForm schema={schema} />;
```

转化为 jsx 之后的写法为：

```jsx
const listerners = useFormListeners(() => {
    // 联动逻辑
}, []);

<XForm>
    <Row>
        <Col flex={1}>
            <XFormItem
                key="radio1"
                type="Radio"
                label="表单项 1"
                placeholder="占位信息"
                value={1}
                options={[
                    {
                        name: '联动',
                        value: 1
                    },
                    {
                        name: '不联动',
                        value: 0
                    }
                ]}
            />
        </Col>
        <Col flex={1}>
            <XFormItem key="input1" label="表单项 2" listerners={listerners}>
                <Input />
            </XFormItem>
        </Col>
    </Row>
    <XFormItem key="input2" type="Input" label="表单项 3" />
</XForm>;
```

主要做了以下优化：

-   尽可能采用简写的形式，比如 `ui: { label: '' }` 直接简写为 `label` 字段，同时 `props` 中的参数也可以直接透传，比如 `placeholder`
-   更符合 jsx 编写的习惯，可以把 `type` 对应的组件，放入 `children` 中，也可以直接作为 `type` 传递
-   增加了 `Row`、`Col` 等布局组件，也可以直接自己写 `div` 传入希望的样式，或者加入其它展示元素

XTable 也做了相应优化：

```jsx
<XTable>
    <Filters>
        <XFormItem />
        <XFormItem />
        <XFormItem />
        <XButton type="search" />
        <XButton type="reset" />
    </Filters>
    <XButton type="search" />
    <XButtonModal {...ui} action="add">
        <XForm {...props} />
    </XButtonModal>
    <Table
        column={[
            11,
            22,
            (record, filter) => (
                <ButtonModal {...ui} action="add">
                    <XForm {...props} />
                </ButtonModal>
            )
        ]}
    />
</XTable>
```

``` jsx
export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        return request<{
          data: GithubIssueItem[];
        }>('https://proapi.azurewebsites.net/github/issues', {
          params,
        });
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
        <Dropdown key="menu" overlay={menu}>
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};

```

# 进展

-   本地 demo 预研，进行中


# XTableJSX初版方案

2021年11月01日

``` javascript
   <ConfigProvider locale={zh_CN}>
      <div style={{ padding: "20px" }}>
        <XTable
          ref={ref}
          onSearch={(core) => console.log("onSearch", core)}
          request={API.list}
        >
          <Row>
            <Col span={20}>
              {/* 检索区域 */}
              <SearchForm
                values={{
                  input: "我是默认值",
                }}
                buttons={(action) => [
                  <Button type="primary" onClick={action.search}>
                    搜索
                  </Button>,
                  <Button onClick={action.reset}>重置</Button>,
                  <Button onClick={action.empty}>清空</Button>,
                ]}
              >
                <XFormItem name="input" type="Input" label="测试" />
                <XFormItem name="input2" type="Input" label="测试2" />
              </SearchForm>
            </Col>
            <Col span={4}>
              <Toolbar>
                <Action
                  type="create"
                  title="新增"
                  buttonProps={{
                    type: "primary",
                  }}
                  api={API.add}
                >
                  <XFormItem name="name" type="Input" label="名字" />
                </Action>
              </Toolbar>
            </Col>
          </Row>

          <ColumnRender
            columns={[
              {
                key: "name",
                title: "名字",
                sortable: true,
              },
              // TODO: 序号列
              // {
              //   key: "index",
              //   type: ({ pageSize, pageIndex, rowIndex }: any) => (
              //     <span>{(pageIndex - 1) * pageSize + rowIndex}</span>
              //   ),
              //   title: "序号",
              // },
              {
                key: "time",
                title: "时间",
                type: "Datetime",
                sortable: true,
              },
              {
                key: "type",
                title: "类型",
                type: "Enum",
                props: {
                  options: [
                    { name: "水果", value: "1" },
                    { name: "蔬菜", value: "2" },
                  ],
                },
              },
              {
                key: "image",
                title: "图片",
                type: "Image",
              },
              {
                key: "format",
                title: "格式",
                type: "Format",
                props: {
                  format: (data: any) => data.value * 100,
                },
              },
              {
                key: "audio",
                title: "音频",
                type: "Audio",
                ui: {
                  width: 300,
                },
              },
              {
                key: "video",
                title: "视频",
                type: "Video",
                ui: {
                  width: 300,
                },
              },
              {
                title: "测试",
                key: "test",
                type: ({ value }: any) => {
                  return <span>{value?.a}</span>;
                },
              },
              {
                title: "操作",
                type: ({ record }: any) => {
                  return (
                    <>
                      <Action
                        type="edit"
                        title="编辑"
                        api={API.update}
                        record={record}
                        buttonProps={{
                          type: "primary",
                        }}
                      >
                        <XFormItem name="name" type="Input" label="名字" />
                      </Action>
                      <Action
                        type="delete"
                        title="删除"
                        api={API.delete}
                        popConfirm={{
                          title: "确认删除", // 此处不配置则默认使用外层title
                          okText: "确定",
                          cancelText: "取消",
                        }}
                        record={record}
                        buttonProps={{
                          type: "danger",
                        }}
                      ></Action>
                      <Button onClick={() => console.log(record)}>
                        自定义按钮
                      </Button>
                    </>
                  );
                },
              },
            ]}
          ></ColumnRender>
        </XTable>
      </div>
    </ConfigProvider>

``` 