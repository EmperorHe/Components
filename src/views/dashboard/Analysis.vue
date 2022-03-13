<template>
  <div>
    <zv-white-blog title="首页">
      <div class="home-container">

        <p class="fifties">首页待开发中......</p>
      </div>
    </zv-white-blog>
  </div>
</template>

<script>
export default {
  name: 'Analysis',
  data() {
    return {

    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>

@import url(https://fonts.googleapis.com/css?family=Press+Start+2P);

@import url(https://fonts.googleapis.com/css?family=Lobster+Two:700italic);

p {
  padding: 2em 2rem;
  text-align: center;
  height: 100%;
}

$blue: #33bbd6;
.fifties {
  font-family: lobster two;
  // background: $blue;
  color: $blue;
  text-shadow: 0 8px 0 darken(white, 9);
  font-size: 8rem;
  padding: 1em 2rem;
}

</style>
