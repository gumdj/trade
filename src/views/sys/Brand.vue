<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
      <el-input
          style="height: 45px; width: 240px; margin-top: 5px"
          v-model="searchForm.brdName"
          placeholder="品牌名称"
          clearable
      />
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin-top: 5px" @click="getBrands">搜索</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin: 5px" type="primary" @click="dialogVisible = true;updateOrSave = '添加'">新增</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-popconfirm
            title="确定批量删除吗？"
            @confirm="handleDelete(null, null)"
        >
          <el-button
              type="danger"
              slot="reference"
              style="margin: 5px" :disabled="canDelete">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        ref="multipleTable"
        :row-key="(row) => {return row.brdId}"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          align="center"
          :reserve-selection="true"
          width="55"
      >
      </el-table-column>
      <el-table-column
          label="品牌编号"
          align="center"
          :sort-method="sortByBrdId"
          sortable
          prop="brdId">
      </el-table-column>
      <el-table-column
          label="品牌名称"
          align="center"
          prop="brdName">
      </el-table-column>
      <el-table-column
          label="网站"
          align="center"
          prop="brdWebsite">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.brdId)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete(scope.row.brdId, scope.row)">
          <el-button
              size="mini"
              type="danger"
              slot="reference"
              style="margin: 30px">删除</el-button>
        </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="height: 32px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="current"
        :page-sizes="[1, 10, 20, 50, 100]"
        :page-size="size"
        :total="total"/>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="品牌名称" prop="brdName">
          <el-input v-model="editForm.brdName"></el-input>
        </el-form-item>
        <el-form-item label="网站" prop="brdWebsite">
          <el-input v-model="editForm.brdWebsite"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-model="updateOrSave" @click="submitForm('editForm')">{{updateOrSave}}</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Brand",
  data() {
    return {
      updateOrSave: '',

      total: 0,
      size: 10,
      current: 1,

      canDelete: true,

      dialogVisible: false,

      searchForm: { },

      editForm: {
        brdId: null,
        brdName: '',
        brdWebsite: ''
      },
      rules: {
        brdName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
      },
      tableData: [],
      multipleSelection: [],
      search: ''
    }
  },
  created() {
    this.getBrands()
  },
  methods: {
    handleEdit(brandId) {
      this.updateOrSave = '更新'
      this.$axios.get('/sys/brand/info/' + brandId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(brandId, row) {
      let brandIds = []
      if (brandId) {
        brandIds.push(brandId)
        this.$refs.multipleTable.toggleRowSelection(row)
      } else {
        this.multipleSelection.forEach(row => {
          brandIds.push(row.brdId)
        })
        this.$refs.multipleTable.clearSelection()
      }
      this.$axios.post('/sys/brand/delete', brandIds).then(res => {
        this.getBrands()
        this.$message({
          showClose: true,
          message: 'Succeed',
          type: 'success'
        })
      })
    },
    handleClose() {
      this.resetForm('editForm')
      this.dialogVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/brand/' + (this.editForm.brdId ? 'update' : 'save'), this.editForm)
          .then(res => {
            this.dialogVisible = false
            this.getBrands()
            this.$message({
              showClose: true,
              message: 'Succeed',
              type: 'success'
            })
            this.resetForm('editForm')
          })
        } else {
          this.$message.error('Failed')
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.editForm = {
        brdId: null,
        brdName: '',
        brdWebsite: ''
      }
    },
    getBrands() {
      this.$axios.get('/sys/brand/list', {
        params: {
          brdName: this.searchForm.brdName,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.canDelete = val.length == 0
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getBrands()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getBrands()
    },
    sortByBrdId(a, b) {
      let res = parseInt(a.brdId) - parseInt(b.brdId)
      return res
    }
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>

<style>
.el-dialog__title {
  position:absolute;
}

.el-dialog__header {
  position:relative;
  height: 50px;
}

.el-pager {
  height: 32px;
}
</style>