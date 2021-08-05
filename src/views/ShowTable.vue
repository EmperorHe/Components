<template>
  <div class="table-wrap">
    <TableRender
      :columns="columns"
      :tableDatas="tableDatas"
      :showChecked="true"
      :scroll="{ y: 400 }"
      :defaultCheckedKeys="defaultCheckedKeys"
      :disbleCheckedFunc="disbleCheckedFunc"
      @handleTableCheck="handleTableCheck"
    >
      <template slot="operate">
        <a-button type="primary">查看</a-button>
        <a-button type="danger">删除</a-button>
      </template>
    </TableRender>
  </div>
</template>

<script>
import TableRender from '../components/TableRender.vue'
export default {
  name: 'ShowTable',
  components: {
    TableRender
  },
  data() {
    return {
      tableDatas: [],
      currentStartIndex: 0,
      currentEndIndex: 20,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id'
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
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
          width: 280
        },
        {
          title: '操作',
          scopedSlots: {
            customRender: 'operate'
          }
        }
      ],
      defaultCheckedKeys: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    disbleCheckedFunc(record) {
      return record.id % 4 === 0
    },
    getTableData() {
      let cont = 0
      let tableDatas = []
      while (cont < 10000) {
        cont = cont + 1
        let object = {
          name: '张三丰' + cont,
          age: cont,
          sex: cont % 2 === 0 ? '男' : '女',
          description: '纸上得来终觉浅，绝知此事要躬行',
          id: cont
        }
        tableDatas.push(object)
      }
      setTimeout(() => {
        this.tableDatas = tableDatas
      }, 0)
    },
    handleTableCheck(selectedRowKeys, selectedRow) {
      console.log('选中的key：', selectedRowKeys)
      console.log('选中的对象:', selectedRow)
    }
    // handleCheckChangeAll(checked, selectedRowKeys, selectedRow) {
    //   console.log(checked)
    //   console.log('选中的key：', selectedRowKeys)
    //   console.log('选中的对象:', selectedRow)
    // }
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  padding-top: 200px;
}
</style>
