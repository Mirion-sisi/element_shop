<template>
  <div class="addgoods-container">
    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图部分 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert center :closable="false" title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤条区域 -->
      <el-steps align-center :active="activeIndex-0" finish-status="success">
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
          v-model="activeIndex"
          tab-position="left"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParamsData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2,index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParamsData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="pictureList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" ref="myQuillEditorRef"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button @click="putGoodsForm" class="addGoodsBtn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览dialog -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import { getCateList } from "../../network/categories";
import { getParamsList } from "../../network/params";
import { addGoods } from "../../network/goodslist";
export default {
  name: "AddGoods",
  data() {
    return {
      // 步骤条的当前索引
      activeIndex: "0",
      //   添加表单数据对象
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 商品的详情描述
        goods_introduce: "",
        // 图片列表
        pics: [],
        // 商品参数/属性数组{ attr_id: '',attr_value:''}
        attrs: []
      },
      //   验证添加表单数据对象
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      //   商品分类列表
      cateList: [],
      // 级联选择器,商品分类规则
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      //   选中的商品的静态属性列表
      onlyParamsData: [],
      // 选中的商品的动态参数列表
      manyParamsData: [],
      //   上传图片的url地址
      uploadURL: "https://renoblog.xyz/api/private/v1/upload",
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 图片列表
      pictureList: [],
      //   图片上传后真实的url
      previewPath: "",
      // 预览图片的dialog
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    //   商品的三级id
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3)
        return this.addGoodsForm.goods_cat[2];
      return null;
    }
  },
  methods: {
    //   获取商品分类的列表
    async getCateList() {
      const res = await getCateList({ type: 3 });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类列表失败");
      this.cateList = res.data;
      console.log(res.data);
    },
    // 级联选择器发生变化时的监听函数
    handleChange() {
      // 控制级联选择器只能选择三级分类
      if (this.addGoodsForm.goods_cat.length !== 3)
        this.addGoodsForm.goods_cat = [];
      console.log(this.addGoodsForm.goods_cat);
    },
    // 监听tabs的切换的钩子函数,即将进入的tab,和以前的tab
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 监听tabs的点击事件
    async tabClick() {
      console.log("ll");
      if (this.activeIndex === "1") {
        const res = await getParamsList(this.cateId, "many");
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败");
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyParamsData = res.data;
        console.log(this.manyParamsData);
      } else if (this.activeIndex === "2") {
        const res = await getParamsList(this.cateId, "only");
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数列表失败");
        this.onlyParamsData = res.data;
        console.log(this.onlyParamsData);
      }
    },
    // 监听图片预览,处理图片预览事件
    handlePreview(file) {
      console.log(file);
      this.previewPath = "https://renoblog.xyz/" + file.response.data.tmp_path;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中,找到这个图片的索引
      const i = this.addGoodsForm.pics.findIndex(item => {
        item.pic === filePath;
      });

      // 3.调用数组的splice方法,把图片信息对象,从pics数组中移除
      this.addGoodsForm.pics.splice(i, 1);
      console.log(this.addGoodsForm);
    },
    // 监听图片上传成功的操作
    handleSuccess(response, file, fileList) {
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      };
      // 2.将图片信息对象,push到pics数组中
      this.addGoodsForm.pics.push(picInfo);
      console.log(this.addGoodsForm);
    },
    // 添加商品
    putGoodsForm() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return this.$message.error("请填写必要的表单项");

        // 执行添加的业务,因为级联选择器绑定了.goods_cat属性,它是数组类型
        // 需要改成字符串类型,不能直接操作绑定的属性
        //  ,这里我们深拷贝一个对象,操作这个对象就好
        const form = _.cloneDeep(this.addGoodsForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数,需要将参数数组变成字符串
        this.manyParamsData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };

          this.addGoodsForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyParamsData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addGoodsForm.attrs.push(newInfo);
        });
        form.attrs = this.addGoodsForm.attrs;
        console.log(form);
        // 发起请求添加商品
        // 商品的名称,必须是唯一的
        const res = await addGoods(form);
        if(res.meta.status!==201)
        return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
        
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0;
}
.previewImg {
  width: 100%;
}
.addGoodsBtn {
  margin-top: 15px;
}
</style>