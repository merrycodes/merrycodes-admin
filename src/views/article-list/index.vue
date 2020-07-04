<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 文章状态 -->
      <div
        class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-3"
        style="margin-left: 10px;"
      >
        <el-select
          v-model="listQuery.status"
          placeholder="文章状态"
          default-first-option
          filterable
          clearable
          class="filter-item"
          :popper-append-to-body="false"
          popper-class="z-index-9"
          @change="handleFilter"
        >
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
          :popper-append-to-body="false"
          popper-class="z-index-9"
          @change="handleFilter"
        >
          <el-option v-for="item in tagsList" :key="item" :label="item" :value="item" />
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
          :popper-append-to-body="false"
          popper-class="z-index-9"
          @change="handleFilter"
        >
          <el-option v-for="item in categoryList" :key="item" :label="item" :value="item" />
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
          clearable
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
          clearable
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

    <div class="filter-container">
      <!-- 表格 -->
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="list"
        border
        fit
        style="width: 100%;"
        :default-sort="{prop: 'updateTime', order: 'descending'}"
        @sort-change="sortChange"
      >
        <!-- id -->
        <el-table-column label="ID" prop="id" align="center" width="50">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- 标题 -->
        <el-table-column label="标题" min-width="150">
          <template slot-scope="{ row }">
            <el-link :href="getUrl(row.id)" target="_blank" type="primary">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <!-- 分类 -->
        <el-table-column label="分类" width="150" align="center">
          <template slot-scope="{ row }">
            <el-tag effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <!-- 标签 -->
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
        <!-- 状态 -->
        <el-table-column label="状态" class-name="status-col" width="95">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | statusFilter">{{ row.status | statusNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <!-- 时间 -->
        <el-table-column
          label="发布时间"
          sortable="custom"
          prop="createTime"
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="修改时间"
          sortable="custom"
          prop="updateTime"
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>//
        <el-table-column
          label="操作"
          width="195"
          style="text-align:center"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }" align="left">
            <div>
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
                @click="onRelease(row.id)"
              >发布</el-button>
              <el-button
                v-if="row.status == '1'"
                size="small"
                icon="el-icon-delete"
                type="danger"
                @click="onUnRelease(row.id)"
              >取消发布</el-button>
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
import { getArticleList, saveArticle } from '@/api/article'
import { tagsList } from '@/api/tags'
import { categoryList } from '@/api/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import settings from '@/settings'

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
      list: [],
      tagsList: null,
      categoryList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        title: undefined,
        status: undefined,
        sort: {
          name: 'update',
          sort: 'desc'
        },
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
      ],
      updateParam: {
        id: undefined,
        status: undefined
      }
    }
  },
  activated() {
    this.handleFilter()
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
    async getList() {
      this.listLoading = true
      // 获取文章列表
      try {
        const { list, total } = (await getArticleList(this.listQuery)).data
        this.list = list
        this.total = total
        setTimeout(() => {
          this.listLoading = false
        }, 0.8 * 1000)
      } catch (e) {
        this.listLoading = false
      }
      // 获取标签
      this.tagsList = (await tagsList()).data
      // 获取分类
      this.categoryList = (await categoryList()).data
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    // 发布文章
    onRelease(id) {
      this.updateParam = { id, status: this.status[1].key }
      this.submitArticle(
        this.updateParam,
        () => {
          this.$util.notification.success('文章发布成功！')
          this.handleFilter()
        },
        '确认要发布此文章吗？'
      )
    },
    // 取消发布文章
    onUnRelease(id) {
      this.updateParam = { id, status: this.status[2].key }
      this.submitArticle(
        this.updateParam,
        () => {
          this.$util.notification.success('文章取消发布成功！')
          this.handleFilter()
        },
        '确认要取消发布此文章吗？'
      )
    },
    submitArticle(data, action, title) {
      this.makeConfirm(title, async() => {
        await saveArticle(data)
        action()
      })
    },
    // 按着 创建时间 / 更新时间 排序
    sortChange(column) {
      const { order, prop } = column
      if (order == null) return
      if (prop === 'updateTime') {
        this.listQuery.sort = {
          name: 'update',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      } else {
        this.listQuery.sort = {
          name: 'create',
          sort: order === 'ascending' ? 'asc' : 'desc'
        }
        this.getList()
      }
    },
    getUrl(id) {
      let blogUrl = settings.blogUrl
      if (!blogUrl.endsWith('/')) {
        blogUrl += '/'
      }
      return blogUrl + 'article/' + id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/list.scss';
</style>
