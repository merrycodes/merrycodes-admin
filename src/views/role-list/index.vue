<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索框 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-4"
        style="margin-left: 10px;"
      >
        <el-input
          v-model="listQuery.name"
          class="filter-item"
          placeholder="角色名称"
          clearable
          @keyup.enter.native="getList"
        />
      </div>
      <!-- 搜索按钮 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-1"
        style="margin-left: 10px;"
      >
        <el-button v-waves class="filter-item" type="primary" @click="getList">搜索</el-button>
      </div>
    </div>
    <div class="filter-container">
      <el-card>
        <el-table
          v-loading="listLoading"
          :data="list"
          fit
          style="width: 100%"
          :default-sort="{prop: 'userCount', order: 'descending'}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table border :data="props.row.userList" style="width: 80%;margin: auto;">
                <el-table-column label="用户ID" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="用户名" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.username }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="角色ID" align="center">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名字" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="角色描述" align="center">
            <template slot-scope="{row}">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userCount"
            label="有效用户"
            :sort-method="sortMethod"
            sortable
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.userList.length }}</span>
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
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getRoleList } from '@/api/role'
export default {
  name: 'Role',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      list: [],
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined
      }
    }
  },
  activated() {
    this.getList()
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const { list, total } = (await getRoleList(this.listQuery)).data
        this.list = list
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 0.8 * 1000)
      } catch (e) {
        this.listLoading = false
      }
    },
    sortMethod(a, b) {
      return a.userList.length - b.userList.length
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 50px;
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
</style>
