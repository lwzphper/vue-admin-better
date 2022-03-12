<template>
  <div class="userManagement-container">
    <el-row class="upload-result-wrapper">
      <el-col :span="8">
        <p class="result-title">校验失败线索</p>
        <p class="result-num">{{ errorNum }}个</p>
      </el-col>
      <el-col :span="8" class="success-box">
        <p class="result-title">合计可导入</p>
        <p class="result-num">{{ successNum }}个</p>
      </el-col>
      <el-col :span="8" class="result-button-wrapper">
        <el-button @click="handleInitImport">取消导入</el-button>
        <el-button type="primary" @click="handleImport">确认导入</el-button>
      </el-col>
    </el-row>
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
  import {
    getImportPreviewList,
    uploadImportExcel,
    importExcelData,
  } from '@/api/clue'

  export default {
    name: 'ClueImport',
    components: { Edit },
    data() {
      return {
        list: null,
        errorNum: 0, // 失败个数
        successNum: 0, // 成功个数
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
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
      // 上传文件
      handleUpload(param) {
        let formData = new FormData()
        formData.append('excel_file', param.file)
        uploadImportExcel(formData).then((res) => {
          // 设置文件路径
          this.queryForm.file_path = res.file_path
          this.fetchData()
        })
      },
      // 下载模板
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
      // 初始化导入信息
      handleInitImport() {
        this.list = null
        this.errorNum = 0
        this.successNum = 0
        this.total = 0
        this.queryForm.file_path = ''
      },
      // 导入操作
      handleImport() {
        let data = {
          file_path: this.queryForm.file_path,
        }
        importExcelData(data).then((res) => {
          this.$message('操作成功')
          // 初始化导入数据
          this.handleInitImport()
        })
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

<style lang="scss" scoped>
  .upload-result-wrapper {
    display: flex;
    align-items: center;
    text-align: center;
    color: $base-color-default;
    margin-bottom: 30px;

    .success-box {
      border-left: 1px solid $base-border-color;
    }

    .result-num {
      margin: 0;
      font-size: 20px;
      padding-bottom: 10px;
    }

    .result-button-wrapper {
      height: 100%;
      display: flex;
      justify-content: right;
    }
  }
</style>
