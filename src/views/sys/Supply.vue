<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
        <el-button style="margin: 5px" type="primary" @click="dialogVisible = true;updateOrSave = '添加';getItemList()">新增</el-button>
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
        :row-key="(row) => {return row.spId}"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          label="供应记录编号"
          align="center"
          prop="sp_id">
      </el-table-column>
      <el-table-column
          label="供应商编号"
          align="center"
          prop="spr_id">
      </el-table-column>
      <el-table-column
          label="供应商名称"
          align="center"
          prop="spr_name">
      </el-table-column>
      <el-table-column
          label="商品编号"
          align="center"
          prop="gd_id">
      </el-table-column>
      <el-table-column
          label="商品名称"
          align="center"
          prop="gd_name">
      </el-table-column>
      <el-table-column
          label="供应量"
          align="center"
          prop="sp_amount">
      </el-table-column>
      <el-table-column
          label="供应金额"
          align="center"
          prop="sp_price">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.sp_id);getItemList()">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.sp_id)">
            <el-button
                size="mini"
                type="text"
                slot="reference"
            >删除</el-button>
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
        <el-form-item label="供应商" prop="sprId">
          <el-select v-model="editForm.sprId" placeholder="请选择供应商">
            <el-option :label="item.spr_name" :value="item.spr_id" v-for="(item, index) in sprItemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="sprId">
          <el-select v-model="editForm.gdId" placeholder="请选择商品">
            <el-option :label="item.gd_name" :value="item.gd_id" v-for="(item, index) in gdItemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应数量" prop="spAmount">
              <el-input type="number" min="0" v-model="editForm.spAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应金额" prop="spPrice">
              <el-input type="number" min="0" step="0.5" v-model="editForm.spPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" v-model="updateOrSave" @click="submitForm('editForm')">{{updateOrSave}}</el-button>
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
  name: "Supply",
  data() {
    return {
      updateOrSave: '',

      total: 0,
      size: 10,
      current: 1,

      canDelete: true,

      itemList: [ ],
      dialogVisible: false,
      editForm: {
        spId: null,
        sprId: null,
        sprName: '',
        gdId: null,
        gdName: '',
        spAmount: '',
        spPrice: ''
      },
      rules: {
        sprId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        gdId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        spAmount: [
          { required: true, message: '请输入供应量', trigger: 'blur' }
        ],
        spPrice: [
          { required: true, message: '请输入供应金额', trigger: 'blur' }
        ]
      },
      tableData: [],
      multipleSelection: [],
      search: '',
      sprItemList: [],
      gdItemList: []
    }
  },
  created() {
    this.getSupplies()
  },
  methods: {
    handleEdit(spId) {
      this.updateOrSave = '更新'
      this.$axios.get('/sys/supply/info/' + spId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(spId) {
      let spIds = [ ]
      if (spId) {
        spIds.push(spId)
        this.$refs.multipleTable.clearSelection()
      } else {
        this.multipleSelection.forEach(row => {
          spIds.push(row.spId)
          this.$refs.multipleTable.clearSelection()
        })
      }
      this.$axios.post('/sys/supply/delete/', spIds).then(res => {
        this.getSupplies()
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
          this.$axios.post('/sys/supply/' + (this.editForm.spId ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.getSupplies()
                this.dialogVisible = false
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
        spId: null,
        sprId: null,
        sprName: '',
        gdId: null,
        gdName: '',
        spAmount: '',
        spPrice: ''
      }
    },
    getSupplies() {
      this.$axios.get('/sys/supply/list', {
        params: {
          current: this.current,
          size: this.size
        }
      }).then(res => {
        console.log(res.data.data)
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    getItemList() {
      this.$axios.get('/sys/supplier/id').then(res => {
        this.sprItemList = res.data.data
      })
      this.$axios.get('/sys/goodsInfo/id').then(res => {
        this.gdItemList = res.data.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.canDelete = val.length == 0
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val
      this.getSupplies()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getSupplies()
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