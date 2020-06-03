<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 新增按钮 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-2"
        style="margin-left: 10px;"
      >
        <el-button
          class="filter-item"
          type="primary"
          size="small"
          icon="el-icon-edit"
          @click="addUserDialog.visible = true"
        >新增</el-button>
      </div>
      <!-- 搜索框 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-4"
        style="margin-left: 10px;"
      >
        <el-input
          v-model="listQuery.username"
          class="filter-item"
          placeholder="用户名称"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </div>
      <!-- 搜索按钮 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-1"
        style="margin-left: 10px;"
      >
        <el-button v-waves class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <div class="filter-container">
      <el-card>
        <el-table
          v-loading="listLoading"
          :data="list"
          fit
          style="width: 100%"
          :default-sort="{prop: 'lastLoginTime', order: 'descending'}"
          @sort-change="sortChange"
        >
          <el-table-column prop="id" label="用户ID" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" align="center">
            <template slot-scope="{row}">
              <span>{{ row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录时间" sortable="custom" align="center">
            <template slot-scope="{row}">
              <span>{{ row.lastLoginTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建者" align="center">
            <template slot-scope="{row}">
              <span>{{ row.createBy }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateBy" label="更新者" align="center">
            <template slot-scope="{row}">
              <span>{{ row.updateBy }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="是否可用" align="center">
            <template slot-scope="{row,$index}">
              <el-tooltip :content="row.enabled?'用户可用':'用户不可用'" placement="right">
                <el-switch
                  v-model="row.enabled"
                  :disabled="true"
                  @click.native="switchChange(row,$index)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit-outline" circle @click="getUserRoles(row)" />
              <el-button type="danger" icon="el-icon-delete" circle @click="delecteUser(row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <pagination
        v-show="total > listQuery.size"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <el-dialog width="830px" :title="addUserDialog.title" :visible.sync="addUserDialog.visible">
      <el-form ref="userForm" :model="userForm" :rules="userRules" label-position="right">
        <el-form-item label="用户名" prop="username" label-width="80px">
          <el-input v-model="userForm.username" spellcheck="false" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="80px">
          <el-input v-model="userForm.password" clearable type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" label-width="80px">
          <el-input
            v-model="userForm.rePassword"
            clearable
            type="password"
            placeholder="请再次输入密码"
            @keyup.enter.native="submitForm('userForm')"
          />
        </el-form-item>
      </el-form>
      <div align="right">
        <el-button @click="addUserDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('userForm')">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog width="830px" :visible.sync="editUserDialog.visible">
      <div slot="title">
        <span class="dialog-custom-title" v-html="editUserDialog.title" />
      </div>
      <div align="center">
        <el-transfer
          v-model="roleData"
          :data="roleList"
          :titles="['可选角色', '已选角色']"
          filterable
          :filter-method="transferFilter"
          filter-placeholder="请输入角色名"
          style="text-align: left; display: inline-block"
        />
      </div>
      <div align="right" style="margin-top: 20px">
        <el-button @click="editUserDialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="tempRoleData.join() === roleData.join()"
          @click="roleHandler"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, saveUser, removeUser, updateEnableUser, updateUserRole } from '@/api/user'
import { getRoleByUserId, getRoleAll } from '@/api/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    const passwordValidate = (rule, value, callback) => {
      if (value !== this.userForm.rePassword) {
        this.$refs.userForm.validateField('rePassword')
      } else {
        callback()
      }
    }
    const rePasswordValidate = (rule, value, callback) => {
      if (value !== this.userForm.password) {
        callback(new Error('两次输入的密码不一样'))
      } else {
        callback()
      }
    }
    return {
      userId: null,
      total: 0,
      list: [],
      listLoading: false,
      tempRoleData: [],
      roleData: [],
      roleList: [],
      userForm: {},
      listQuery: {
        current: 1,
        size: 10,
        sort: {
          name: 'lastLogin',
          sort: 'desc'
        }
      },
      addUserDialog: {
        title: '新增用户',
        visible: false
      },
      editUserDialog: {
        title: '',
        visible: false
      },
      userRules: {
        username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { validator: passwordValidate, trigger: ['blur'] }
        ],
        rePassword: [{ validator: rePasswordValidate, trigger: ['blur', 'change'] }]
      }
    }
  },
  watch: {
    'addUserDialog.visible'(value) {
      if (!value) {
        this.$refs.userForm.resetFields()
      }
    }
  },
  created() {
    this.getList()
    this.getRoleAll()
  },

  methods: {
    makeConfirm(title, action) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          action()
        })
        .catch(() => {})
    },
    switchChange(row, index) {
      if (!row.enabled) {
        this.makeConfirm('确定生效此用户?', () => {
          this.list[index].enabled = true
          this.enableUser(row.id, row.enabled)
        })
      } else {
        this.makeConfirm('确定失效此用户?', () => {
          this.list[index].enabled = false
          this.enableUser(row.id, row.enabled)
        })
      }
    },
    async enableUser(id, enabled) {
      await updateEnableUser({ id, enabled })
      this.$util.notification.success('修改成功')
      this.getList()
    },
    /**
     * 获取用户列表
     */
    async getList() {
      try {
        this.listLoading = true
        const { list, total } = (await getUserList(this.listQuery)).data
        this.list = list
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 0.8 * 1000)
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * 获取角色列表
     */
    async getRoleAll() {
      const data = []
      ;(await getRoleAll()).data.map(item => {
        const name = item.name + '-' + item.description
        data.push({
          label: name,
          key: item.id
        })
      })
      this.roleList = data
    },
    /**
     * 获取用户所承当的角色
     */
    async getUserRoles(row) {
      this.userId = null
      const { id, username } = row
      this.editUserDialog.title = `为 \'${username}\' 分配角色`
      const data = (await getRoleByUserId(id)).data.map(item => {
        return item.id
      })
      this.tempRoleData = data
      this.roleData = data
      this.userId = id
      this.editUserDialog.visible = true
    },
    /**
     * el-transfer 自定义filter
     */
    transferFilter(query, item) {
      return item.label.indexOf(query.toUpperCase()) > -1
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      let action
      if (formName === 'userForm') {
        action = this.addUser
      } else {
        action = ''
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          action()
        }
      })
    },
    /**
     * 添加用户
     */
    async addUser() {
      this.makeConfirm('确认添加此用户吗？', async() => {
        // eslint-disable-next-line no-unused-vars
        const { rePassword, ...data } = this.userForm
        await saveUser(data)
        this.closeDialog('添加用户成功！', this.editUserDialog)
      })
    },
    /**
     * 删除用户
     */
    async delecteUser(id) {
      this.makeConfirm('确认删除此用户吗？', async() => {
        await removeUser(id)
        this.closeDialog('删除用户成功！', this.editUserDialog)
      })
    },
    /**
     * 分配角色
     */
    roleHandler() {
      this.makeConfirm('确认为此用户分配角色？', async() => {
        const userId = this.userId
        const roleData = this.roleData
        await updateUserRole({ userId, roleData })
        this.closeDialog('分配用户成功', this.editUserDialog)
      })
    },
    closeDialog(msg, dialog) {
      this.$util.notification.success(msg)
      dialog.visible = false
      this.getList()
    },
    // 按着 创建时间 / 更新时间 排序
    sortChange(column) {
      const { order, prop } = column
      if (order == null) return
      if (prop === 'lastLoginTime') {
        this.listQuery.sort = {
          name: 'lastLogin',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 50px;
}

.el-switch.is-disabled {
  opacity: 1 !important;
}

/deep/.el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer !important;
}
</style>
