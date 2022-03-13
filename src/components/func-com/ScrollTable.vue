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
          <!-- 表头的复选框插槽 -->
          <a-checkbox
            :key="slotItem.name"
            :disabled="disabledAll"
            :checked="checkedAll"
            :indeterminate="indeterminateAll"
            @change="handleCheckChangeAll"
          />
        </template>
        <template v-else-if="'customTableCheck' === slotItem.name">
          <!-- 表格的复选框插槽 -->
          <a-checkbox
            :key="slotItem.name"
            :checked="selectedRowKeys.includes(record[rowKey])"
            :disabled="handleCheckDisabled(record)"
            @change="e => handleCheckChange(e, record)"
          />
        </template>
        <slot
          v-else
          :name="slotItem.name"
          v-bind="{ text, record, index, column }"
        ></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
export default {
  name: 'ScrollTable',
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
    // 默认选中项
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
        return false
      }
    },
    scroll: {
      type: Object,
      default() {
        return {}
      }
    },
    // 所有的表格数据
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
    }
  },
  data() {
    return {
      currentStartIndex: 0, // 开始索引
      currentEndIndex: this.showNum, // 结束索引
      selectedRowKeys: this.defaultCheckedKeys, // 选中项
      disabledAll: false, // 表头的复选框禁用属性
      canChooseLength: 0, // 表格内除去禁用的项，剩余可选择的长度
      showRowNum: 0, // 表格元素的可视高度内显示的tr条数
      rowHeight: 40, // 每一条tr的高度
      selectTbody: '', // tbody DOM元素
      createElementTR: '', // 创建的tr元素
      createElementTRHeight: 0, // 创建的tr元素的高度
      spillDataNum: 20, // 溢出的tr条数
      dataSize: 0, // 总的表格数据量
      fixedTbodyRight: '', // tbody 右侧固定列的DOM元素
      createElementTRII: '' // 新建的tr DOM元素二号
    }
  },
  computed: {
    // 根据开始索引和结束索引筛选显示的表格数据
    filteredData() {
      const list = this.tableDatas.filter((item, index) => {
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
    // 表头项
    tableColumns() {
      const columns = this.columns
      if (!this.showChecked) {
        console.log(columns)
        return columns
      } else {
        columns.unshift({
          width: 70,
          scopedSlots: {
            title: 'customTitleCheck',
            customRender: 'customTableCheck'
          }
        })
        console.log(columns)
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
    // 表头的复选框的半选中样式控制
    indeterminateAll() {
      const length = this.selectedRowKeys.length
      return length > 0 && length < this.canChooseLength
    },
    // 表头的复选框选中属性
    checkedAll() {
      if (this.canChooseLength > 0) {
        return this.canChooseLength === this.selectedRowKeys.length
      } else {
        return false
      }
    }
  },
  watch: {
    tableDatas(val) {
      // this.initScrollDOM()
      // 设置全选的禁用
      this.canChooseLength = 0
      this.disabledAll = true
      // 表格数据改变后将原来加入到底部的tr元素都移除
      if (this.selectTbody) {
        const allNewTrDom = Array.from(
          this.selectTbody.querySelectorAll('.new-tr')
        )
        for (let i = 0; i < allNewTrDom.length; i++) {
          this.selectTbody.removeChild(allNewTrDom[i])
        }
      }
      // 固定列底部的tr元素也同样移除
      if (this.fixedTbodyRight) {
        const allNewTrDom = Array.from(
          this.fixedTbodyRight.querySelectorAll('.new-tr')
        )
        for (let i = 0; i < allNewTrDom.length; i++) {
          this.fixedTbodyRight.removeChild(allNewTrDom[i])
        }
      }
      this.tableDatas.forEach(item => {
        if (!this.handleCheckDisabled(item)) {
          this.canChooseLength++
          this.disabledAll = false
        }
      })
    },
    // 默认选中项
    defaultCheckedKeys(val) {
      this.selectedRowKeys = Array.from(new Set([...val, ...this.selectedRowKeys]))
    }
  },
  methods: {
    // 初始化数据，需要父组件进行调用。父组件在调取接口拿到表格的数据后再调用该方法
    initScrollDOM() {
      this.$nextTick(() => {
        // 表格DOM
        this.tableRef = this.$refs.antTableRef
        const el = this.tableRef.$el
        const selectWrap = el.querySelector('.ant-table-body')
        this.selectTbody = selectWrap.querySelector('table tbody')
        const selectRow = selectWrap.querySelector('table tr')
        this.dataSize = this.tableDatas.length // 表格所有数据的长度
        this.rowHeight = selectRow.clientHeight // tr的高度
        // tbody元素的可视高度内显示的tr条数
        this.showRowNum = Math.round(selectWrap.clientHeight / this.rowHeight)
        // 即所有显示的DOM条数减去可视高度内的条数，为溢出数据
        this.spillDataNum = this.showNum - this.showRowNum
        // 如果表格总的数据不超过可视高度内的数据，则不需要进行操作
        if (this.dataSize <= this.showRowNum) {
          return
        }
        // 创建tr元素
        this.createElementTR = document.createElement('tr')
        this.createElementTR.classList.add('new-tr')
        // 设置tr的高度
        this.createElementTRHeight =
          (this.dataSize - this.showRowNum - this.spillDataNum) * this.rowHeight
        this.createElementTR.setAttribute(
          'style',
          `height: ${this.createElementTRHeight}px;`
        )
        // 将tr元素加入到tbody元素的底部，撑开高度
        this.selectTbody.append(this.createElementTR)
        // 如果存在右侧固定列 用于给固定列底部加上tr (因为使用了fixed属性，蚂蚁金服的组件会多生成一个DOM，为了固定列和表格列同时滚动，需要给固定列也加上对应的tr元素)
        if (el.querySelector('.ant-table-fixed-right')) {
          this.createElementTRII = this.createElementTR.cloneNode(true)
          const fixedWrapRight = el
            .querySelector('.ant-table-fixed-right')
            .querySelector('.ant-table-body-outer')
            .querySelector('.ant-table-body-inner')
          this.fixedTbodyRight = fixedWrapRight.querySelector('table tbody')
          this.fixedTbodyRight.append(this.createElementTRII)
        }

        // 监听滚动事件
        selectWrap.addEventListener('scroll', e => {
          if (e.target.className === 'ant-table-body') {
            const target = e.target
            // 获取滚动的高度和溢出tr的高度之差
            let topPx = target.scrollTop - this.spillDataNum * this.rowHeight
            // 获取滚动了的tr的条数减去溢出的条数。用于设置开始索引
            let topNum = Math.round(topPx / this.rowHeight)
            // 设置最大溢出tr的数量
            const maxTopNum =
              this.dataSize - this.spillDataNum - this.showRowNum
            if (topNum > maxTopNum) {
              topNum = maxTopNum
            }
            if (topNum < 0) {
              topNum = 0
              topPx = 0
            }
            // 设置表格的translateY偏移量，即设置上方的高度，用于撑开滚动条
            this.selectTbody.setAttribute(
              'style',
              `transform: translateY(${topPx}px)`
            )
            // 改变底部插入的tr的高度
            this.createElementTR.setAttribute(
              'style',
              `height: ${
                this.createElementTRHeight - topPx > 0
                  ? this.createElementTRHeight - topPx
                  : 0
              }px;`
            )
            //  如果存在右侧固定列
            if (this.fixedTbodyRight && this.createElementTRII) {
              this.fixedTbodyRight.setAttribute(
                'style',
                `transform:translateY(${topPx}px)`
              )
              this.createElementTRII.setAttribute(
                'style',
                `height: ${
                  this.createElementTRHeight - topPx > 0
                    ? this.createElementTRHeight - topPx
                    : 0
                }px`
              )
            }
            // 重新设置开始和结束索引
            this.currentStartIndex = topNum
            this.currentEndIndex = topNum + this.showRowNum + this.spillDataNum
          }
        })
      })
    },
    // 复选框的禁用方法
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
      // 传递给父组件的表格选中事件
      this.$emit('handleTableCheck', this.selectedRowKeys, this.selectedRow)
    },
    handleCheckChangeAll(e) {
      const checked = e.target.checked
      if (checked) {
        for (const data of this.tableDatas) {
          if (
            !this.handleCheckDisabled(data) &&
            !this.selectedRowKeys.includes(data[this.rowKey])
          ) {
            this.selectedRowKeys.push(data[this.rowKey])
          }
        }
      } else {
        this.selectedRowKeys = []
      }
      // 传递给父组件的全选事件
      this.$emit(
        'handleCheckChangeAll',
        checked,
        this.selectedRowKeys,
        this.selectedRow
      )
    }
  }
}
</script>

<style lang="scss"></style>
