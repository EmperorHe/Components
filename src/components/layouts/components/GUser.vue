<template>
  <div class="user-wrap">
    <div class="user-fn-wrap">
      <a-dropdown>
        <div class="user-info">
          <button class="user-news" type="button">
            <span class="font_family">&#xe668;</span>
            <span v-if="infoNum - 0 > 0" class="num">{{ infoNum }}</span>
          </button>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  filters: {
    namefilter: function(val) {
      return val ? val.substring(0, 1) : ''
    }
  },
  data() {
    return {
      form: null,
      photo: '',
      infoNum: 0,
      info: [],
      visible: false,
      formLayout: { labelCol: 5, wrapperCol: 17 }
    }
  },
  computed: {
    ...mapGetters([
      'realname',
      'avatar',
      'userId',
      'token',
      'userInfo',
      'loginType'
    ]),
    joinAvatar() {
      return require('@/assets/images/common/avatar-small.jpg')
    }
  },
  created() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
  },
  beforeDestroy() {
    this.onbeforeunload()
  },
  methods: {
    setErrorMessage() {},
    setOnopenMessage() {},
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      if (event.data) {
        const data = JSON.parse(event.data)
        this.infoNum = data.length
        this.info = data
      } else {
        this.infoNum = 0
        this.info = []
      }
    },
    openMsg(item) {
      if (item.redirectUrl) {
        if (item.openType === '0') {
          this.$router.push({
            path: item.redirectUrl,
            query: { processInstanceName: item.subject }
          })
          this.$store.commit('SET_REFRESH', Math.random())
        } else {
          window.open(item.redirectUrl, '_blank')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-wrap {
	position: relative;
	height: 100%;
	color: #fff;
	white-space: nowrap;
}
.user-fn-wrap {
	position: relative;
	display: inline-block;
	height: 100%;
	padding: 0 20px 0 21px;
	vertical-align: middle;
	&::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		display: block;
		width: 1px;
		height: 20px;
		margin: auto 0;
		content: '';
		background-color: rgba(255, 255, 255, 0.4);
	}
	&:first-child::before {
		display: none;
	}
}
.user-info {
	position: relative;
	display: table;
	height: 100%;
	cursor: pointer;
	.cell {
		position: relative;
		display: table-cell;
		vertical-align: middle;
	}
}
.user-name {
	padding-right: 13px;
}
.user-avatar {
	position: relative;
	display: inline-block;
	width: 34px;
	height: 34px;
	overflow: hidden;
	vertical-align: middle;
	background-color: #95aab6;
	border: 1px solid #fff;
	border-radius: 50%;
	img {
		width: 100%;
		height: 100%;
	}
}
.user-news {
	position: relative;
	width: 28px;
	height: 100%;
	color: #fff;
	vertical-align: middle;
	background: transparent;
	&::before {
		display: inline-block;
		width: 0;
		height: 100%;
		overflow: hidden;
		vertical-align: middle;
		content: '';
	}
	.font_family {
		font-size: 20px;
		vertical-align: middle;
	}
	.num {
		position: absolute;
		top: 0;
		left: 16px;
		display: block;
		width: 14px;
		height: 14px;
		font-size: 12px;
		line-height: 14px;
		text-align: center;
		background-color: #eb4339;
		border-radius: 50%;
	}
}
</style>
