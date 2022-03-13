## 组件说明

`scroll-table`本组件是为了实现不分页渲染大量数据的需求，基于蚂蚁金服的`a-table`组件实现。

## 属性 API

| 参数               | 说明                                                         |        类型         |   可选值   | 默认值 |
| :----------------- | :----------------------------------------------------------- | :-----------------: | :--------: | :----- |
| rowKey             | 主键，用做vue的组件key                                       |       String        |     -      | 'id'   |
| columns            | 表格的表头数据                                               |        Array        |     -      | []     |
| showChecked        | 是否显示选择框，用于对表格数据进行选中操作                   |       Boolean       | true/false | true   |
| defaultCheckedKeys | 表格的默认选中数据的id组件的数组(根据前面的rowKey设置的属性筛选) |        Array        |     -      | []     |
| disbleCheckedFunc  | 复选框的禁用方法，用以对特殊的数据进行禁用选中功能           | [Function, Boolean] |     -      | false  |
| scroll             | 表格的滚动区域                                               |       Object        |     -      | {}     |
| tableDatas         | 表格的所有数据                                               |        Array        |     -      | []     |
| showNum            | 显示的数据条数，该属性决定页面内渲染的DOM数量                |       Number        |     -      | 20     |

## 事件（@xxxx="function"）

| 事件名称             | 说明                                   | 回调参数                                      |
| :------------------- | :------------------------------------- | :-------------------------------------------- |
| handleTableCheck     | 表格内选中事件的回调，用以操作选中数据 | function(selectedRowKeys,selectedRow)         |
| handleCheckChangeAll | 表格头的全选和反选事件                 | function(checked,selectedRowKeys,selectedRow) |

## 组件使用代码示例

```javascript
<template>
  <uev-docs title="表格不分页渲染组件" :markHtml="mark">
    <div class="docs-wrap">
      <!-- 示例代码开始 -->
      <scroll-table
        ref="scrollTable"
        rowKey="id"
        :columns="tableColumns"
        :showChecked="true"
        :defaultCheckedKeys="defaultCheckedKeys"
        :scroll="{
          x: 1000,
          y: 400
        }"
        :disbleCheckedFunc="isTableItemDisabled"
        :tableDatas="tableDatas"
        @handleTableCheck="handleTableCheck"
        @handleCheckChangeAll="handleCheckChangeAll"
      />
      <!-- 示例代码结束 -->
    </div>
  </uev-docs>
</template>

<script>
import ScrollTable from '@/components/func-com/ScrollTable.vue'
import mark from './README.md'

export default {
  name: 'ScrollTableDocs',
  components: {
    ScrollTable
  },
  data() {
    return {
      mark: mark,
      tableColumns: [
        {
          title: '房屋号',
          key: 'fwh',
          dataIndex: 'fwh',
          width: 100
        },
        {
          title: '功能',
          valueKey: 'fwgn',
          dataIndex: 'fwgn',
          key: 'fwgn',
          width: 100
        },
        {
          title: '户型',
          valueKey: 'fwhx',
          dataIndex: 'fwhx',
          key: 'fwhx',
          width: 100
        },
        {
          title: '房屋朝向',
          dataIndex: 'fwcx',
          key: 'fwcx',
          width: 100
        },
        {
          title: '房屋状态',
          dataIndex: 'fwzt',
          key: 'fwzt',
          width: 100
        },
        {
          title: '共有产权',
          dataIndex: 'gycq',
          key: 'gycq',
          width: 100
        },
        {
          title: '是否抵押',
          dataIndex: 'sfdy',
          key: 'sfdy',
          width: 100
        },
        {
          title: '预售总面积(m²)',
          valueKey: 'zjzmj',
          dataIndex: 'zjzmj',
          key: 'zjzmj',
          fixed: 'right',
          width: 140
        },
        {
          title: '套内面积(m²)',
          valueKey: 'tnmj',
          dataIndex: 'tnmj',
          key: 'tnmj',
          fixed: 'right',
          width: 120
        },
        {
          title: '公摊面积(m²)',
          valueKey: 'gtmj',
          dataIndex: 'gtmj',
          key: 'gtmj',
          fixed: 'right',
          width: 120
        }
      ],
      defaultCheckedKeys: [1, 2, 3],
      tableDatas: []
    }
  },
  mounted() {
    this.initHouseData()
  },
  methods: {
    initHouseData() {
      this.tableDatas = []
      const gnArr = ['车位', '住宅', '别墅', '商品房', '自建房']
      const hxArr = ['一房一厅', '两房一厅', '三房一厅', '四房一厅', '三房两厅', '四房两厅']
      const cxArr = ['南', '北', '东', '西', '西南', '东南', '西北', '东北']
      const ztArr = ['正常', '查封']
      for (let i = 0; i < 10000; i++) {
        const data = {
          id: i,
          fwh: Math.floor((i / 10) + 1) + '0' + parseInt(Math.random() * 9 + 1),
          fwgn: gnArr[parseInt(i / gnArr.length) % gnArr.length],
          fwhx: hxArr[parseInt(i / hxArr.length) % hxArr.length],
          fwcx: cxArr[parseInt(i / cxArr.length) % cxArr.length],
          fwzt: ztArr[parseInt(i / ztArr.length) % ztArr.length],
          gycq: i % 2 === 0 ? '是' : '否',
          sfdy: i % 2 === 0 ? '是' : '否',
          zjzmj: (Math.random() * 100).toFixed(2),
          tnmj: (Math.random() * 100).toFixed(2),
          gtmj: (Math.random() * 100).toFixed(2)
        }
        this.tableDatas.push(data)
      }
      // 调用组件内的初始化方法
      this.$refs.scrollTable.initScrollDOM()
    },
    // 判断房屋是否可选
    isTableItemDisabled(record) {
      const flag = record.id % 4 === 0
      return flag
    },
    // 表格单个元素选中
    handleTableCheck(selectedRowKeys, selectedRows) {
      console.log('选中的房屋id:', selectedRowKeys, '选中的房屋数据:', selectedRows)
    },
    // 表格全选
    handleCheckChangeAll(checked, selectedRowKeys, selectedRows) {
      console.log('全选房屋', checked)
      console.log('选中的房屋id:', selectedRowKeys, '选中的房屋数据:', selectedRows)
    }
  }
}
</script>

<style lang="scss" scoped>
.demo {
	display: inline-block;
	margin-right: 25px;
}
</style>
```
