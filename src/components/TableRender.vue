<template>
  <div ref="tableWrap">
    <a-table
      ref="antTableRef"
      :rowKey="rowKey"
      :dataSource="filteredData"
      :columns="tableColumns"
      :pagination="false"
      :scroll="scroll"
    >
      <template
        v-for="slotItem of slots"
        :slot="slotItem.name"
        slot-scope="text, record, index, column"
      >
        <template v-if="'customTitleCheck' === slotItem.name">
          <a-checkbox
            :key="slotItem.name"
            :disabled="disabledAll"
            :checked="checkedAll"
            :indeterminate="indeterminateAll"
            @change="handleCheckChangeAll"
          ></a-checkbox>
        </template>
        <template v-else-if="'customTableCheck' === slotItem.name">
          <a-checkbox
            :key="slotItem.name"
            :checked="selectedRowKeys.includes(record[rowKey])"
            :disabled="handleCheckDisabled(record)"
            @change="e => handleCheckChange(e, record)"
          ></a-checkbox>
        </template>
        <slot v-else :name="slotItem.name" v-bind="{ text, record, index, column }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
export default {
  name: 'TableRender',
  // 扩展ant的Table组件
  extends: Table,
  props: {
    rowKey: {
      type: [String, Function],
      default() {
        return 'id'
      }
    },
    // 表头数据
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否显示选择框
    showChecked: {
      type: Boolean,
      default() {
        return true
      }
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    // 复选框禁用方法
    disbleCheckedFunc: {
      type: [Function, Boolean],
      default() {
        return () => {
          return false
        }
      }
    },
    scroll: {
      type: Object,
      default() {
        return {}
      }
    },
    tableDatas: {
      type: Array,
      default() {
        return []
      }
    },
    // 显示条数，默认显示20条，只渲染20个trDOM
    showNum: {
      type: Number,
      default() {
        return 20
      }
    },
    // 溢出显示条数的显示数量
    spillDataNum: {
      type: Number,
      default() {
        return 20
      }
    }
  },
  data() {
    return {
      tableData: [],
      currentStartIndex: 0,
      currentEndIndex: this.showNum,
      selectedRowKeys: this.defaultCheckedKeys,
      disabledAll: false,
      checkedAll: false,
      canChooseLength: 0,
      tableWrapRef: '',
      showRowNum: 0,
      rowHeight: 40,
      selectTbody: '',
      createElementTR: '',
      createElementTRHeight: 0
    }
  },
  watch: {
    tableDatas() {
      this.initScrollDOM()
      // 设置全选的禁用
      this.disabledAll = true
      this.tableDatas.forEach(item => {
        if (!this.handleCheckDisabled(item)) {
          this.canChooseLength++
          this.disabledAll = false
          return
        }
      })
    }
  },
  computed: {
    filteredData() {
      let list = this.tableDatas.filter((item, index) => {
        if (index < this.currentStartIndex) {
          return false
        } else if (index > this.currentEndIndex) {
          return false
        } else {
          return true
        }
      })
      return list
    },
    tableColumns() {
      let columns = this.columns
      if (!this.showChecked) {
        return columns
      } else {
        columns.unshift({
          width: 70,
          scopedSlots: {
            title: 'customTitleCheck',
            customRender: 'customTableCheck'
          }
        })
        return columns
      }
    },
    // 插槽
    slots() {
      const slots = []
      for (const column of this.columns) {
        const conf = {}
        for (const k in column) {
          if (k !== 'scopedSlots') conf[k] = column[k]
        }
        if (column.scopedSlots && column.scopedSlots.customRender) {
          slots.push({
            name: column.scopedSlots.customRender,
            conf: conf
          })
        }
        if (column.scopedSlots && column.scopedSlots.title) {
          slots.push({
            name: column.scopedSlots.title,
            conf: conf
          })
        }
        if (column.children) {
          const childrens = column.children
          childrens.map(child => {
            if (child.scopedSlots) {
              childrens.valueKey = child.key
              slots.push({
                name: `${child.scopedSlots.customRender}`,
                conf: child
              })
            }
          })
        }
      }
      return slots
    },
    selectedRow() {
      const rows = []
      const selectedLength = this.selectedRowKeys.length
      for (const table of this.tableDatas) {
        if (this.selectedRowKeys.includes(table[this.rowKey])) {
          rows.push(table)
        }
        if (rows.length >= selectedLength) {
          break
        }
      }
      return rows
    },
    indeterminateAll() {
      const length = this.selectedRowKeys.length
      return length > 0 && length < this.canChooseLength
    }
  },
  methods: {
    initScrollDOM() {
      this.$nextTick(() => {
        this.tableRef = this.$refs.antTableRef
        const el = this.tableRef.$el
        const dataSize = this.tableDatas.length
        const selectWrap = el.querySelector('.ant-table-body')
        this.selectTbody = selectWrap.querySelector('table tbody')
        const selectRow = selectWrap.querySelector('table tr')
        if (!selectRow) {
          return
        }
        this.rowHeight = selectRow.clientHeight
        this.showRowNum = Math.round(selectWrap.clientHeight / this.rowHeight)

        this.createElementTR = document.createElement('tr')
        let createElementTRHeight =
          (dataSize - this.showRowNum - this.spillDataNum) * this.rowHeight
        this.createElementTR.setAttribute('style', `height: ${createElementTRHeight}px;`)
        this.selectTbody.append(this.createElementTR)

        selectWrap.addEventListener('scroll', e => {
          const target = e.target
          let topPx = target.scrollTop - this.spillDataNum * this.rowHeight
          let topNum = Math.round(topPx / this.rowHeight)
          let minTopNum = dataSize - this.spillDataNum - this.showRowNum
          if (topNum > minTopNum) {
            topNum = minTopNum
          }
          if (topNum < 0) {
            topNum = 0
            topPx = 0
          }
          this.selectTbody.setAttribute('style', `transform: translateY(${topPx}px)`)
          this.createElementTR.setAttribute(
            'style',
            `height: ${createElementTRHeight - topPx > 0 ? createElementTRHeight - topPx : 0}px;`
          )
          this.currentStartIndex = topNum
          this.currentEndIndex = topNum + this.showRowNum + this.spillDataNum
        })
      })
    },
    handleCheckDisabled(record) {
      return this.disbleCheckedFunc(record)
    },
    handleCheckChange(e, item) {
      const checked = e.target.checked
      if (checked) {
        if (this.selectedRowKeys.includes(item[this.rowKey])) return
        this.selectedRowKeys.push(item[this.rowKey])
        item.checked = true
      } else {
        const keyIndex = this.selectedRowKeys.indexOf(item[this.rowKey])
        this.selectedRowKeys.splice(keyIndex, 1)
        item.checked = false
      }
      this.$emit('handleTableCheck', this.selectedRowKeys, this.selectedRow)
    },
    handleCheckChangeAll(e) {
      const checked = e.target.checked
      if (checked) {
        this.checkedAll = true
        for (const data of this.tableDatas) {
          if (
            !this.handleCheckDisabled(data) &&
            !this.selectedRowKeys.includes(data[this.rowKey])
          ) {
            this.selectedRowKeys.push(data[this.rowKey])
          }
        }
      } else {
        this.checkedAll = false
        this.selectedRowKeys = []
      }
      // this.$emit('handleCheckChangeAll', checked, this.selectedRowKeys, this.selectedRow)
    }
  }
}
</script>

<style lang="scss"></style>
