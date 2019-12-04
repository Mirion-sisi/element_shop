<template>
  <div class="report-container">
    <div id="main" style="width:1000px;height:400px;"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { getReportData } from "../../network/report";
import _ from 'lodash'
export default {
  name: "Report",
  data() {
    return {
        // 需要合并的数据,添加鼠标跟随效果
      options:{
          title:{
              text:'用户来源'
          },
          tooltip:{
              trigger:'axis',
              axisPointer:{
                  type:'cross',
                  label:{
                      backgroundColor:'#E9EEF3'
                  }
              }
          },
          grid:{
              left:'3%',
              rigth:'4%',
              bottom:'3%',
              containLabel:true,
              xAxis:[
                  {
                      boundaryGap:false
                  }
              ],
              yAxis:[
                  {
                      type:'value'
                  }
              ]
          }
      }
    };
  },
  created() {
   
  },
  // 此时dom已经渲染完
 async mounted() {
      const res = await getReportData();
      if (res.meta.status !== 200)
        return this.$message.error("获取报表数据失败");
      
    // 1.基于准备好的dom,初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 2.准备数据和配置项
    // 将后台得到的数据与data中的options合并,合并两个对象
   const result= _.merge(res.data,this.options)
   console.log(result)
    // 3使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);   
  },
  methods: {
    // async getReportData() {
    //   const res = await getReportData();
    //   if (res.meta.status !== 200)
    //     return this.$message.error("获取报表数据失败");
    //   this.reportData = res.data;
    //   console.log(res.data);
    //   console.log(res.meta);
    //   console.log(this.reportData)
    // }
  }
};
</script>
<style lang="less" scoped>
</style>