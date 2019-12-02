<template>
  <div class="params-container">
    <!-- 1.面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.卡片视图 -->
    <el-card class="box-card">
      <!-- 头部警告区 -->
      <el-alert show-icon :closable="false" title="注意:只允许为第三级分类设置相关参数" type="warning"></el-alert>
      <!-- 选择商品分类的区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props=" cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的按钮 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisabled"
            size="mini"
            type="primary"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  @close="handleClose(index,scope.row)"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 添加新的标签 -->
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editClick(scope.row.attr_id)" size="mini" type="primary">编辑</el-button>
                <el-button @click="deleteClick(scope.row.attr_id)" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisabled"
            size="mini"
            type="primary"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  @close="handleClose(index,scope.row)"
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editClick(scope.row.attr_id)" size="mini" type="primary">编辑</el-button>
                <el-button @click="deleteClick(scope.row.attr_id)" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数或属性的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addParamsDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数属性的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCateList } from "../../network/categories";
import {
  getParamsList,
  addParams,
  getParamsById,
  putEditParams,
  deleteParams
} from "../../network/params";
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      cateList: [],

      //   级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      //   级联选择框的双向绑定到的数组
      selectedCateKeys: [],
      //   被激活的tab的名称
      activeName: "many",
      //   动态参数的数据
      manyTableDate: [],
      //   静态属性的数据
      onlyTableDate: [],
      //   控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addParamsForm: {
        attr_name: ""
      },
      // 添加表单验证规则对象
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //   修改参数对话框的显示与否
      editDialogVisible: false,
      // 要修改的参数属性的表单数据
      editParamsForm: {},
      // 要修改的参数属性的表单数据验证规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //   控制按钮与文本框的切换显示
      inputVisible: false,
      // 文本框输入的内容
      inputValue: ""
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    //   如果按钮需要被禁用,则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      return false;
    },
    // 当前选中的三级分类Id
    cateId() {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2];
      return null;
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    }
  },
  methods: {
    //   获取所有的商品分类列表
    async getCateList() {
      const res = await getCateList({ type: 3 });
      console.log(res);

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateList = res.data;
    },
    // 级联选择框选中项变化,会触发这个函数
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableDate = [];
        this.onlyTableDate = [];
        return this.$message.error("你选择的不是三级分类,不能获取列表");
      }
      this.getParamsLsit();
    },
    // tab监听点击事件
    handleTabClick() {
      this.getParamsLsit();
    },
    // 获取参数的列表数据
    async getParamsLsit() {
      //   根据所选分类的Id,和当前所处的面板,获取对应的参数
      const res = await getParamsList(this.cateId, this.activeName);
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //   控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
      console.log(res);
    },
    // 监听添加参数对话框的关闭事件
    addParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields();
    },
    // 点击按钮,添加参数
    addParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return;
        const res = await addParams(
          this.cateId,
          this.addParamsForm.attr_name,
          this.activeName
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        console.log(res);
        this.$message.success("天机参数成功");
        this.addDialogVisible = false;
        this.getParamsLsit();
      });
    },
    // 点击编辑按钮触发的事件
    async editClick(id) {
      const res = await getParamsById(this.cateId, id, this.activeName);
      if (res.meta.status !== 200)
        return this.$message.error("获取参数数据失败");
      this.editParamsForm = res.data;

      this.editDialogVisible = true;
    },
    // 点击确认按钮后,修改参数属性
    async editParams() {
      const res = await putEditParams(
        this.cateId,
        this.editParamsForm.attr_id,
        this.editParamsForm.attr_name,
        this.activeName
      );
      if (res.meta.status !== 200) return this.$message.error("修改参数失败");
      this.$message.success("修改参数成功");
      this.getParamsLsit();
      this.editDialogVisible = false;
    },
    // 修改属性,重置表单操作
    editDialogClosed() {
      this.$refs.editParamsFormRef.resetFields();
    },
    // 删除参数，根据Id
    async deleteClick(attr_id) {
      const result = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);

      if (result !== "confirm") return this.$message.info("已取消删除");

      // 删除业务逻辑
      const res = await deleteParams(this.cateId, attr_id);
      if (res.meta.status !== 200) return this.$message.error("删除参数失败");
      this.$message.success("删除参数成功");
      this.getParamsLsit();
    },
    // 文本框失去焦点或按下enter键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //   如果没有return，证明输入内容需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 将修改保存到数据库中
      this.saveAttrVals(row);
    },
    // 将对attr_vals的操作阿波存到数据库
    async saveAttrVals(row) {
      // 需要发送请求将增加的tag放在数据库中
      const res = await putEditParams(
        this.cateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(" ")
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      //   让文本框获得的焦点
      //  $nextTick当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    }
  }
};
</script>
<style lang="less" scoped>
.cat-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
