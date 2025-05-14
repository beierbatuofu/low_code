/*
 * @Description: Do not edit
 * @Date: 2021-12-21 14:20:45
 * @LastEditTime: 2022-03-25 09:36:43
 * @FilePath: \risen\src\views\bidesign\_components\costum\initCode.ts
 */
export function initCode(uid: string) {
	return `
//需要在option里加上dataset: {source: []}
//source是接口返回的数据
var option;
option = {
  legend: {},
  tooltip: {},
  xAxis: { type: 'category' },
  yAxis: {},
  grid: {
    top: "10%",
    left: "0%",
    right: "0%",
    bottom: "12%"
  },
  series: [
    { type: 'bar',
        itemStyle: {
        color: "#55ABF9"
      } 
    }, 
        { type: 'bar'}, 
        { type: 'bar'}
      ],
  dataset: {
        source: []
  },
};
fetchHandler().then((source)=>{
    option.dataset.source = source
    if(that.data.dimensions.length == 1){
      let addArray =  that.data.indicators.map((item)=>{
        return item.title[localStorage.getItem('lang')]
      })
      option.dataset.source.unshift(['product',...addArray])
      
    }else if(that.data.dimensions.length == 2){
     
    }
    // 流程状态转化
    option.dataset.source = transformProcessStatus(option.dataset.source)
    
   
    //设置echarts图表
    var chartDom = extend.create();
    that.echartInstance = echarts.init(chartDom);
    option && that.echartInstance && that.echartInstance.setOption(option,true);
}).catch((error)=>{
  
 option.dataset.source = []
 option && that.echartInstance && that.echartInstance.setOption(option,true);
})`;
}
