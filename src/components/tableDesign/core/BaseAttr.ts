/*
 * @Author: ben
 * @LastEditTime: 2021-06-17 13:18:45
 */

import { Component, Vue, Watch, Prop , PropSync , Emit} from "vue-property-decorator";
 
@Component
export default class BaseAttr extends Vue {

    @Prop({type:Object,default:()=>({})}) config!:TJson;
   


    @Emit('update')
    private handleUpdate(data:TJson){
        return data;
    }

    private size = 'small';
    private lang:string = localStorage.getItem("lang") || "zh";

    private get styleList(){
        return (<any>this).config.style;
    }

    private get dicData(){
        return (<any>this).config.dicData;
    }

  



}