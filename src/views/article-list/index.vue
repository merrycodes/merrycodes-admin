<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 文章状态 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3"
        style="margin-left: 10px;"
      >
        <el-select v-model="listQuery.status" placeholder="文章状态" clearable class="filter-item">
          <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </div>

      <!-- 文章标签 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3"
        style="margin-left: 10px;"
      >
        <el-select
          v-model="listQuery.tags"
          placeholder="标签"
          filterable
          default-first-option
          clearable
          class="filter-item"
        >
          <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </div>

      <!-- 文章分类 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3"
        style="margin-left: 10px;"
      >
        <el-select
          v-model="listQuery.category"
          placeholder="分类"
          filterable
          default-first-option
          clearable
          class="filter-item"
        >
          <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </div>

      <!-- 文章标题搜索 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-6"
        style="margin-left: 10px;"
      >
        <el-input
          v-model="listQuery.title"
          placeholder="搜索文章标题"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>

      <!-- 文章内容搜索 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-6"
        style="margin-left: 10px;"
      >
        <el-input
          v-model="listQuery.mdContent"
          placeholder="搜索文章内容"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>

      <!-- 搜索按钮 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-1"
        style="margin-left: 10px;"
      >
        <el-button
          v-waves
          class="filter-item"
          type="info"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit style="width: 100%;">
      <!-- id -->
      <el-table-column label="ID" prop="id" align="center" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.title }}</span>
        </template>
      </el-table-column>
      <!-- 分类 -->
      <el-table-column label="分类" width="150px" align="center">
        <template slot-scope="{ row }">
          <el-tag effect="plain">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-for="item in row.tags.split(',')"
            :key="item"
            type="warning"
            effect="plain"
          >{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="80">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{ row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column label="发布时间" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>//
      <el-table-column
        label="操作"
        width="210"
        style="text-align:center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }" align="left">
          <router-link :to="'/edit/'+row.id">
            <el-button
              style="margin-left:5px;"
              size="small"
              icon="el-icon-edit-outline"
              type="primary"
            >编辑</el-button>
          </router-link>
          <el-button
            v-if="row.status != '1'"
            size="small"
            icon="el-icon-s-promotion"
            type="success"
          >发布</el-button>
          <el-button v-if="row.status == '1'" size="small" icon="el-icon-delete" type="danger">取消发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > listQuery.size"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getArticleList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// eslint-disable-next-line no-unused-vars
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        0: '草稿',
        1: '已发布',
        2: '取消发布'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        title: undefined,
        status: undefined,
        sort: undefined,
        tags: undefined,
        category: undefined,
        mdContent: undefined
      },
      status: [
        {
          key: 0,
          value: '草稿'
        },
        {
          key: 1,
          value: '已发布'
        },
        {
          key: 2,
          value: '取消发布'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getArticleList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
