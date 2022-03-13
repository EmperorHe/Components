<template>
  <div class="error-wrap">
    <div class="err-table">
      <div class="cell">
        <div class="cont"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #fff;
}
.err-table {
	position: relative;
	display: table;
	width: 100%;
	height: 100%;
	.cell {
		position: relative;
		display: table-cell;
		text-align: center;
		vertical-align: middle;
	}
}
.cont {
	position: relative;
	display: inline-block;
	vertical-align: middle;
}
</style>
