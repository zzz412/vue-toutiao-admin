<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论管理</span>
      </div>
      <el-table class="table-list" :data="articles" style="width: 100%" stripe>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"> </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"> </el-table-column>
        <el-table-column prop="address" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status" active-color="#13ce66" inactive-color="#ff4949" :disabled="scope.row.statusDisabled" @change="onStatusChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data() {
    return {
      articles: [],
      totalCount: 0,
      pageSize: 10,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles()
  },
  methods: {
    loadArticles(page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    async onStatusChange(article) {
      // 禁用
      article.statusDisabled = true
      try {
        await updateCommentStatus(article.id.toString(), article.comment_status)
        this.$message({
          type: 'success',
          message: `${article.comment_status ? '启用' : '关闭'}成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('操作失败')
      }
      article.statusDisabled = false
    },
    handleSizeChange() {
      this.loadArticles(1)
    },
    handleCurrentChange(page) {
      this.loadArticles(page)
    }
  }
}
</script>

<style scoped></style>
