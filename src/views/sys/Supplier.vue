<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
        <el-input
            style="height: 45px; width: 240px; margin-top: 5px"
            v-model="searchForm.sprName"
            placeholder="供应商名称"
            clearable
        />
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin-top: 5px" @click="getSuppliers()">搜索</el-button>
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin: 5px" type="primary" @click="dialogVisible = true; updateOrSave = '添加'">新增</el-button>
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
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :row-key="(row) => {return row.sprId}"
        border
        stripe
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="30px"
          :reserve-selection="true"
          align="center">
      </el-table-column>
      <el-table-column
          label="供应商编号"
          prop="sprId"
          align="center">
      </el-table-column>
      <el-table-column
          label="供应商名称"
          prop="sprName"
          align="center">
      </el-table-column>
      <el-table-column
          label="联系人"
          prop="sprContacts"
          align="center">
      </el-table-column>
      <el-table-column
          label="联系电话"
          prop="sprPhone"
          align="center">
      </el-table-column>
      <el-table-column
          prop="sprIntro"
          label="介绍"
          align="center">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleCheckIntroduction(scope.row.sprId)"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.sprId)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.sprId, scope.row)">
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
        title="介绍"
        :visible.sync="introductionVisible"
        width="30%"
        :before-close="handleClose"
        v-model="introductionText">
      <span>{{introductionText}}</span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="供应商名称" prop="sprName">
          <el-input v-model="editForm.sprName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="sprContacts">
          <el-input v-model="editForm.sprContacts"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="sprPhone">
          <el-input v-model="editForm.sprPhone"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" show-word-limit maxlength="100" v-model="editForm.sprIntro"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-model="updateOrSave" @click="submitForm('editForm')">{{ updateOrSave }}</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Supplier",
  data() {
    return {
      updateOrSave: '',

      searchForm: { },
      multipleSelection: [],
      canDelete: true,
      editForm: {
        sprId: null,
        sprName: '',
        sprContacts: '',
        sprPhone: '',
        sprIntro: ''
      },
      rules: {
        sprName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
        ],
        sprContacts: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' },
        ],
        sprPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ]
      },
      introductionText: '',
      dialogVisible: false,
      introductionVisible: false,
      tableData: [ ],
      size: 1,
      current: 1,
      total: 0
    }
  },
  created() {
    this.getSuppliers()
  },
  methods: {
    handleEdit(sprId) {
      this.updateOrSave = '更新'
      this.$axios.get('/sys/supplier/info/' + sprId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(sprId, row) {
      let sprIds = []
      if (sprId) {
        sprIds.push(sprId)
        this.$refs.multipleTable.clearSelection()
      } else {
        this.multipleSelection.forEach(row => {
          sprIds.push(row.sprId)
        })
        this.$refs.multipleTable.clearSelection()
      }
      this.$axios.post('/sys/supplier/delete', sprIds).then(res => {
        this.getSuppliers()
        this.$message({
          showClose: true,
          message: 'Succeed',
          type: 'success',
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.canDelete = val.length == 0
    },
    handleClose(done) {
      this.resetForm('editForm')
      this.introductionVisible = false
      this.dialogVisible = false
    },
    handleCheckIntroduction(gdId) {
      this.$axios.get('/sys/supplier/intro/' + gdId).then(res => {
        this.introductionText = res.data.data
        this.introductionVisible = true
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/supplier/' + (this.editForm.sprId ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.dialogVisible = false
                this.getSuppliers()
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
        sprId: null,
        sprName: '',
        sprContacts: '',
        sprPhone: '',
        sprIntro: ''
      }
    },
    handleSizeChange(val) {
      this.size = val
      this.getSuppliers()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getSuppliers()
    },
    getSuppliers() {
      this.$axios.get('/sys/supplier/list', {
        params: {
          gdName: this.searchForm.sprName,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
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
.el-dialog__wrapper {
  line-height: 20px;
}

.el-dialog__title {
  position:absolute;
}

.el-dialog__header {
  position:relative;
  height: 50px;
}
</style>