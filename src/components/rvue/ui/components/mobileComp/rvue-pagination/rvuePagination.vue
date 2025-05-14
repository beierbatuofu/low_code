<script lang="tsx">
import { Component, Vue, Prop, Model, PropSync } from "vue-property-decorator";
import { Pagination } from 'vant';
import { CreateElement } from "vue";
import { VNode } from "vue";
@Component({})
class RvueMobliePagination extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-pagination";
    @Prop({ type: String, default: "multi" }) mode!:string;
    @Prop({ type: String, default: "上一页" }) prevText!:string;//上一页
    @Prop({ type: String, default: "下一页" }) nextText!:string;//下一页
    @Prop({ type: Number }) pageCount!:number;//总页数
    @Prop({ type: Number, default: 0 }) totalItems!:number;//总记录数
    @Prop({ type: String || Number, default: "10" }) itemsPerPage!:string | number;//每页记录数
    @Prop({ type: String || Number, default: "5" }) showPageSize!:string | number;//显示页码个数
    @Prop({ type: Boolean, default: false }) forceEllipses!:boolean;//是否显示省略号
    @Model("change", {type: Number, default: 0}) value!: number;
    private get inputValue(){
        return  this.value;
    }

    private set inputValue(n:number) {
		this.$emit("change", n);
	}

    private handelChange(n:number){
        this.$emit("PageChange",n)
    }
    protected render(h: CreateElement){
         let SlotDefaults: any = this.$slots.default || [];
         let { inputValue, mode, prevText, nextText, totalItems, pageCount, itemsPerPage, showPageSize, forceEllipses } = this;
         let props = {inputValue, mode, prevText, nextText, totalItems, pageCount, itemsPerPage, showPageSize, forceEllipses};
         return <van-pagination props = { props } 
                               on-change={this.handelChange}
                >
                    {SlotDefaults.map((item:TJson) => item)}
                </van-pagination>
    }  
}
RvueMobliePagination.install = function (Vue: any) {
	Vue.component(RvueMobliePagination.compName, RvueMobliePagination);
};
export default RvueMobliePagination;
</script>