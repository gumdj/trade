<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <strong>商店管理系统</strong>
      </el-header>
      <el-main>
        <div style="margin: 0 10px;">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "./inc/SideMenu"

export default {
  name: "Home",
  components: {
    SideMenu
  },
  comments: {
    SideMenu
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}
.el-header {
  background-color: #545C64;
  color: #FFF;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  line-height: 160px;
  padding: 0 !important;
}
</style>