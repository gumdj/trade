<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
        <el-input
            style="height: 45px; width: 240px; margin-top: 5px"
            v-model="searchForm.tyName"
            placeholder="类型名称"
            clearable
        />
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin-top: 5px" @click="getTypes()">搜索</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin: 5px" type="primary" @click="dialogVisible = true;getSuperId();updateOrSave = '添加'">新增</el-button>
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
        :row-key="(row) => {return row.tyId}"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          label="类型编号"
          align="center"
          :sort-method="sortBytyId"
          sortable
          prop="tyId">
      </el-table-column>
      <el-table-column
          label="类型名称"
          align="center"
          prop="tyName">
      </el-table-column>
      <el-table-column
          label="上级类型编号"
          align="center"
          prop="tySuper">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.tyId);getSuperId()">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.tyId, scope.row)">
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
        <el-form-item label="类型名称" prop="tyName">
          <el-input v-model="editForm.tyName"></el-input>
        </el-form-item>
        <el-form-item label="上级类型" prop="tySuper">
          <el-select v-model="editForm.tySuper" placeholder="请选择类型编号">
            <el-option label="NULL" value=""></el-option>
            <el-option :label="item.ty_name" :value="item.ty_id" v-for="(item, index) in itemList" :key="index"></el-option>
          </el-select>
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
import axios from "../../axios";
import store from "../../store";

export default {
  name: "GoodsType",
  data() {
    return {
      updateOrSave: '',

      total: 0,
      size: 10,
      current: 1,

      canDelete: true,

      searchForm: { },
      itemList: [ ],
      dialogVisible: false,
      editForm: {
        tyId: null,
        tyName: '',
        tySuper: ''
      },
      rules: {
        tyName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
      },
      tableData: [],
      multipleSelection: [],
      search: ''
    }
  },
  created() {
    this.getTypes()
  },
  methods: {
    handleEdit(typeId) {
      this.updateOrSave = '更新'
      this.$axios.get('/sys/goodsType/info/' + typeId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(typeId, row) {
      let typeIds = [ ]
      if (typeId) {
        typeIds.push(typeId)
        this.$refs.multipleTable.clearSelection()
      } else {
        this.multipleSelection.forEach(row => {
          typeIds.push(row.tyId)
        })
        this.$refs.multipleTable.clearSelection()
      }
      this.$axios.post('/sys/goodsType/delete/', typeIds).then(res => {
        this.getTypes()
        this.$message({
          showClose: true,
          message: 'Succeed',
          type: 'success',
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
          this.$axios.post('/sys/goodsType/' + (this.editForm.tyId ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.getTypes()
                this.dialogVisible = false;
                this.$message({
                  showClose: true,
                  message: 'Succeed',
                  type: 'success',
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
        tyId: null,
        tyName: '',
        tySuper: ''
      }
    },
    getTypes() {
      this.$axios.get('/sys/goodsType/list', {
        params: {
          tyName: this.searchForm.tyName,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.tableData.forEach((t) => {
          if (t.tySuper == null) {
            t.tySuper = '无'
          }
        })
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    getSuperId() {
      this.$axios.get('/sys/goodsType/id').then(res => {
        this.itemList = res.data.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.canDelete = val.length == 0
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getTypes()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getTypes()
    },
    sortBytyId(a, b) {
      let res = parseInt(a.tyId) - parseInt(b.tyId)
      return res
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