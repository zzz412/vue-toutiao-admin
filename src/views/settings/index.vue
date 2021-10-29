<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :updateProfileLoading="updateProfileLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
          <p @click="$refs.file.click()">点击修改头像</p>
          <input type="file" hidden ref="file" @change="onFileChange" />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="修改头像" :visible.sync="dialogVisible" width="30%" append-to-body @opened="onDialogOpend" @closed="onDialogClosed">
      <div class="preview-image-wrap">
        <img class="piw-img" ref="piw-img" :src="previewImage" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'SettingsIndex',
  components: {},
  data() {
    return {
      user: {
        id: null,
        email: '',
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false,
      previewImage: '',
      updatePhotoLoading: false,
      updateProfileLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser()
  },
  mounted() {},
  methods: {
    async onUpdateUser() {
      const { name, intro, email } = this.user
      this.updateProfileLoading = true
      try {
        await updateUserProfile({ name, intro, email })
        globalBus.$emit('update-user', this.user)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } catch (e) {}
      this.updateProfileLoading = false
    },
    async loadUser() {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange() {
      const file = this.$refs.file
      this.previewImage = URL.createObjectURL(file.files[0])
      this.dialogVisible = true
      this.$refs.file.value = ''
    },
    onDialogOpend() {
      // 裁切区域不更新的 2 种解决办法
      // !#1 方法 1
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      const img = this.$refs['piw-img']
      this.cropper = new Cropper(img, {
        viewMode: 1,
        dragMode: 'none',
        aspectRatio: 1,
        cropBoxResizable: false,
        background: false
      })
    },
    onDialogClosed() {
      // !#2 方法 2
      // 对话框关闭销毁裁切器
      // this.cropper.destroy()
    },
    onUpdatePhoto() {
      this.updatePhotoLoading = true
      // 1. 获取裁切数据
      this.cropper.getCroppedCanvas().toBlob(async file => {
        const fd = new FormData()
        fd.append('photo', file)
        try {
          // 2. 请求更新头像
          // const { data } = await updateUserPhoto(fd)
          await updateUserPhoto(fd)
          // 3. 更新视图显示
          // this.user.photo = data.data.photo
          this.user.photo = URL.createObjectURL(file) // 快一些

          globalBus.$emit('update-user', this.user)
          this.$message({
            type: 'success',
            message: '更新用户头像成功'
          })
        } catch (e) {}
        // 4. 关闭对话框呀
        this.dialogVisible = false
        this.updatePhotoLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.preview-image-wrap {
  .piw-img {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
