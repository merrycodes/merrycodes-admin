<template>
  <div class="app-container">
    <div class="filter-container" align="center">
      <!-- 分类状态 -->
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3" style="margin-left: 10px;">
        <el-select v-model="listQuery.importance" placeholder="分类状态" clearable class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <!-- 分类搜索 -->
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-6" style="margin-left: 10px;">
        <el-input v-model="listQuery.title" placeholder="搜索分类" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>

      <!-- 搜索按钮 -->
      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-2" style="margin-left: 10px;">
        <el-button v-waves class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>

      <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-2" style="margin-left: 10px;">
        <el-button class="filter-item" type="success" icon="el-icon-document-add" plain @click="open">
          新建
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit style="width: 100%;" @sort-change="sortChange">
      <!-- id -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 分类 -->
      <el-table-column label="分类" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章数 -->
      <el-table-column label="文章数" class-name="status-col">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column label="发布时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" label-class-name="text-center" class-name="small-padding fixed-width operation">
        <template slot-scope="{ row }">
          <!-- { row, $index } -->
          <el-button style="margin-left:5px;" size="small" icon="el-icon-edit-outline" type="primary">
            编辑
          </el-button>
          <el-button v-if="row.status != 'published'" size="small" icon="el-icon-s-promotion" type="success">
            发布
          </el-button>
          <el-button v-if="row.status != 'draft'" size="small" icon="el-icon-delete" type="danger">
            取消发布
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// eslint-disable-next-line no-unused-vars
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'CategoryList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    open() {
      this.$prompt('请输入分类名称', '新建分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.$notify({
            title: 'success',
            type: 'success',
            message: '新建分类为: ' + value,
            offset: 100
          })
        })
        .catch(() => {
          this.$notify({
            title: 'info',
            type: 'info',
            message: '取消输入',
            offset: 100
          })
        })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
</style>
