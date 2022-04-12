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
        <el-button type="primary" @click="showDialog">确认导入</el-button>
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

    <el-dialog
      :title="'导入选项（共' + total + '条线索）'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div id="drawer-content">
        <el-radio-group v-model="importType">
          <el-radio :label="importPoolCode">导入到公海</el-radio>
          <el-radio :label="importUserCode">指定人员分配</el-radio>
          <el-radio :label="importDeptCode">平均分配给部门</el-radio>
          <el-radio :label="importRegionPolicy">按照策略分配</el-radio>
        </el-radio-group>
      </div>
      <!-- 人员列表 -->
      <user-table
        v-show="userTabCode.indexOf(importType) != -1"
        ref="userTable"
      ></user-table>
      <!-- 部门列表 -->
      <dept-table
        v-show="importType == importDeptCode"
        ref="deptTable"
      ></dept-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button
          type="primary"
          :disabled="importDisable"
          @click="handleImport"
        >
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
      <el-table-column
        show-overflow-tooltip
        prop="rp_username"
        label="策略分配人"
      ></el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :page-sizes="[10]"
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

  let importPoolCode = 1 // 导入公海
  let importUserCode = 2 // 指定人员分配
  let importDeptCode = 3 // 平均分配部门
  let importRegionPolicy = 4 // 按照策略分配

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
        dialogVisible: false, // 是否显示弹框
        importType: 0, // 导入类型
        layout: 'total, prev, pager, next, jumper',
        elementLoadingText: '正在加载...',
        importPoolCode: importPoolCode, // 导入公海
        importUserCode: importUserCode, // 指定人员分配
        importDeptCode: importDeptCode, // 平均分配部门
        importRegionPolicy: importRegionPolicy, // 按照策略分配
        userTabCode: [importUserCode, importRegionPolicy], // 需要选择人员的类型
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
        this.handleInitImport()
        this.uploadDisable = true
        let formData = new FormData()
        formData.append('excel_file', param.file)

        // todo 这里如果第一次文件上传失败，后面都不能上传
        uploadImportExcel(formData)
          .then((res) => {
            // 设置文件路径
            this.queryForm.file_path = res.file_path
            this.fetchData()
            this.uploadDisable = false
          })
          .catch(() => {
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
          'https://cdn-oss.kabel.work/clue/20220313/0d871b7d-5808-494c-9709-363a22661a83.xlsx'
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
        this.importDisable = false
        this.dialogVisible = false
      },
      // 导入操作
      handleImport() {
        let data = this.getImportParams()
        if (data === false) {
          return
        }

        this.importDisable = true
        importExcelData(data)
          .then((res) => {
            this.$message({
              message: '导入成功',
              type: 'success',
            })
            // 初始化导入数据
            this.handleInitImport()
          })
          .catch(() => {
            this.importDisable = false
          })
      },
      getImportParams() {
        let data = {
          file_path: this.queryForm.file_path,
          type: this.importType,
        }

        // 检查导入类型是否有选择
        if (!this.importType) {
          this.$message({
            message: '请选择导入类型',
            type: 'error',
          })
          return false
        }

        // 获取导入的类型
        let objId = null
        switch (this.importType) {
          case this.importUserCode:
          case this.importRegionPolicy:
            objId = this.$refs.userTable.selectId
            if (!objId) {
              this.$message({
                message: '请选择分配的人员',
                type: 'error',
              })
              return false
            }
            data.obj_id = objId
            break
          case this.importDeptCode:
            objId = this.$refs.deptTable.selectId
            if (!objId) {
              this.$message({
                message: '请选择分配的部门',
                type: 'error',
              })
              return false
            }
            data.obj_id = objId
        }
        return data
      },
      // 显示弹框
      showDialog() {
        if (this.queryForm.file_path === '') {
          this.$message({
            message: '请上传需要导入的Excel文件',
            type: 'error',
          })
          return
        }

        // 判断可以导入的数量
        if (this.successNum == 0) {
          this.$message({
            message: '没有可导入的数据',
            type: 'error',
          })
          return false
        }

        // 显示弹框
        this.dialogVisible = true
      },
      hideDialog() {
        this.dialogVisible = false
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
        this.total = count
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
    .tips {
      color: $base-color-red;
      margin-top: 0;
    }
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
