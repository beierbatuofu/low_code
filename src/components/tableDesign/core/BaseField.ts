/*
 * @Author: ben
 * @LastEditTime: 2021-06-18 18:33:45
 */

import { Component, Vue, Watch, Prop , PropSync , Emit} from "vue-property-decorator";
 
@Component
export default class BaseField extends Vue {
    @Prop({type:Object,default:()=>({})}) config!:TJson;
    @Prop({type:Object,default:()=>({})}) form!:TJson;
    @Prop({type:String,default:''}) prop!:string;
    @Prop({type:String,default:"design"}) mode!:string;
}