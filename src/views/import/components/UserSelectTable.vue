<template>
  <div class="user-container">
    <el-form :inline="true">
      <el-form-item label="姓名">
        <el-input
          v-model="queryParams.search_val"
          placeholder="姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-radio v-model="selectId" :label="scope.row.id"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="position" label="职位"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getUserPageList } from '@/api/user'

  export default {
    name: 'UserSelectList',
    data() {
      return {
        list: null,
        listLoading: true,
        selectId: null,
        queryParams: {
          page: 1,
          size: 10,
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
        getUserPageList(this.queryParams).then((res) => {
          this.listLoading = false
          this.list = res.list
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
