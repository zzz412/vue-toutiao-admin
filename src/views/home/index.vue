<template>
  <div class="home-container">
    <!-- 用户数据 -->
    <div class="dashboard-user">
      <el-row :gutter="10">
        <el-col :span="15">
          <div class="user-info">
            <img src="@/assets/logo.png" class="user-avatar">
            <div class="info">
              <div>头条视频官方号</div>
              <div class="tips">视频发布</div>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="num">222</div>
          <div class="text">粉丝数</div>
        </el-col>
        <el-col :span="3">
          <div class="num">222</div>
          <div class="text">粉丝数</div>
        </el-col>
        <el-col :span="3">
          <div class="num">222</div>
          <div class="text">粉丝数</div>
        </el-col>
      </el-row>
    </div>
    <!-- 其他数据 -->
    <div class="dashboard-row">
      <el-row :gutter="10">
        <el-col :span="15">
          <!-- 最新图文 -->
          <el-card>
            <div slot="header">
              最新图文
              <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div></div>
          </el-card>
          <!-- 动态 -->
          <el-card>
            <div slot="header">
              动态
              <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <div></div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <!-- 粉丝数据 -->
          <el-card>
            <div slot="header">
              粉丝数据
            </div>
            <div></div>
          </el-card>
          <!-- 图文数据 -->
          <el-card>
            <div slot="header">
              图文数据
            </div>
            <div></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.home-container {
  .dashboard-user {
    background-color: #fff;
    border: 1px solid #e7e7e9;
    padding: 8px;
    .user-info {
      display: flex;
      align-items: center;
      .user-avatar {
        width: 50px;
        border-radius: 50%;
        height: 50px;
      }
      .info {
        margin-left: 10px;
        color: #2c3e50;
        font-size: 14px;
        .tips {
          margin-top: 6px;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .el-col-3 {
      border-right: 1px solid #eee;
      text-align: center;
      margin-top: 4px;
    }
    .el-col-3:last-child {
      border-right: 0px solid #eee;
    }
    .num {
      color: #333;
    }
    .text {
      color: #999;
      font-size: 12px;
      margin-top: 2px;
    }
  }
  .dashboard-row {
    margin-top: 10px;
    .el-card {
      margin-bottom: 10px;
      height: 300px;
      & /deep/ .el-card__header {
        padding: 6px 20px;
        background-color: #fbfbfb;
      }
    }
  }
}
</style>
