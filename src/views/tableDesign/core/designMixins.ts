import { Vue, Component } from 'vue-property-decorator';
import { buttonList, systemList, tableList } from "@core/defaultValue/tableDesign";
import { getFormSingle, getRightList } from "@/api/form";


@Component
export default class designMixins extends Vue {
  
  
    private renderObj:any = {// 数据请求json
      component: "",
      defaultValueComponent: "",
      prop: "",
      type: "",
      title: {},
      dateOptions:[],
      defaultValue:[] ,
      method: "",
      // queryStyle: "1", 
      defaultStyle:'1'
    } 
    // private renderKey=['component','defaultValueComponent','prop','type','title','dateOptions','defaultValue','method','defaultStyle']

    private requestKey=['type','value','prop','readonly','method','defaultValue','defaultStyle']

    private requestObj:any = {//渲染json
      type: "",
      value: { //默认值
        custom:'' //为任意类型  eq:字符串 ,between: 数组
      },
      prop:'', //唯一id
      readonly:false, //只读
      method:'',//eq:字符串 ,between: 数组
      defaultValue:[] ,  //默认值 为任意类型  eq:字符串 ,between: 数组
      defaultStyle: "1", //查询样式
    } 


     private async getList(appCode:any,formCode:any){
      let {code ,data} =  await getFormSingle(appCode,formCode)
      if (code == '0') {
        let defalutSystemList:any = []
        if (data.type == "C") {
					defalutSystemList = systemList.filter((item: any) => {
						return item.type != "process_status";
					});
				} else { 
					defalutSystemList = systemList.filter((item: any) => { 
						return item.type != "update_time"; 
					});
				}
        // (<any>this).isProcess = data.type == "C" ? false : true;
      }
    }


    protected created(){
      let { appCode, id: formCode } = this.$route.params;
			(<any>this).buttonList = buttonList; 
			(<any>this).tableList = tableList;
      this.getList(appCode,formCode)
    }
}