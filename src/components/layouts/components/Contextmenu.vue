<template>
  <a-menu
    v-show="visible"
    :style="style"
    class="contextmenu"
    :selectedKeys="selectedKeys"
    @click="handleClick"
  >
    <a-menu-item v-for="item in itemList" :key="item.key">
      <a-icon v-if="item.icon" role="menuitemicon" :type="item.icon" />
      {{ item.text }}
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: 'Contextmenu',
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    itemList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      target: null,
      selectedKeys: []
    }
  },
  computed: {
    style() {
      return {
        left: this.left + 'px',
        top: this.top + 'px'
      }
    }
  },
  created() {
    window.addEventListener('mousedown', e => this.closeMenu(e))
    window.addEventListener('contextmenu', e => this.setPosition(e))
  },
  methods: {
    closeMenu(e) {
      if (
        ['menuitemicon', 'menuitem'].indexOf(e.target.getAttribute('role')) < 0
      ) {
        this.$emit('update:visible', false)
      }
    },
    setPosition(e) {
      this.left = e.clientX
      this.top = e.clientY
      this.target = e.target
    },
    handleClick({ key }) {
      this.$emit('select', key, this.target)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.contextmenu {
	position: fixed;
	z-index: 1;
	border: 1px solid #9e9e9e;
	border-radius: 4px;
	box-shadow: 2px 2px 10px #aaa !important;
	> .ant-menu-item {
		height: 24px;
		line-height: 24px;
	}
}
</style>
