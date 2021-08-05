<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="app">
    <a-table
      ref="antTableRef"
      rowKey="id"
      style="width: 100%; border: 2px solid red"
      :dataSource="filteredData"
      :columns="columns"
      :pagination="false"
      :scroll="{ y: 300 }"
    >
      <!-- :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps,
        onSelectAll: onSelectAll
      }" -->
      <!-- 使用自定义插槽的复选框 -->
      <template slot="customTitleCheck">
        <a-checkbox></a-checkbox>
      </template>
      <template slot="customTableCheck" slot-scope="scope">
        <a-checkbox
          :checked="selectedRowKeys.includes(scope.id)"
          :disabled="isTableItemDisabled(scope)"
          @change="e => handleCheckChange(e, scope)"
        ></a-checkbox>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentStartIndex: 0,
      currentEndIndex: 20,
      columns: [
        {
          width: 70,
          scopedSlots: {
            title: 'customTitleCheck',
            customRender: 'customTableCheck'
          }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age'
        }
      ],
      selectedRowKeys: [4, 8],
      selectedRow: []
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {},
  computed: {
    filteredData() {
      let list = this.tableData.filter((item, index) => {
        if (index < this.currentStartIndex) {
          return false
        } else if (index > this.currentEndIndex) {
          return false
        } else {
          return true
        }
      })
      return list
    }
  },
  methods: {
    getCheckboxProps(record) {
      return {
        defaultChecked: false,
        indeterminate: true,
        disabled: true,
        props: { disabled: record.id % 4 === 0, defaultIndeterminate: true }
      }
    },
    // 全选/反选
    onSelectAll(selected) {
      console.log('全选:', selected)
      if (selected) {
        const datas = this.tableData.filter(item => {
          return this.selectedRowKeys.includes(item.id) || !this.isTableItemDisabled(item)
        })
        this.selectedRowKeys = datas.map(i => i.id)
        console.log(datas)
      } else {
        const datas = this.tableData.filter(item => {
          return this.selectedRowKeys.includes(item.id) && this.isTableItemDisabled(item)
        })
        this.selectedRowKeys = datas.map(i => i.id)
        console.log(datas)
      }
    },
    handleLoadmore() {
      this.$nextTick(() => {
        this.tableRef = this.$refs.antTableRef
        const el = this.tableRef.$el
        const dataSize = this.tableData.length
        const spillDataNum = 20
        const selectWrap = el.querySelector('.ant-table-body')
        const selectTbody = selectWrap.querySelector('table tbody')
        const selectRow = selectWrap.querySelector('table tr')
        const that = this
        if (!selectRow) {
          return
        }
        const rowHeight = selectRow.clientHeight
        let showRowNum = Math.round(selectWrap.clientHeight / rowHeight)

        const createElementTR = document.createElement('tr')
        let createElementTRHeight = (dataSize - showRowNum - spillDataNum) * rowHeight
        createElementTR.setAttribute('style', `height: ${createElementTRHeight}px;`)
        selectTbody.append(createElementTR)

        selectWrap.addEventListener('scroll', function (e) {
          const target = e.target
          let topPx = target.scrollTop - (spillDataNum - showRowNum) * rowHeight
          let topNum = Math.round(topPx / rowHeight)
          let minTopNum = dataSize - spillDataNum - showRowNum
          if (topNum > minTopNum) {
            topNum = minTopNum
          }
          if (topNum < 0) {
            topNum = 0
            topPx = 0
          }
          selectTbody.setAttribute('style', `transform: translateY(${topPx}px)`)
          createElementTR.setAttribute(
            'style',
            `height: ${createElementTRHeight - topPx > 0 ? createElementTRHeight - topPx : 0}px;`
          )
          that.currentStartIndex = topNum
          that.currentEndIndex = topNum + showRowNum + spillDataNum
          // console.log(that.currentStartIndex, that.currentEndIndex)
        })
      })
    },
    handleCheckChange(e, item) {
      const checked = e.target.checked
      if (checked) {
        if (this.selectedRowKeys.includes(item.id)) return
        this.selectedRowKeys.push(item.id)
        this.selectedRow.push(item)
      } else {
        const index = this.selectedRowKeys.indexOf(item.id)
        this.selectedRowKeys.splice(index, 1)
        this.selectedRow.splice(index, 1)
      }
    },
    onSelectChange(selectedRowKeys, selectedRow) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log('selectedRow changed: ', selectedRow)
      this.selectedRowKeys = selectedRowKeys
    },
    isTableItemDisabled(record) {
      return record.id % 4 === 0
    },
    getTableData() {
      let cont = 0
      let tableData = []
      while (cont < 10000) {
        cont = cont + 1
        let object = {
          name: '张三丰' + cont,
          age: cont,
          id: cont
        }
        tableData.push(object)
      }

      setTimeout(() => {
        this.tableData = tableData
        this.handleLoadmore()
        // console.log(tableData,this.tableData[0].name)
      }, 0)
    }
  }
}
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style lang="scss"></style>
