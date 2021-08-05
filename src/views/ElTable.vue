<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="app">
    <h6>不管怎么滚动，dom都只渲染21条tr ( arrangement by yangyuhui )</h6>
    <el-table
      :data="filteredData"
      style="width: 100%; border: 2px solid red"
      v-loadmore="handelLoadmore"
      :data-size="tableData.length"
      height="300"
    >
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="sex" label="年龄"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentStartIndex: 0,
      currentEndIndex: 20
    }
  },
  directives: {
    loadmore: {
      // componentUpdated updated
      componentUpdated: function (el, binding, vnode, oldVnode) {
        // 设置默认溢出显示数量
        var spillDataNum = 20
        // 设置隐藏函数
        var timeout = false
        let setRowDisableNone = function (topNum, showRowNum, binding) {
          if (timeout) {
            clearTimeout(timeout)
          }
          timeout = setTimeout(() => {
            binding.value.call(null, topNum, topNum + showRowNum + spillDataNum)
          })
        }
        setTimeout(() => {
          const dataSize = vnode.data.attrs['data-size']
          const oldDataSize = oldVnode.data.attrs['data-size']
          if (dataSize === oldDataSize) return
          const selectWrap = el.querySelector('.el-table__body-wrapper')
          const selectTbody = selectWrap.querySelector('table tbody')
          const selectRow = selectWrap.querySelector('table tr')
          if (!selectRow) {
            return
          }
          const rowHeight = selectRow.clientHeight
          let showRowNum = Math.round(selectWrap.clientHeight / rowHeight)

          const createElementTR = document.createElement('tr')
          let createElementTRHeight = (dataSize - showRowNum - spillDataNum) * rowHeight
          createElementTR.setAttribute('style', `height: ${createElementTRHeight}px;`)
          selectTbody.append(createElementTR)

          // 监听滚动后事件
          selectWrap.addEventListener('scroll', function () {
            let topPx = this.scrollTop - spillDataNum * rowHeight
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
            setRowDisableNone(topNum, showRowNum, binding)
          })
        })
      }
    }
  },
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
    handelLoadmore(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    getTableData() {
      let cont = 0
      let tableData = []
      while (cont < 10000) {
        cont = cont + 1
        let object = {
          name: '王小虎' + cont,
          sex: cont
        }
        tableData.push(object)
      }

      setTimeout(() => {
        this.tableData = tableData
        // console.log(tableData,this.tableData[0].name)
      }, 0)
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
