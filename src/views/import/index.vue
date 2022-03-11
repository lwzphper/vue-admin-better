<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-button
              icon="el-icon-download"
              type="success"
              @click="handleDownTpl"
            >
              下载模板
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              action=""
              :show-file-list="false"
              :auto-upload="true"
              :http-request="handleUpload"
            >
              <el-button icon="el-icon-upload" size="small" type="primary">
                点击上传
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column
        show-overflow-tooltip
        prop="id"
        label="id"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="username"
        label="用户名"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="email"
        label="邮箱"
      ></el-table-column>

      <el-table-column show-overflow-tooltip label="权限">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.permissions" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="datatime"
        label="修改时间"
      ></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import Edit from './components/ClueImportEdit'
  import { getImportPreviewList, uploadImportExcel } from '@/api/clue'

  export default {
    name: 'ClueImport',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          page: 1,
          size: 10,
          file_path: '',
        },
      }
    },
    created() {
      // this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleUpload(param) {
        // 上传
        let formData = new FormData()
        formData.append('excel_file', param.file)
        uploadImportExcel(formData).then((res) => {
          // 设置文件路径
          this.queryForm.file_path = res.file_path
          this.fetchData()
        })
      },
      handleDownTpl() {
        const a = document.createElement('a')
        a.setAttribute('download', '导入模板.xlsx')
        // a.setAttribute('target', '_blank')
        a.setAttribute(
          'href',
          'https://cdn-oss.kabel.work/clue/20220311/0b4a5c6e-9523-41b9-b557-88aed1e897f0.xlsx'
        )
        a.click()
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { list, count } = await getPreviewList(this.queryForm)
        this.list = list
        this.total = count
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
