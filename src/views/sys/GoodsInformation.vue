<template>
  <div>
    <el-form style="height: 45px" :inline="true">
      <el-form-item style="height: 45px">
        <el-input
            style="height: 45px; width: 240px; margin-top: 5px"
            v-model="searchForm.gdName"
            placeholder="商品名称"
            clearable
        />
      </el-form-item>
      <el-form-item style="height: 45px">
        <el-button style="margin-top: 5px" @click="getGoodsInformation()">搜索</el-button>
      </el-form-item>
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
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        :row-key="(row) => {return row.gdId}"
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
          label="商品编号"
          prop="gdId"
          align="center">
      </el-table-column>
      <el-table-column
          label="商品名称"
          prop="gdName"
          align="center">
      </el-table-column>
      <el-table-column
          label="所属品牌编号"
          prop="brdId"
          align="center">
      </el-table-column>
      <el-table-column
          label="所属类型编号"
          prop="tyId"
          align="center">
      </el-table-column>
      <el-table-column
          prop="gdMarketPrice"
          label="市场价"
          align="center">
      </el-table-column>
      <el-table-column
          prop="gdCostPrice"
          label="成本价"
          align="center">
      </el-table-column>
      <el-table-column
        prop="gdIntro"
        label="介绍"
        align="center">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleCheckIntroduction(scope.row.gdId)"
          >查看</el-button>
        </template>
    </el-table-column>
      <el-table-column
          prop="gdAmount"
          align="center"
          label="库存量">
      </el-table-column>
      <el-table-column
          prop="gdUnit"
          align="center"
          label="单位">
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.gdId);getItemList">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.gdId, scope.row)">
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
        <el-form-item label="商品名称" prop="gdName">
          <el-input v-model="editForm.gdName"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌" prop="brdId">
          <el-select v-model="editForm.brdId" placeholder="请选择商品所属品牌名称">
            <el-option :label="item.brd_name" :value="item.brd_id" v-for="(item, index) in brdItemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" prop="tyId">
          <el-select v-model="editForm.tyId" placeholder="请选择商品所属品牌名称">
            <el-option :label="item.ty_name" :value="item.ty_id" v-for="(item, index) in tyItemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="市场价" prop="gdMarketprice">
              <el-input type="number" min="0" step="0.5" placeholder="单位：元" v-model="editForm.gdMarketprice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价" prop="gdCostprice">
              <el-input type="number" min="0" step="0.5" placeholder="单位：元" v-model="editForm.gdCostprice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="介绍">
          <el-input type="textarea" show-word-limit maxlength="100" v-model="editForm.gdIntro"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存量" prop="gdAmount">
              <el-input v-model="editForm.gdAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="gdUnit">
              <el-input v-model="editForm.gdUnit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button v-model="updateOrSave" type="primary" @click="submitForm('editForm')">{{ updateOrSave }}</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsInformation",
  data() {
    return {
      updateOrSave: '',

      tyItemList: [ ],
      brdItemList: [ ],
      searchForm: { },
      multipleSelection: [],
      canDelete: true,
      editForm: {
        gdId: null,
        gdName: '',
        tyId: '',
        tyName: '',
        gdMarketprice: '',
        gdCostprice: '',
        gdIntro: '',
        gdAmount: '',
        gdUnit: ''
      },
      rules: {
        gdName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        brdId: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        tyId: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        gdMarketPrice: [
          { required: true, message: '请填写市场价', trigger: 'blur' }
        ],
        gdCostPrice: [
          { required: true, message: '请填写成本价', trigger: 'blur' }
        ],
        gdAmount: [
          { required: true, message: '请填写库存量', trigger: 'blur' }
        ],
        gdUnit: [
          { required: true, message: '请填写单位', trigger: 'blur' }
        ]
      },
      introductionText: '',
      dialogVisible: false,
      introductionVisible: false,
      tableData: [ ],
      size: 10,
      current: 1,
      total: 0
    }
  },
  created() {
    this.getGoodsInformation()
  },
  methods: {
    handleEdit(gdId) {
      this.updateOrSave = '更新'
      this.$axios.get('/sys/goodsInfo/info/' + gdId).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleDelete(gdId, row) {
      let gdIds = []
      if (gdId) {
        gdIds.push(gdId)
        this.$refs.multipleTable.clearSelection()
      } else {
        this.multipleSelection.forEach(row => {
          gdIds.push(row.gdId)
        })
        this.$refs.multipleTable.clearSelection()
      }
      this.$axios.post('/sys/goodsInfo/delete', gdIds).then(res => {
        this.getGoodsInformation()
        this.$message({
          showClose: true,
          message: 'Succeed',
          type: 'success',
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.canDelete = val.length === 0
    },
    handleClose() {
      this.resetForm('editForm')
      this.introductionVisible = false
      this.dialogVisible = false
    },
    handleCheckIntroduction(gdId) {
      this.$axios.get('/sys/goodsInfo/intro/' + gdId).then(res => {
        this.introductionText = res.data.data
        this.introductionVisible = true
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/goodsInfo/' + (this.editForm.gdId ? 'update' : 'save'), this.editForm)
          .then(res => {
            this.dialogVisible = false
            this.getGoodsInformation()
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
        gdId: null,
        gdName: '',
        tyId: '',
        tyName: '',
        speciName: '',
        speciId: '',
        gdMarketPrice: '',
        gdCostPrice: '',
        gdIntro: '',
        gdAmount: ''
      }
    },
    handleSizeChange(val) {
      this.size = val
      this.getGoodsInformation()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getGoodsInformation()
    },
    getGoodsInformation() {
      this.$axios.get('/sys/goodsInfo/list', {
        params: {
          gdName: this.searchForm.gdName,
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
    getItemList() {
      this.$axios.get('/sys/brand/id').then(res => {
        this.brdItemList = res.data.data
      })
      this.$axios.get('/sys/goodsType/id').then(res => {
        this.tyItemList = res.data.data
      })
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