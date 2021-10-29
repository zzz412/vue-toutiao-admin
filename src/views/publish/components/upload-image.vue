<template>
  <div class="upload-image">
    <div class="preview" @click="centerDialogVisible = true">
      <img ref="cover-img" :src="img" class="avatar" />
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </div>
    <!--
      visible 控制对话框的显示和隐藏
     -->
    <el-dialog title="请选择文章封面图片" :visible.sync="centerDialogVisible" width="30%" center append-to-body>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">
          <image-list ref="image-list" :isShowAdd="false" :isShowAction="false" :isShowSelected="true" />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="onFileChange" />
          <img ref="preview-img" src="" width="100" alt="" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '../../image/components/image-list.vue'
export default {
  name: 'UploadImage',
  components: {
    ImageList
  },
  model: {
    prop: 'img',
    event: 'update-cover'
  },
  props: ['img'],
  data() {
    return {
      centerDialogVisible: false,
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    handleClick() {},
    onFileChange() {
      const file = this.$refs.file.files[0]
      this.$refs['preview-img'].src = URL.createObjectURL(file)
      // this.$refs.file.value = ''
    },
    onConfirm() {
      // 如果 tab 是上传图片，并且 input-file 有选择文件，执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          return this.$message('请选择文件')
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          this.centerDialogVisible = false
          this.$refs['cover-img'].src = res.data.data.url
          this.$emit('update-cover', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          return this.$message('请选择封面图片')
        }
        this.centerDialogVisible = false
        this.$emit('update-cover', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped>
.upload-image {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.upload-image .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
