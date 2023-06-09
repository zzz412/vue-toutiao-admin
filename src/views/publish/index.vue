<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-form ref="publish-form" :model="article" :rules="formRules" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap lang="zh" v-model="article.content" :extensions="extensions" height="350" placeholder="请输入文章内容"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <el-row :gutter="20">
              <el-col :span="4" v-for="(item, index) in article.cover.type" :key="item">
                <!-- <upload-image @update-cover="onUpdateCover(index, $event)" :img="article.cover.images[index]" /> -->
                <upload-image @update-cover="onUpdateCover(index, $event)" v-model="article.cover.images[index]" />
              </el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import { ElementTiptap, Doc, Text, Paragraph, Heading, Bold, Underline, Italic, Image, Strike, ListItem, BulletList, OrderedList, TodoItem, TodoList, HorizontalRule, Fullscreen, Preview, CodeBlock, TextColor } from 'element-tiptap'
import UploadImage from './components/upload-image.vue'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
export default {
  name: 'PublishIndex',
  components: {
    elTiptap: ElementTiptap,
    UploadImage
  },
  data() {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          // 文章封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      },
      channels: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成 base64 字符串和内容存储在一起，如果需要自定义图片上传
          uploadRequest(file) {
            // 如果接口要求 Content-Type 是 multipart/form-data，则请求体必须使用 FormData
            const fd = new FormData()
            fd.append('image', file)
            // 第1个 return 是返回 Promise 对象
            // 为什么？因为 axios 本身就是返回 Promise 对象
            return uploadImage(fd).then(res => {
              // 这个 return 是返回最后的结果
              return res.data.data.url
            })
          } // 图片的上传方法，返回一个 Promise<url>
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ]
    }
  },
  created() {
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    async loadChannels() {
      const { data } = await getArticleChannels()
      this.channels = data.data.channels
    },
    onPublish(draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return false
        }
        const articleId = this.$route.query.id
        if (articleId) {
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
          })
        }
      })
    },
    async loadArticle() {
      const { data } = await getArticle(this.$route.query.id)
      this.article = data.data
    },
    onUpdateCover(index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang="less"></style>
