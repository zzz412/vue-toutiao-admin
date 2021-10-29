<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="rangeDate" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :default-time="['12:00:00']"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles(1)" :disabled="loading">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">根据筛选条件共查询到 {{ totalCount }} 条结果：</div>
      <!-- 数据列表 -->
      <el-table :data="articles" stripe style="width: 100%" class="list-table" size="mini" v-loading="loading">
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px;" :src="scope.row.cover.images[0]" fit="cover" lazy>
              <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" circle icon="el-icon-edit" type="primary" @click="$router.push('/publish?id=' + scope.row.id.toString())"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->
      <!-- 列表分页 -->
      <el-pagination layout="prev, pager, next" background :current-page.sync="page" :page-size="pageSize" :total="totalCount" :disabled="loading" @current-change="onCurrentChange" />
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  data() {
    return {
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      page: 1,
      totalCount: 0,
      pageSize: 10,
      loading: true, // 表单数据加载的状态
      status: null,
      channels: [],
      channelId: null,
      rangeDate: null
    }
  },
  created() {
    this.loadChannels()
    this.loadArticles()
  },
  methods: {
    async loadArticles(page = 1) {
      this.loading = true
      const { data } = await getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      })
      this.loading = false
      this.articles = data.data.results
      this.totalCount = data.data.total_count
    },
    async loadChannels() {
      const { data } = await getArticleChannels()
      this.channels = data.data.channels
    },
    onCurrentChange(page) {
      this.loadArticles(page)
    },
    onDeleteArticle(articleId) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArticle(articleId.toString()).then(res => {
            // !删除成功更新当前页数据
            this.loadArticles(this.page)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 60px;
  background-size: cover;
}
</style>
