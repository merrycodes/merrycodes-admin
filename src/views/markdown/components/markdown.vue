<template>
  <div class="app-container">
    <el-form ref="blogForm" :model="blogForm" :rules="rules" label-position="top">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="blogForm.title" :maxlength="100">标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
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
                      style="width:500px;"
                      placeholder="请选择"
                    >
                      <el-option v-for="item in options" :key="item.value" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    label="标签:"
                    class="postInfo-container-item"
                    prop="tags"
                  >
                    <el-select
                      v-model="articleTag"
                      filterable
                      default-first-option
                      clearable
                      multiple
                      :popper-append-to-body="false"
                      popper-class="z-index-9"
                      style="width:500px;"
                      placeholder="请选择"
                      @change="blogForm.tags = articleTag"
                    >
                      <el-option v-for="item in options" :key="item.value" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-form-item prop="mdContent">
        <mavon-editor
          id="md"
          v-model="blogForm.mdContent"
          :autofocus="false"
          :code-style="'atom-one-dark'"
          :class="[zIndex ? 'full-height' : 'z-index-1']"
          class="mavonEditor"
          @save="onSave"
          @change="onChange"
          @fullScreen="mdScreenChange"
        >
          <template slot="left-toolbar-after">
            <button
              type="button"
              class="op-icon fa fa-paper-plane"
              aria-hidden="true"
              :title="`发布文章`"
              @click="onRelease"
            />
          </template>
          <template slot="right-toolbar-before">
            <button
              type="button"
              class="op-icon fa fa-upload"
              aria-hidden="true"
              :title="`导入md`"
              @click="$refs.importMd.click()"
            />
            <button
              type="button"
              class="op-icon fa fa-download"
              aria-hidden="true"
              :title="`导出md`"
              @click="saveMd"
            />
            <button
              type="button"
              class="op-icon fa fa-file-powerpoint-o"
              aria-hidden="true"
              :title="`添加预览标签`"
              @click="addSummary"
            />
            <input
              ref="importMd"
              style="display : none"
              type="file"
              accept=".md"
              @change="importMd($event)"
            >
          </template>
        </mavon-editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveArticle, getArticle } from '@/api/article'
import { mavonEditor } from 'mavon-editor'
import MDinput from '@/components/MDinput'
import 'mavon-editor/dist/css/index.css'
import 'font-awesome/css/font-awesome.css'

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
      zIndex: false,
      articleTag: [],
      submitting: false,
      // 在没有输入标题情况下导出默认名字为 article
      outputMdFileName: 'article',
      // 表单数据
      blogForm: {
        id: '',
        title: '',
        tags: [],
        status: '',
        category: '',
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
      options: [
        {
          value: 'Apple',
          label: 'Apple'
        },
        {
          value: 'Banana',
          label: 'Banana'
        },
        {
          value: 'Orange',
          label: 'Orange'
        },
        {
          value: 'Pear',
          label: 'Pear'
        },
        {
          value: 'Strawberry',
          label: 'Strawberry'
        }
      ]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      console.log(id)
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
      // 导出的内容
      const fileData = this.blogForm.mdContent
      // 默认为文章标题，没有文章标题则使用默认的
      const fileName = (this.blogForm.title || this.outputMdFileName) + '.md'
      if (fileData === '') {
        this.$util.notification.error('内容为空，导出失败')
        return
      }
      var pom = document.createElement('a')
      pom.setAttribute('href', 'data:text/plain;charset=UTF-8,' + encodeURIComponent(fileData))
      pom.setAttribute('download', fileName)
      pom.style.display = 'none'
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        pom.dispatchEvent(event)
      } else {
        pom.click()
      }
    },
    // 导入md
    importMd(event) {
      const selectedFile = event.target.files[0]
      const fileName = selectedFile.name
      // 全段是否为md文件
      if (fileName.substring(fileName.lastIndexOf('.')) !== '.md') {
        this.$util.notification.error('请导入md文件')
        return
      }
      const reader = new FileReader()
      // 文件内容载入完毕之后的回调。
      reader.onload = e => {
        this.blogForm.mdContent = e.target.result
      }
      reader.readAsText(selectedFile)
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
      var dt = e.dataTransfer.files[0]
      console.log(dt)
      const fileName = dt.name
      if (fileName.substring(fileName.lastIndexOf('.')) !== '.md') {
        this.$util.notification.error('请导入md文件')
        return
      }
      const reader = new FileReader()
      // 文件内容载入完毕之后的回调。
      reader.onload = e => {
        this.blogForm.mdContent = e.target.result
      }
      reader.readAsText(dt)
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
      this.blogForm.status = this.blogForm.status !== 1 ? 1 : this.blogForm.status
      this.submitArticle('blogForm', function(data) {
        _this.$util.notification.success('文章发布成功！')
        // todo 跳转到列表文章页面
      })
    },
    // 保存文章
    onSave() {
      const _this = this
      this.submitArticle('blogForm', function(data) {
        _this.$util.notification.success('保存文章成功！')
        // todo 跳转到列表文章页面
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
          this.submitting = true
          // 标签转换成字符串
          console.log(this.blogForm.tags)
          this.blogForm.tags = this.articleTag.join()
          this.blogForm.summaryContent = this.$util.getSummary(this.blogForm.htmlContent)
          console.log(this.blogForm.summaryContent)
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
          this.blogForm = res.data
          this.articleTag = res.data.tags.split(',')
          console.log(this.blogForm)
          // set tagsview title
          this.setTagsViewTitle()

          // set page title
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

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

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}
</style>
