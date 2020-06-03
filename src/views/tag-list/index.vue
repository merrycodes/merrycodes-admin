<template>
  <div class="app-container">
    <div class="filter-container" align="center">
      <!-- 标签状态 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3"
        style="margin-left: 10px;"
      >
        <el-select
          v-model="listQuery.status"
          placeholder="标签状态"
          clearable
          filterable
          default-first-option
          class="filtchanger-item"
          :popper-append-to-body="false"
          popper-class="z-index-9"
          @change="handleFilter"
        >
          <el-option v-for="item in status" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </div>

      <!-- 标签搜索 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-6"
        style="margin-left: 10px;"
      >
        <el-input
          v-model="listQuery.name"
          placeholder="搜索标签"
          class="filter-item"
          clearable
          @keyup.enter.native="handleFilter"
        />
      </div>

      <!-- 搜索按钮 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-2"
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

      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-2"
        style="margin-left: 10px;"
      >
        <el-button
          class="filter-item"
          type="success"
          icon="el-icon-document-add"
          plain
          @click="onCreate"
        >新建</el-button>
      </div>
    </div>
    <div class="filter-container">
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
        :default-sort="{prop: 'count', order: 'descending'}"
        @sort-change="sortChange"
      >
        <!-- id -->
        <el-table-column label="ID" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- 标签 -->
        <el-table-column label="标签" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" class-name="status-col">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | statusFilter">{{ row.status | statusNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <!-- 文章数 -->
        <el-table-column sortable="custom" prop="count" label="文章数" class-name="status-col">
          <template slot-scope="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <!-- 时间 -->
        <el-table-column sortable="custom" prop="createTime" label="发布时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="updateTime" label="修改时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="210"
          align="center"
          label-class-name="text-center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <div class="operation">
              <el-button
                style="margin-left:5px;"
                size="small"
                icon="el-icon-edit-outline"
                type="primary"
                @click="onSave(row.id)"
              >编辑</el-button>
              <el-button
                v-if="row.status != '1'"
                size="small"
                icon="el-icon-s-promotion"
                type="success"
                @click="onValid(row.id)"
              >生效</el-button>
              <el-button
                v-if="row.status != '0'"
                size="small"
                icon="el-icon-delete"
                type="danger"
                @click="onInvalid(row.id)"
              >失效</el-button>
            </div>
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
  </div>
</template>

<script>
import { getTagsList, saveTags } from '@/api/tags'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'TagList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        0: '失效',
        1: '生效'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        status: undefined,
        name: undefined,
        sort: {
          name: 'count',
          sort: 'desc'
        }
      },
      status: [
        {
          key: 0,
          value: '失效'
        },
        {
          key: 1,
          value: '生效'
        }
      ],
      tagsForm: {
        id: undefined,
        name: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getList()
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
    // 获取文章标签列表
    async getList() {
      this.listLoading = true
      try {
        const { list, total } = (await getTagsList(this.listQuery)).data
        this.list = list
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 0.8 * 1000)
      } catch (e) {
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 排序
    sortChange(column) {
      const { order, prop } = column
      if (order == null) return
      if (prop === 'updateTime') {
        this.listQuery.sort = {
          name: 'update',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      } else if (prop === 'createTime') {
        this.listQuery.sort = {
          name: 'create',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      } else {
        this.listQuery.sort = {
          name: 'count',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      }
    },
    // save / update 共用方法
    submitTags(data, action, title) {
      this.makeConfirm(title, async() => {
        await saveTags(data)
        action()
      })
    },
    // 创建文章标签
    onCreate() {
      this.$prompt('请输入标签名称', '创建文章标签', {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5\u0020A-Za-z0-9]+$/,
        inputErrorMessage: '请输入中文或英文'
      })
        .then(({ value }) => {
          this.tagsForm = { id: undefined, name: value, status: undefined }
          this.submitTags(
            this.tagsForm,
            () => {
              this.$util.notification.success('创建文章标签成功')
              this.handleFilter()
            },
            '确认要创建文章标签吗？'
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改文章标签
    onSave(id) {
      this.$prompt('请输入标签名称', '修改文章标签', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5\u0020A-Za-z0-9]+$/,
        inputErrorMessage: '请输入中文或英文'
      })
        .then(({ value }) => {
          this.tagsForm = { id, name: value, status: undefined }
          this.submitTags(
            this.tagsForm,
            () => {
              this.$util.notification.success('修改成功文章标签成功')
              this.getList()
            },
            '确认要修改此文章标签吗？'
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 生效文章标签
    onValid(id) {
      this.tagsForm = { id, name: undefined, status: this.status[1].key }
      this.submitTags(
        this.tagsForm,
        () => {
          this.$util.notification.success('文章标签生效成功')
          this.getList()
        },
        '确认要生效此文章标签吗？'
      )
    },
    // 失效文章标签
    onInvalid(id) {
      this.tagsForm = { id, name: undefined, status: this.status[0].key }
      this.submitTags(
        this.tagsForm,
        () => {
          this.$util.notification.success('文章标签失效成功')
          this.getList()
        },
        '确认要失效此文章标签吗？'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/list.scss';
</style>
