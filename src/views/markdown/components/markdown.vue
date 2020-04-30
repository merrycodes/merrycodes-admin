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
              v-model="blogForm.mdContent"
              :autofocus="false"
              :toolbars="toolbars"
              :code-style="'atom-one-dark'"
              :class="[zIndex ? 'full-height' : 'z-index-1']"
              class="mavonEditor"
              @change="onChange"
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
                <el-button type="success" size="small" @click="onSave">
                  <span class="el-icon--left">
                    <i class="icon-plane" aria-hidden="true" />
                  </span>
                  保存
                </el-button>
              </el-col>
              <el-col :span="9">
                <el-button type="primary" size="small" @click="onRelease">
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
  </div>
</template>

<script>
import { saveArticle, getArticle } from '@/api/article'
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
      tagsList: null,
      categoryList: null,
      tagsStaus: false,
      categoryStaus: false,
      zIndex: false,
      articleTag: [],
      submitting: false,
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
  watch: {
    '$store.getters.tagsStaus'() {
      this.tagsStaus = this.$store.getters.tagsStaus
    },
    '$store.getters.categoryStaus'() {
      this.categoryStaus = this.$store.getters.categoryStaus
    },
    tagsStaus() {
      if (this.tagsStaus) {
        this.getTagsList()
        this.$store.dispatch('constant/reloadTags', false)
      }
    },
    categoryStaus() {
      if (this.categoryStaus) {
        this.getTagsList()
        this.$store.dispatch('constant/reloadCategory', false)
      }
    }
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
      this.blogForm.mdContent += '<!-- read more -->'
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
      const _this = this
      const { status } = this.blogForm
      this.blogForm.status = status !== 1 ? 1 : status
      this.submitArticle('blogForm', function(data) {
        _this.$util.notification.success('文章发布成功！')
        // todo 跳转到列表文章页面
        _this.$router.push({ path: '/aritcle' })
        _this.$store.dispatch('constant/updateReload', true)
      })
    },
    // 保存文章
    onSave() {
      const _this = this
      const { status } = this.blogForm
      this.blogForm.status = typeof status === 'number' ? status : 0
      this.submitArticle('blogForm', function(data) {
        _this.$util.notification.success('保存文章成功！')
        // todo 跳转到列表文章页面
        _this.$router.push({ path: '/aritcle' })
        _this.$store.dispatch('constant/updateReload', true)
      })
    },
    // 提交
    submitArticle(formName, action) {
      if (this.submitting) {
        this.$util.notification.error('请不要提交过快!')
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { htmlContent } = this.blogForm
          this.submitting = true
          // 标签转换成字符串
          this.blogForm.tags = this.articleTag.join()
          this.blogForm.summaryContent = this.$util.getSummary(htmlContent)
          saveArticle(this.blogForm)
            .then(response => {
              action(response.data)
              this.submitting = false
            })
            .catch(err => {
              console.log(err)
              this.submitting = false
            })
        }
      })
    },
    // 获取文章详情
    fetchArticle(id) {
      getArticle(id)
        .then(res => {
          const { tags } = res.data
          this.blogForm = res.data
          this.articleTag = tags.split(',')
          this.setTagsViewTitle()
          this.setPageTitle()
        })
        .catch(err => {
          console.log(err)
        })
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
    getTagsList() {
      tagsListByStaus().then(res => {
        this.tagsList = res.data
      })
    },
    getcategoryList() {
      categoryListByStaus().then(res => {
        this.categoryList = res.data
      })
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

#md {
  width: 100%;
  height: 750px;
}
</style>
