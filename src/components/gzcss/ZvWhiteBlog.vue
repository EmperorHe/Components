<template>
  <div ref="blogWrap" class="zv-white-blog-wrap" :style="{ padding: padding }">
    <div v-if="startCrumbs" ref="crumbs" class="zv-white-blog-crumbs">
      <a-breadcrumb separator=">">
        <a-breadcrumb-item v-for="(o, i) in crumbs" :key="o.url">
          <router-link v-if="i >= startCrumbs - 1 && o.ok" :to="o.url" replace>{{ o.title }}</router-link>
          <span v-else-if="i >= startCrumbs - 1">{{ o.title }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div
      class="zv-white-blog"
      :class="{
        'has-head': hasTitle
      }"
    >
      <!--   头部标题区域   -->
      <div v-if="hasTitle" ref="blogHeader" class="zv-white-blog-header-head">
        <div ref="blog-table" class="zv-white-blog-table">
          <div
            class="zv-white-blog-cell"
            :class="{ 'zv-white-blog-back-wrap': hasBackBtn }"
            :style="titleW !== 0 ? { width: `${titleW}px` } : {}"
          >
            <div v-if="hasBackBtn" class="zv-white-blog-back" @click="goBack()">
              <a-icon class="back-icon" type="arrow-left" />
            </div>
            <div v-if="isFormalTitle" class="zv-white-blog-title">
              <span class="zv-white-blog-t zv-font-16">{{ title }}</span>
            </div>
            <slot v-else-if="isSlotTitle" name="headTitle"></slot>
            <div v-else-if="isTabTitle" class="zv-white-blog-tabs">
              <div class="zv-white-blog-tabs-wrap">
                <a-tabs
                  :default-key="tabCurKey"
                  @change="tabChange"
                  @tabClick="tabClick"
                >
                  <a-tab-pane
                    v-for="item in titleTabs"
                    :key="item.key"
                    :tab="item.tab"
                  />
                </a-tabs>
              </div>
            </div>
          </div>
          <div ref="handle" class="zv-white-blog-handle">
            <slot name="headHandle"></slot>
          </div>
        </div>
      </div>
      <!--   头部tab区域   -->
      <div
        v-if="hasContTab"
        ref="blogTab"
        class="zv-white-blog-header-tab"
        :style="{ paddingTop: $slots.headContent ? '16px' : '' }"
      >
        <!--   位于标题与tab栏之间的插槽（不随区域滚动）    -->
        <slot name="headContent"></slot>
        <div ref="tab-wrap" class="zv-white-blog-cont-tab-head">
          <div
            class="zv-white-blog-cont-tab-wrap"
            :style="tabTitleW !== 0 ? { width: `${tabTitleW}px` } : {}"
          >
            <a-tabs
              :default-key="tabCurKey"
              @change="tabChange"
              @tabClick="tabClick"
            >
              <a-tab-pane
                v-for="item in titleTabs"
                :key="item.key"
                :forceRender="true"
                :tab="item.tab"
              />
            </a-tabs>
          </div>
          <div
            v-if="$slots.tabHandle"
            ref="tab-handle"
            class="zv-white-blog-cont-tab-handle"
          >
            <slot name="tabHandle"></slot>
          </div>
        </div>
      </div>
      <!--   中间可滚动内容区域   -->
      <div
        ref="blogContent"
        class="zv-white-blog-cont"
        :style="{
          borderRadius: borderRadius
        }"
      >
        <template v-if="isDefaultContSlot">
          <slot></slot>
        </template>
        <!-- 一个标题，多个tab页签的情况 -->
        <template v-else-if="isFormalTitleContSlot">
          <div class="zv-white-blog-inside">
            <div class="zv-white-blog-cont-mode">
              <template v-for="item in titleTabs">
                <!-- 未点击tab页不进行预加载，且加载后缓存页面 -->
                <div
                  v-if="isAllRender || tabKeys.includes(item.key)"
                  :key="item.key"
                  class="zv-white-blog-cont-tab"
                  :class="{ 'zv-white-blog-cont-hide': item.key !== tabCurKey }"
                >
                  <slot :name="item.slot"></slot>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="isTabTitleContSlot">
          <template v-for="item in titleTabs">
            <!-- 未点击tab页不进行预加载，且加载后缓存页面 -->
            <div
              v-if="isAllRender || tabKeys.includes(item.key)"
              :key="item.key"
              class="zv-white-blog-cont-tab"
              :class="{ 'zv-white-blog-cont-hide': item.key !== tabCurKey }"
            >
              <slot :name="item.slot"></slot>
            </div>
          </template>
        </template>
      </div>
      <!--   底部按钮/自定义区域   -->
      <div v-if="hasFooter" ref="blogFooter" class="zv-white-blog-footer">
        <slot name="footer">
          <div class="zv-white-blog-footer-btn">
            <template v-for="(item, index) in footerBtnItems">
              <zv-button
                v-show="item.show == undefined ? true : item.show"
                :key="index"
                :useAntBtn="true"
                :type="item.type"
                size="large"
                :disabled="item.disabled"
                :loading="item.loading"
                @click="item.click"
              >{{ item.text }}</zv-button>
            </template>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 容器内边距
    padding: {
      type: String,
      default() {
        return '18px 20px 20px'
      }
    },
    // 标题
    title: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否有返回按钮
    hasBackBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    // tab类型的title
    titleTabs: {
      type: Array,
      default() {
        return []
      }
    },
    // true内容为多个tab,false标题为多个tab
    isContTab: {
      type: Boolean,
      default() {
        return false
      }
    },
    // tab状态下默认选中的key
    tabCurKey: {
      type: [String, Number, null]
    },
    // 是否一次性加载所有tab页
    isAllRender: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否最小高度铺满展示区域
    isFullScreen: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 是否始终铺满展示区域
    isAlwaysFullScreen: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 底部按钮
    footerBtnItems: {
      type: [Array, null],
      default() {
        return null
      }
    },
    // 是否显示面包屑
    startCrumbs: {
      type: [Number, undefined],
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      tabKeys: [this.tabCurKey],
      titleW: 0,
      tabTitleW: 0,
      observer: null,
      timer: null
    }
  },
  computed: {
    // 是否为多页面
    multipage() {
      return this.$store.state.app.multipage
    },
    // 是否具有标题栏
    hasTitle() {
      return (
        this.title.length > 0 ||
        this.$slots.headTitle ||
        (this.titleTabs.length > 0 && !this.isContTab)
      )
    },
    // 是否具有底部栏
    hasFooter() {
      return this.$slots.footer || this.footerBtnItems
    },
    // 是否为普通标题
    isFormalTitle() {
      return (
        (!this.$slots.headTitle && !this.titleTabs.length) ||
        (this.title.length > 0 && this.isContTab)
      )
    },
    // 是否为tab标题
    isTabTitle() {
      return !this.$slots.headTitle && this.titleTabs.length && !this.isContTab
    },
    // 是否为插槽标题
    isSlotTitle() {
      return (
        (this.$slots.headTitle && !this.titleTabs.length) ||
        (this.$slots.headTitle && this.isContTab)
      )
    },
    // 是否拥有内容区tab栏
    hasContTab() {
      return this.titleTabs.length && this.isContTab
    },
    // 是否为默认内容插槽
    isDefaultContSlot() {
      return this.$slots.default && !this.titleTabs.length
    },
    // 是否为普通标题+多个tab页签内容插槽
    isFormalTitleContSlot() {
      return !this.$slots.default && this.isContTab && this.titleTabs.length
    },
    // 是否为tab栏类型标题+默认插槽
    isTabTitleContSlot() {
      return !this.$slots.default && !this.isContTab && this.titleTabs.length
    },
    // 根据页面配置设置中间内容区域圆角
    borderRadius() {
      if (this.hasTitle && this.hasFooter) {
        return '0'
      } else if (this.hasTitle) {
        return '0 0 6px 6px'
      } else if (this.hasFooter) {
        return '6px 6px 0 0'
      } else {
        return '6px'
      }
    },
    // 面包屑数据
    crumbs() {
      return this.$route.meta.crumbs
    }
  },
  mounted() {
    // 页面初次挂载设置尺寸
    this.$nextTick(() => {
      this.setContentSize()
      this.listenSize()
    })
  },
  beforeDestroy() {
    // 组件销毁前结束监听
    if (this.isAlwaysFullScreen) {
      this.observer.disconnect()
    }
  },
  methods: {
    // 监听元素尺寸变化（浏览器窗口变化或异步数据改变使得监听元素尺寸变化）
    listenSize() {
      // 只有始终占满屏幕才需监听
      if (this.isAlwaysFullScreen) {
        this.observer = new ResizeObserver(() => {
          this.$nextTick(() => {
            this.setContentSize()
          })
        })
        // 如果有title栏
        if (this.hasTitle) {
          this.observer.observe(this.$refs.blogHeader)
        }
        // 如果有tab栏
        if (this.hasContTab) {
          this.observer.observe(this.$refs.blogTab)
        }
        // 如果有footer栏
        if (this.hasFooter) {
          this.observer.observe(this.$refs.blogFooter)
        }
        this.observer.observe(document.body)
      }
    },
    // 设置尺寸
    setContentSize() {
      const blogContent = document.getElementsByClassName(
        'zv-white-blog-cont'
      )[0]
      // 是否始终充满展示区域，超出部分内部滚动
      if (this.isAlwaysFullScreen) {
        const contentHeight = this.contentHeight() // 写在内层避免多余开销
        blogContent.style.height = contentHeight
        blogContent.style.minHeight = 'none'
        blogContent.style.overflow = 'auto'
        blogContent.style.position = 'relative'
      } else if (this.isFullScreen) {
        // 是否最小高度充满展示区域，超出部分外部滚动
        const contentHeight = this.contentHeight() // 写在内层避免多余开销
        blogContent.style.height = 'auto'
        blogContent.style.minHeight = contentHeight
        this.setTitleWidth(1)
      }
      // 是否为内容区tab且具有操作区域
      if (this.isContTab && this.$slots.tabHandle) {
        this.setTitleWidth(2)
      }
    },
    // 设置标题区域宽度
    setTitleWidth(type) {
      if (type === 1) {
        const w = this.$refs['blog-table']
          ? this.$refs['blog-table'].offsetWidth
          : 0
        const handleW = this.$refs['handle']
          ? this.$refs['handle'].offsetWidth
          : 0
        this.titleW = w - handleW - 2
      } else {
        const w = this.$refs['tab-wrap']
          ? this.$refs['tab-wrap'].offsetWidth
          : 0
        const handleW = this.$refs['tab-handle']
          ? this.$refs['tab-handle'].offsetWidth
          : 0
        this.tabTitleW = w - handleW - 2
      }
    },
    // 计算滚动区域高度
    contentHeight() {
      const headHeight = this.hasTitle ? this.$refs.blogHeader.offsetHeight : 0
      const tabHeight = this.hasContTab ? this.$refs.blogTab.offsetHeight : 0
      const crumbsHeight = this.startCrumbs ? this.$refs.crumbs.offsetHeight : 0
      const footerHeight = this.hasFooter
        ? this.$refs.blogFooter.offsetHeight
        : 0
      console.log(headHeight, tabHeight, footerHeight)
      const fixedHeight = headHeight + tabHeight + footerHeight + crumbsHeight + 90
      return `${document.documentElement.clientHeight - fixedHeight}px`
    },
    goBack() {
      this.$router.go(-1)
    },
    // tab标题下tab改变的回调
    tabChange(key) {
      // 未点击tab页不进行预加载，且加载后缓存页面
      if (!this.tabKeys.includes(key)) {
        this.tabKeys.push(key)
      }
      this.$emit('update:tabCurKey', key)
      this.$emit('tabChange', key)
    },
    // tab标题下点击了tab的回调
    tabClick() {
      this.$emit('tabClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.zv-white-blog-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}
.zv-white-blog {
	position: relative;
	width: 100%;
	height: 100%;
	&.has-head {
		padding-top: 53px;
	}
}
.zv-white-blog-header-head {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 53px;
	padding: 0 20px;
	background-color: #fff;
	border-bottom: 1px solid #e4e4e4;
	border-radius: 6px 6px 0 0;
}
.zv-white-blog-crumbs {
	position: relative;
	height: 12px;
	margin-top: 0;
	line-height: 16px;
	.ant-breadcrumb {
		position: absolute;
		top: -11px;
		left: 0;
		line-height: 16px;
	}
	::v-deep {
		.ant-breadcrumb-link {
			span {
				font-size: 12px;
				line-height: 16px;
				color: #999;
			}
			a {
				font-size: 12px;
				line-height: 16px;
				color: #999;
				&:hover {
					color: $primary-color;
				}
			}
		}
		.ant-breadcrumb > span:last-child a {
			color: #333;
		}
	}
}
.zv-white-blog-tabs {
	padding-top: 1px;
	::v-deep {
		.ant-tabs-bar {
			margin-bottom: 0;
			border-bottom-color: transparent;
		}
		.ant-tabs-nav {
			.ant-tabs-tab {
				padding: 16px;
			}
		}
	}
}
.zv-white-blog-table {
	position: relative;
	width: 100%;
	height: 100%;
	&::after {
		position: relative;
		display: block;
		width: 0;
		height: 0;
		clear: both;
		content: '';
	}
}
.zv-white-blog-cell {
	position: relative;
	float: left;
	height: 100%;
	&.zv-white-blog-back-wrap {
		padding-left: 55px;
	}
}
.zv-white-blog-cont-tab-wrap,
.zv-white-blog-title {
	position: relative;
	float: left;
	width: 100%;
	height: 100%;
	white-space: nowrap;
}
.zv-white-blog-back {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	height: 24px;
	padding-right: 18px;
	margin: auto 0;
	line-height: 27px;
	cursor: pointer;
	border-right: 1px solid #d8d8d8;
}
.back-icon {
	font-size: 20px;
	color: $primary-color;
}
.zv-white-blog-t {
	position: relative;
	font-weight: bold;
	line-height: 52px;
}
.zv-white-blog-cont-tab-handle,
.zv-white-blog-handle {
	position: relative;
	float: right;
	height: 100%;
	padding-left: 20px;
}
.zv-white-blog-cont {
	position: relative;
	width: 100%;
	overflow: auto;
	background-color: #fff;

	/* !*min-height: 100%;*! 已用根据情况作判断，这里不要设置该属性 */
	border-radius: 0 0 6px 6px;
}
.zv-white-blog-cont-tab {
	position: relative;
	width: 100%;
	height: auto;
	padding-top: 24px;
}
.zv-white-blog-cont .has-height.zv-table-wrap {
	min-height: 700px;
}
.zv-white-blog-cont-tab-head {
	position: relative;
	width: 100%;
	padding: 0;
	border-bottom: 1px solid #e6e9ea;
	&::after {
		position: relative;
		display: block;
		width: 0;
		height: 0;
		clear: both;
		content: '';
	}
	::v-deep {
		.ant-tabs-bar {
			margin-bottom: 0;
			border-bottom-color: transparent;
		}
		.ant-tabs-nav .ant-tabs-tab {
			padding: 13px 8px 6px;
		}
		.ant-tabs-tab-prev-icon,
		.ant-tabs-tab-next-icon {
			padding-top: 6px;
		}
	}
}
.zv-white-blog-cont-tab-handle {
	padding-top: 11px;
}
.zv-white-blog-inside {
	position: relative;
	width: 100%;
	padding: 0 24px;
}
.zv-white-blog-header-tab {
	padding: 0 16px;
	background: #fff;
}
.zv-white-blog-footer {
	position: relative;
	padding: 20px 24px 24px;
	background: #fff;
	border-radius: 0 0 6px 6px;
}
.zv-white-blog-footer-btn {
	width: 100%;
	text-align: center;
	::v-deep {
		.zv-special-button-span {
			margin: 0 4px;
		}
	}
}
.zv-white-blog-cont-mode {
	position: relative;
}
.zv-white-blog-cont-hide {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -9999;
	width: 100%;
	max-height: 100%;
	overflow: hidden;
	opacity: 0;
}
</style>
