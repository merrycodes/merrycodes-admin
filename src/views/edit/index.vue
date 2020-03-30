<template>
  <div class="app-container">
    <el-form :ref="blogForm" :model="blogForm" :rules="rules" label-position="top">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="blogForm.title" :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="120px" label="分类:" class="postInfo-container-item" prop="categoryValue">
                    <el-select
                      v-model="blogForm.categoryValue"
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
                  <el-form-item label-width="120px" label="标签:" class="postInfo-container-item" prop="tageValues">
                    <el-select
                      v-model="blogForm.tageValues"
                      filterable
                      default-first-option
                      clearable
                      multiple
                      :popper-append-to-body="false"
                      popper-class="z-index-9"
                      style="width:500px;"
                      placeholder="请选择"
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
          :toolbars="toolbars"
          :autofocus="false"
          :code-style="'atom-one-dark'"
          :class="[zIndex ? 'full-height' : 'z-index-1']"
          class="mavonEditor"
          @fullScreen="mdScreenChange"
        >
          <template slot="left-toolbar-after">
            <button type="button" class="op-icon fa fa-upload" aria-hidden="true" :title="`导入md`" @click="$refs.importMd.click()" />
            <button type="button" class="op-icon fa fa-download" aria-hidden="true" :title="`导出md`" @click="saveMd" />
            <input ref="importMd" style="display : none" type="file" accept=".md" @change="importMd($event)">
          </template>
          <template slot="right-toolbar-after">
            <button type="button" class="op-icon fa fa-paper-plane" aria-hidden="true" :title="`发布文章`" @click="release" />
          </template>
        </mavon-editor>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
  data() {
    return {
      // 表单数据
      blogForm: {
        title: '',
        tag: '',
        category: '',
        htmlContent: '',
        mdContent: '',
        tageValues: [],
        categoryValue: ''
      },
      // 简单得表单验证
      rules: {
        title: { required: true, message: '请输入文章标题', trigger: 'blur' },
        categoryValue: { required: true, message: '请选择文章分类', trigger: 'change' },
        tageValues: { required: true, message: '请选择文章标签', trigger: 'change' },
        mdContent: { required: true, message: '请输入文章内容', trigger: 'blur' }
      },
      zIndex: true,
      // 在没有输入标题情况下导出默认名字为 article
      outputMdFileName: 'article',
      // 工具栏按钮  去除了help按钮
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
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true // 单双栏模式
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
        this.$notify({
          title: 'error',
          message: '内容为空，导出失败',
          type: 'error',
          offset: 100
        })
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
        this.$notify({
          title: 'error',
          message: '请导入md文件',
          type: 'error',
          offset: 100
        })
        return
      }
      const reader = new FileReader()
      // 文件内容载入完毕之后的回调。
      reader.onload = e => {
        this.value = e.target.result
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
      const fileName = dt.name
      if (fileName.substring(fileName.lastIndexOf('.')) !== '.md') {
        this.$notify({
          title: 'error',
          message: '请导入md文件',
          type: 'error',
          offset: 100
        })
        return
      }
      const reader = new FileReader()
      // 文件内容载入完毕之后的回调。
      reader.onload = e => {
        this.value = e.target.result
      }
      reader.readAsText(dt)
    },
    mdScreenChange(e) {
      this.zIndex = e
    },
    // 发布文章
    release() {
      alert('发布文章成功')
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
