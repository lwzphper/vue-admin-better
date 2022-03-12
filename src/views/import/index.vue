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
        <el-button
          type="primary"
          :disabled="importDisable"
          @click="handleImport"
        >
          确认导入
        </el-button>
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
              :disabled="uploadDisable"
            >
              <el-button icon="el-icon-upload" size="small" type="primary">
                点击上传
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-dialog title="导入选项" :visible.sync="showDialog">
      <div id="drawer-content">
        <el-radio-group v-model="importType">
          <el-radio :label="importPoolCode">导入到公海</el-radio>
          <el-radio :label="importUserCode">指定人员分配</el-radio>
          <el-radio :label="importDeptCode">平均分配给部门</el-radio>
        </el-radio-group>
      </div>
      <!-- 人员列表 -->
      <user-table
        v-show="importType == importUserCode"
        ref="userTable"
      ></user-table>
      <!-- 部门列表 -->
      <dept-table
        v-show="importType == importDeptCode"
        ref="deptTable"
      ></dept-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
    >
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="姓名"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="phone"
        label="手机号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="wechat"
        label="微信号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="region_name"
        label="省市区"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="address"
        label="详细地址"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="type_name"
        label="线索类型"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="source_name"
        label="线索来源"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="user_id"
        label="用户id"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="err_msg" label="验证结果">
        <template slot-scope="scope">
          <p
            :class="
              scope.row.err_msg == '' ? 'validate_success' : 'validate_error'
            "
          >
            {{ scope.row.err_msg == '' ? '通过' : scope.row.err_msg }}
          </p>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
  import UserTable from './components/UserSelectTable'
  import DeptTable from './components/DeptSelectTable'
  import {
    getImportPreviewList,
    uploadImportExcel,
    importExcelData,
  } from '@/api/clue'

  export default {
    name: 'ClueImport',
    components: { UserTable, DeptTable },
    data() {
      return {
        list: null,
        total: 0,
        errorNum: 0, // 失败个数
        successNum: 0, // 成功个数
        uploadDisable: false, // 上传按钮是否隐藏
        importDisable: false, // 导入按钮是否隐藏
        listLoading: false, // 是否显示列表加载框
        showDialog: true, // 是否显示抽屉
        importType: 0, // 导入类型
        layout: 'total, sizes, prev, pager, next, jumper',
        elementLoadingText: '正在加载...',
        importPoolCode: 1, // 导入公海
        importDeptCode: 2, // 平均分配部门
        importUserCode: 3, // 指定人员分配
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
        this.uploadDisable = true
        let formData = new FormData()
        formData.append('excel_file', param.file)
        uploadImportExcel(formData).then((res) => {
          // 设置文件路径
          this.queryForm.file_path = res.file_path
          this.fetchData()
          this.uploadDisable = false
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
        this.importDisable = false
        let data = {
          file_path: this.queryForm.file_path,
        }
        importExcelData(data).then((res) => {
          this.$message({
            message: '导入成功',
            type: 'success',
          })
          // 初始化导入数据
          this.handleInitImport()
          this.importDisable = true
        })
      },
      dialogVisible() {
        this.showDialog = false
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
        const { list, count, error } = await getImportPreviewList(
          this.queryForm
        )
        this.list = list
        this.errorNum = error
        this.successNum = count - error
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

  #drawer-content {
    padding-left: 20px;
  }

  ::v-deep .cell {
    .validate_success {
      color: $base-color-green !important;
    }

    .validate_error {
      color: $base-color-red !important;
    }
  }
</style>
