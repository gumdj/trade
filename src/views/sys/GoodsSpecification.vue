<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
        <el-input
            style="height: 45px; width: 240px; margin-top: 5px"
            v-model="searchForm.speciName"
            placeholder="规格名称"
            clearable
        />
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin-top: 5px" @click="">搜索</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin: 5px" type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-popconfirm
            title="确定批量删除吗？"
            @confirm="handleDelete(null)"
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
        :row-key="(row) => {return row.speciId}"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          label="规格编号"
          align="center"
          prop="speciId">
      </el-table-column>
      <el-table-column
          label="规格名称"
          align="center"
          prop="speciName">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.speciId);">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.speciId)">
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
        <el-form-item label="规格名称" prop="speciName">
          <el-input v-model="editForm.speciName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">添加</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsSpecification",
  data() {
    return {
      total: 0,
      size: 10,
      current: 1,

      canDelete: true,

      searchForm: { },
      itemList: [ ],
      dialogVisible: false,
      editForm: {
        speciId: null,
        speciName: '',
      },
      rules: {
        speciName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
      },
      tableData: [],
      multipleSelection: [],
      search: ''
    }
  },
  created() {
    this.getSpecifications()
  },
  methods: {
    handleEdit(speciId) {
      this.$axios.get('/sys/specification/info/' + speciId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(speciId) {
      let speciIds = [ ]
      if (speciId) {
        speciIds.push(speciId)
      } else {
        this.multipleSelection.forEach(row => {
          speciIds.push(row.speciId)
        })
      }
      this.$axios.post('/sys/goodsType/delete/', speciIds).then(res => {
        this.$message({
          showClose: true,
          message: 'Succeed',
          type: 'success',
          onClose: () => {
            this.getSpecifications()
          }
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
          this.$axios.post('/sys/specification/' + (this.editForm.speciId ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  message: 'Succeed',
                  type: 'success',
                  onClose: () => {
                    this.getSpecifications()
                  }
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
        speciId: null,
        speciName: '',
      }
    },
    getSpecifications() {
      this.$axios.get('/sys/specification/list', {
        params: {
          speciName: this.searchForm.speciName,
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
      this.getSpecifications()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getSpecifications()
    }
  },
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
</style>