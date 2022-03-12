<template>
  <div class="user-container">
    <el-form :inline="true">
      <el-form-item label="部门">
        <el-input
          v-model="queryParams.search_val"
          placeholder="部门"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      v-loading="listLoading"
      row-key="id"
      :data="list"
      tooltip-effect="dark"
      default-expand-all
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="选择" width="80">
        <template slot-scope="scope">
          <el-radio v-model="selectId" :label="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getDepartmentList } from '@/api/user'

  export default {
    name: 'DeptSeelctTable',
    data() {
      return {
        list: null,
        listLoading: true,
        selectId: null,
        queryParams: {
          search_val: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.selectId = null // 防止搜索后，无法选择
        this.listLoading = true
        getDepartmentList(this.queryParams).then((res) => {
          this.listLoading = false
          this.list = res
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .user-container {
    padding-top: 20px;
  }
</style>
