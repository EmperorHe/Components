<template>
  <uev-docs title="快速配置表单组件（ZvFormModel）" :markHtml="mark">
    <div class="docs-wrap">
      <!-- 示例代码开始 -->
      <div style="margin-bottom: 40px;">
        <h2>（一）仅有一个标题</h2>
        <zv-white-blog title="仅有一个标题的模式">
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <div class="demo">内容区域</div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（二）多个tab标题</h2>
        <zv-white-blog :titleTabs="titleTabs" :tabCurKey.sync="tabCurKey">
          <div slot="pane-1">这是第一个tab的内容</div>
          <div slot="pane-2">这是第二个tab的内容：这里具体测试一下</div>
          <div slot="headHandle">
            <zv-button :useAntBtn="true">操作按钮</zv-button>
          </div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（三）带返回按钮形式</h2>
        <zv-white-blog title="仅有一个标题的模式" :hasBackBtn="true">
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <div class="demo">内容区域</div>
        </zv-white-blog>
      </div>
      <div style="margin-bottom: 40px;">
        <h2>（四）一个标题多个tab形式</h2>
        <zv-white-blog
          title="某个事项标题"
          :isContTab="true"
          :titleTabs="contTabs"
          :tabCurKey.sync="contTabCurKey"
          :hasBackBtn="true"
        >
          <zv-button slot="headHandle" :useAntBtn="true">操作按钮</zv-button>
          <zv-button slot="tabHandle">操作&nbsp;&gt;&gt;</zv-button>
          <div slot="cont-pane-1">第一步：先填写基本信息。</div>
          <div slot="cont-pane-2">第二部：上传相应的附件。</div>
          <div slot="cont-pane-3">
            <zv-table-check-mode
              :columns="columns"
              :dataSource="tableData"
              :autoShowOrderNum="true"
              :scroll="{ y: 120 }"
              @scrollBottom="scrollBottom"
            >
              <template slot="state" slot-scope="scope">
                <span class="state-icon">
                  <i
                    class="icon"
                    :class="{ 'zv-bg-color': scope.record.status === '1' }"
                  ></i>
                  {{ scope.record.status === '1' ? '启用' : '禁用' }}
                </span>
              </template>
              <template slot="handle" slot-scope="scope">
                <zv-button @click="edit(scope)">编辑</zv-button>
                <zv-button
                  type="danger"
                  secondConfirmText="确定删除吗？删除不可撤回！"
                  @click="del(scope)"
                >删除</zv-button>
              </template>
            </zv-table-check-mode>
          </div>
        </zv-white-blog>
      </div>
      <!-- 示例代码结束 -->
    </div>
  </uev-docs>
</template>

<script>
import mark from './README.md'

export default {
  name: 'DocsZvWhiteBlogIndex',
  data() {
    return {
      mark: mark,
      // tab标题
      titleTabs: [
        {
          key: '01', // tab的key
          tab: '第一个tab', // tab的标签名
          slot: 'pane-1' // tab对应组件插槽名称
        },
        {
          key: '02',
          tab: '第二个tab',
          slot: 'pane-2'
        }
      ],
      tabCurKey: '01',
      contTabs: [
        {
          key: 'cont-1', // tab的key
          tab: '第一步', // tab的标签名
          slot: 'cont-pane-1' // tab对应组件插槽名称
        },
        {
          key: 'cont-2',
          tab: '第二步',
          slot: 'cont-pane-2'
        },
        {
          key: 'cont-3',
          tab: '第三步',
          slot: 'cont-pane-3'
        }
      ],
      contTabCurKey: 'cont-1',
      // 表头设置
      columns: [
        {
          title: '登录账号',
          width: 120,
          dataIndex: 'username',
          key: 'username'
        },
        {
          title: '真实姓名',
          width: 100,
          dataIndex: 'realname',
          key: 'realname'
        },
        {
          title: '身份证号',
          width: 190,
          dataIndex: 'idCard',
          key: 'idCard'
        },
        {
          title: '年龄',
          width: 190,
          dataIndex: 'age',
          key: 'age',
          sorter: (a, b) => a.age - b.age
        },
        {
          title: '手机号码',
          width: 130,
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '部门机构',
          width: 200,
          dataIndex: 'depName',
          key: 'depName',
          isTips: true
        },
        {
          title: '电子邮箱',
          width: 200,
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '状态',
          width: 80,
          scopedSlots: {
            customRender: 'state'
          }
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          scopedSlots: {
            customRender: 'handle'
          }
        }
      ],
      tableData: [
        {
          id: '31f6bd865bfc4d71bbea9bfe5837f1fd',
          depId: 'c75952f3fad04a30bfaa7be6a26e33d7',
          depName: '广州中软信息有限公司',
          username: 'devadmin',
          realname: '开发管理员',
          age: 25,
          password:
            '$2a$10$C.xiCURL78dViIaBPSt5iOCpIJML2skq6SAghvQ7TSys8LJAovccy',
          salt: null,
          avatar: null,
          birthday: '1980-01-02',
          email: 'gzcss@gzcss.net',
          phone: '18566666666',
          status: '1',
          delFlag: '0',
          statusName: '正常',
          createBy: 'e9ca23d68d884d4ebb19d07889727dae',
          createTime: '2021-02-07 10:44:57',
          updateBy: null,
          updateTime: null,
          idCard: '440102198001021230'
        },
        {
          id: 'ecc1b8809a674ff1910e2c3714ca6493',
          depId: 'c75952f3fad04a30bfaa7be6a26e33d7',
          depName:
            '中国电子信息产业集团有限公司-中国软件与技术服务股份有限公司-广州中软信息有限公司（广东省广州市天河区科韵路16号C2栋6~9楼）',
          username: 'secadmin',
          realname: '审计管理员',
          age: 35,
          password:
            '$2a$10$sAq0E1xSi9Bj/CkdKP.2ze6pxuQFg4Yiya1mQOUwUplToYFGEA4oa',
          salt: null,
          avatar: null,
          birthday: '1980-01-02',
          email: 'gzcss@gzcss.net',
          phone: '18566666666',
          status: '1',
          delFlag: '0',
          statusName: '正常',
          createBy: 'e9ca23d68d884d4ebb19d07889727dae',
          createTime: '2021-02-07 10:43:27',
          updateBy: 'ecc1b8809a674ff1910e2c3714ca6493',
          updateTime: '2021-02-07 10:47:29',
          idCard: '440102198001021230'
        },
        {
          id: 'e9ca23d68d884d4ebb19d07889727dae',
          depId: 'c75952f3fad04a30bfaa7be6a26e33d7',
          depName: '广州中软信息有限公司',
          username: 'sysadmin',
          realname: '系统管理员',
          age: 33,
          password:
            '$2a$10$5mqIuytGj44zbE5gSLMN7OF7ePqz4TWXKngLpQby.H7IVrJTI5lwW',
          salt: 'RCGTeGiH',
          avatar: 'user/20190119/logo-2_1547868176839.png',
          birthday: '1980-01-02',
          email: '11@qq.com',
          phone: '18566666666',
          status: '1',
          delFlag: '0',
          statusName: '正常',
          createBy: 'e9ca23d68d884d4ebb19d07889727dae',
          createTime: '2018-12-21 17:54:10',
          updateBy: 'e9ca23d68d884d4ebb19d07889727dae',
          updateTime: '2021-02-07 11:35:37',
          idCard: '440102198001021230'
        }
      ],
      headBtns: [
        {
          title: '新增用户',
          type: 'primary',
          clickFn: this.addNewUser
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.demo {
	position: relative;
	width: 100%;
	height: 50px;
}
</style>
