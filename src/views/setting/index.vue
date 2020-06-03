<template>
  <div style="padding: 20px;">
    <el-tabs id="pane">
      <el-tab-pane label="网站设置">
        <el-form ref="websiteForm" :model="setting" :rules="websiteRules">
          <el-form-item label="博客名:">
            <el-input v-model="setting.blog_name" spellcheck="false" clear placeholder="请输入博客名" />
          </el-form-item>
          <el-form-item label="博客网站:" prop="blog_website">
            <el-input
              v-model="setting.blog_website"
              spellcheck="false"
              clear
              placeholder="请输入博客网址（http, https:// 开头）"
            />
          </el-form-item>
          <el-form-item label="博客底部信息:">
            <el-input
              v-model="setting.blog_footer"
              type="textarea"
              :rows="6"
              spellcheck="false"
              clear
              placeholder="请输入博客底部信息,可以使用html语句"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="checkPermission(['ADMIN'])"
              type="primary"
              size="small"
              @click="submitForm('websiteForm')"
            >保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="SEO 设置">
        <el-form ref="form" :model="setting">
          <el-form-item label="网站名称(Title):">
            <el-input v-model="setting.meta_title" spellcheck="false" clear placeholder="请输入网站名称" />
          </el-form-item>
          <el-form-item label="网站描述(description):">
            <el-input
              v-model="setting.meta_description"
              spellcheck="false"
              clear
              placeholder="请输入网站描述"
            />
          </el-form-item>
          <el-form-item label="网站关键字(keywords):">
            <el-input
              v-model="setting.meta_keywords"
              spellcheck="false"
              clear
              placeholder="请输入网站关键字"
            />
          </el-form-item>
          <el-form-item label="Google站点验证(google-site-verification):">
            <el-input
              v-model="setting.google_site_verification"
              spellcheck="false"
              clear
              placeholder="请输入Google站点验证"
            />
          </el-form-item>

          <el-form-item label="Baidu站点验证(baidu-site-verification):">
            <el-input
              v-model="setting.baidu_site_verification"
              spellcheck="false"
              clear
              placeholder="请输入Baidu站点验证"
            />
          </el-form-item>

          <el-form-item label="Google站点分析(google_analytics):">
            <el-input
              v-model="setting.google_analytics"
              spellcheck="false"
              clear
              placeholder="UA-XXXXXXXX-X"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="checkPermission(['ADMIN'])"
              type="primary"
              size="small"
              @click="submitSetting"
            >保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人设置">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
          <p class="tip">修改后需重新登录</p>
          <el-form-item label="原密码:" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              spellcheck="false"
              clear
              placeholder="请输入原密码"
            />
          </el-form-item>
          <el-form-item label="新密码:" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              spellcheck="false"
              clear
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item label="确认新密码:" prop="rePassword">
            <el-input
              v-model="passwordForm.rePassword"
              type="password"
              spellcheck="false"
              clear
              placeholder="请输入确认新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="checkPermission(['ADMIN'])"
              type="primary"
              size="small"
              @click="submitForm('passwordForm')"
            >保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { saveSetting, getSetting } from '@/api/setting'
import { changePassword } from '@/api/user'

export default {
  name: 'Setting',
  data() {
    const passwordValidate = (rule, value, callback) => {
      if (value !== this.passwordForm.rePassword) {
        this.$refs.passwordForm.validateField('rePassword')
      } else {
        callback()
      }
    }
    const rePasswordValidate = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一样'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      setting: {
        blog_name: '',
        blog_website: '',
        blog_footer: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        google_site_verification: '',
        baidu_site_verification: '',
        google_analytics: ''
      },
      websiteRules: {
        blog_website: [{ type: 'url', message: '请输入正确格式的网址', trigger: ['blur', 'change'] }]
      },
      passwordRules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: ['blur', 'change'] }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
          { validator: passwordValidate, trigger: ['blur'] }
        ],
        rePassword: [{ validator: rePasswordValidate, trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {
    this.getSetting()
  },
  methods: {
    checkPermission,
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async getSetting() {
      const setting = (await getSetting()).data
      for (const key in setting) {
        this.setting[key] = setting[key]
      }
    },
    async submitPassword() {
      // eslint-disable-next-line no-unused-vars
      const { rePassword, ...data } = this.passwordForm
      await changePassword(data)
      this.$util.notification.success('更新设置成功!')
      this.logout()
    },
    async submitSetting() {
      await saveSetting(this.setting)
      this.$util.notification.success('更新设置成功！')
    },
    submitForm(formName) {
      let action
      if (formName === 'passwordForm') {
        action = this.submitPassword
      } else {
        action = this.submitSetting
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          action()
        }
      })
    }
  }
}
</script>

<style scoped>
.tip {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}
</style>
