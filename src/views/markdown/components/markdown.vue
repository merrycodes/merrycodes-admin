<template>
  <div class="app-container">
    <el-form ref="blogForm" :model="blogForm" :rules="rules" label-position="top">
      <input
        ref="importMd"
        style="display : none"
        type="file"
        accept=".md"
        @change="importMd($event)"
      >
      <el-row :gutter="30">
        <el-col :xs="24" :sm="16" :md="19" :lg="19">
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput v-model="blogForm.title" :maxlength="100">标题</MDinput>
          </el-form-item>
          <el-form-item prop="mdContent">
            <mavon-editor
              id="md"
              ref="md"
              v-model="blogForm.mdContent"
              :autofocus="false"
              :toolbars="toolbars"
              :code-style="'atom-one-dark'"
              :class="[zIndex ? 'full-height' : 'z-index-1']"
              class="mavonEditor"
              :image-click="imageClick"
              :xss-options="xssOptions"
              @change="onChange"
              @imgAdd="imgUpload"
              @fullScreen="mdScreenChange"
            >
              <template slot="right-toolbar-before">
                <button
                  type="button"
                  class="op-icon icon-powerpoint"
                  aria-hidden="true"
                  :title="`添加预览标签`"
                  @click="addSummary"
                />
              </template>
            </mavon-editor>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="8" :md="5" :lg="5">
          <el-form-item
            label-width="120px"
            label="分类:"
            class="postInfo-container-item"
            prop="category"
          >
            <el-select
              v-model="blogForm.category"
              filterable
              default-first-option
              clearable
              :popper-append-to-body="false"
              popper-class="z-index-9"
              placeholder="请选择"
            >
              <el-option v-for="item in categoryList" :key="item" :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item label-width="120px" label="标签:" class="postInfo-container-item" prop="tags">
            <el-select
              v-model="articleTag"
              filterable
              default-first-option
              clearable
              multiple
              :popper-append-to-body="false"
              popper-class="z-index-9"
              placeholder="请选择"
              @change="blogForm.tags = articleTag"
            >
              <el-option v-for="item in tagsList" :key="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item align="center">
            <el-switch
              v-model="blogForm.allowComment"
              active-color="#13ce66"
              active-text="开启评论"
              inactive-text="关闭"
            />
          </el-form-item>
          <el-form-item align="center">
            <el-row type="flex" justify="space-around">
              <el-col :span="9">
                <el-button size="small" @click="$refs.importMd.click()">
                  <span class="el-icon--left">
                    <i class="icon-upload" aria-hidden="true" />
                  </span>
                  导入md
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-button size="small" @click="saveMd">
                  <span class="el-icon--left">
                    <i class="icon-download" aria-hidden="true" />
                  </span>
                  导出md
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item align="center">
            <el-row type="flex" justify="space-around">
              <el-col :span="9">
                <el-button
                  v-if="checkPermission(['ADMIN'])"
                  type="success"
                  size="small"
                  @click="onSave"
                >
                  <span class="el-icon--left">
                    <i class="icon-plane" aria-hidden="true" />
                  </span>
                  保存
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-button
                  v-if="checkPermission(['ADMIN'])"
                  type="primary"
                  size="small"
                  @click="onRelease"
                >
                  <span class="el-icon--left">
                    <i class="icon-floppy" aria-hidden="true" />
                  </span>
                  发布
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="操作"
      :visible.sync="dialogVisible"
      width="15%"
      center
      top="25vh"
      :before-close="(action) => {tempEle = null; action()}"
    >
      <el-row type="flex" justify="center" style="margin-top: 5px; margin-bottom: 10px;">
        <el-button
          type="danger"
          size="medium"
          round
          plain
          icon="el-icon-delete"
          @click="handleDelete(tempEle.alt,tempEle.src,true)"
        >删除图片</el-button>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 5px; margin-bottom: 10px;">
        <el-button
          type="info"
          size="medium"
          round
          plain
          icon="el-icon-search"
          @click="previewImage(tempEle.src)"
        >浏览图片</el-button>
      </el-row>
    </el-dialog>

    <transition name="fade">
      <div v-if="imageUrl" class="previewImage" @click="imageUrl=null">
        <img :src="imageUrl" alt="none">
      </div>
    </transition>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { saveArticle, getArticle, imgUpload, imgDelete } from '@/api/article'
import { tagsListByStaus } from '@/api/tags'
import { categoryListByStaus } from '@/api/category'
import { mavonEditor } from 'mavon-editor'
import MDinput from '@/components/MDinput'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'Edit',
  components: {
    mavonEditor,
    MDinput
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: null,
      tempEle: null,
      dialogVisible: false,
      tagsList: null,
      categoryList: null,
      zIndex: false,
      articleTag: [],
      submitting: false,
      // 防止XSS攻击，配置参考：https://github.com/leizongmin/js-xss/blob/master/README.zh.md
      xssOptions: [],
      // 表单数据
      blogForm: {
        id: '',
        title: '',
        tags: [],
        status: '',
        category: '',
        allowComment: '',
        htmlContent: '',
        mdContent: '',
        summaryContent: ''
      },
      tempRoute: {},
      // 简单得表单验证
      rules: {
        title: {
          required: true,
          message: '请输入文章标题',
          trigger: 'blur'
        },
        category: {
          required: true,
          message: '请选择文章分类',
          trigger: 'change'
        },
        tags: {
          required: true,
          message: '请选择文章标签',
          trigger: 'change'
        },
        mdContent: {
          required: true,
          message: '请输入文章内容',
          trigger: 'blur'
        }
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        undo: true, // 上一步
        redo: true, // 下一步
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    }
  },
  activated() {
    this.getTagsList()
    this.getcategoryList()
  },
  created() {
    this.getTagsList()
    this.getcategoryList()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchArticle(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    const md = document.getElementById('md')
    md.addEventListener('dragenter', this.onDrag, false)
    md.addEventListener('dragover', this.onDrag, false)
    md.addEventListener('drop', this.onDrop, false)
  },
  methods: {
    checkPermission,
    // 导出md
    saveMd() {
      const { title, mdContent } = this.blogForm
      this.$util.saveMd(title, mdContent)
    },
    // 导入md
    importMd(event) {
      const selectedFile = event.target.files[0]
      this.$util.importMd(selectedFile, this)
    },
    // 拖动文件阻止默认事件
    onDrag(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    onDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      // 拖动md文件导入
      const selectedFile = e.dataTransfer.files[0]
      this.$util.importMd(selectedFile, this)
    },
    addSummary() {
      const $vm = this.$refs.md
      const summaryFlag = {
        prefix: '<!-- ',
        subfix: ' -->',
        str: 'read more'
      }
      $vm.insertText($vm.getTextareaDom(), summaryFlag)
    },
    mdScreenChange(e) {
      this.zIndex = e
    },
    onChange(value, render) {
      this.blogForm.mdContent = value
      this.blogForm.htmlContent = render
    },
    // 发布文章
    onRelease() {
      const { status } = this.blogForm
      this.blogForm.status = status !== 1 ? 1 : status
      this.submitArticle('blogForm', () => {
        this.$util.notification.success('文章发布成功！')
        this.$router.push({ path: '/aritcle' })
      })
    },
    // 保存文章
    onSave() {
      const { status } = this.blogForm
      this.blogForm.status = typeof status === 'number' ? status : 0
      this.submitArticle('blogForm', () => {
        this.$util.notification.success('保存文章成功！')
        this.$router.push({ path: '/aritcle' })
      })
    },
    // 提交
    submitArticle(formName, action) {
      if (this.submitting) {
        this.$util.notification.error('请不要提交过快!')
        return
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { htmlContent } = this.blogForm
          this.submitting = true
          // 标签转换成字符串
          this.blogForm = { ...this.blogForm, tags: this.articleTag.join(), summaryContent: this.$util.getSummary(htmlContent) }
          try {
            await saveArticle(this.blogForm)
            action()
            this.submitting = false
          } catch (e) {
            this.submitting = false
          }
        }
      })
    },
    // 获取文章详情
    async fetchArticle(id) {
      try {
        const { data } = await getArticle(id)
        this.blogForm = data
        this.articleTag = data.tags.split(',')
        this.setTagsViewTitle()
        this.setPageTitle()
      } catch (e) {
        this.$router.back(-1)
      }
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.blogForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑文章'
      document.title = `${title} - ${this.blogForm.id}`
    },
    async getTagsList() {
      this.tagsList = (await tagsListByStaus()).data
    },
    async getcategoryList() {
      this.categoryList = (await categoryListByStaus()).data
    },
    // 上床图片操作
    async imgUpload(url, file) {
      var formdata = new FormData()
      formdata.append('image', file)
      try {
        const { message } = await imgUpload(formdata)
        this.$refs.md.$img2Url(url, message)
      } catch (e) {
        this.handleDelete(file._name, url, false)
      }
    },
    // 删除图片操作
    async handleDelete(description, url, serve) {
      this.$refs.md.$refs.toolbar_left.$imgDelByFilename(description)
      if (serve) {
        var key = url.substring(url.lastIndexOf('/') + 1)
        await imgDelete(key)
      }
      const reg = new RegExp(`\\!\\[${description}\\]\\(${url}\\)`, 'g')
      this.blogForm.mdContent = this.blogForm.mdContent.replace(reg, '')
      this.dialogVisible = false
    },
    // 浏览图片
    previewImage(url) {
      this.imageUrl = url
      this.dialogVisible = false
    },
    // 点击图片
    imageClick(ele) {
      this.dialogVisible = true
      this.tempEle = ele
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/icon.css';

// 解决 md 覆盖 navbar
.z-index-1 {
  z-index: 1 !important;
}

// 解决 el-select 下拉框覆盖 navbar
/deep/.z-index-9 {
  z-index: 8 !important;
}

// 解决 md 全屏时没有完全覆盖在最顶层和高度没有100%
.full-height {
  z-index: 9999;
  height: 100% !important;
}

/deep/.el-dialog--center {
  .el-dialog__header {
    padding: 15px 25px 0px !important;
  }
  .el-dialog__body {
    // text-align: center !important;
    padding: 5px 25px 10px !important;
  }
}

#md {
  width: 100%;
  height: 750px;
}

.previewImage {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1600;
  transition: all 0.1s linear 0s;
  img {
    flex: 0 0 auto;
    z-index: 3;
  }
}
</style>
