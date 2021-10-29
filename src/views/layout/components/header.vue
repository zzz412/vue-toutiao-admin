<template>
  <div class="header-container">
    <div>
      <i
        :class="{
          'el-icon-s-fold': isCollapse,
          'el-icon-s-unfold': !isCollapse
        }"
        @click="$emit('updateIsCollapse', !isCollapse)"
      ></i>
      <span>江苏传智播客科技教育有限公司</span>
    </div>
    <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt="" />
        <span>{{ user.name }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import globalBus from '@/utils/global-bus'
export default {
  name: 'AppHeader',
  components: {},
  model: {
    prop: 'isCollapse',
    event: ['updateIsCollapse']
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    isCollapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    globalBus.$on('update-user', user => {
      this.user.name = user.name
      this.user.photo = user.photo
    })
  },
  methods: {
    onLogout() {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.localStorage.removeItem('user')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
