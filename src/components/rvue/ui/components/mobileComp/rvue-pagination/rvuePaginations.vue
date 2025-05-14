<template>
    <div>
        <van-pagination :mode="mode"
                        :items-per-page="itemsPerPage"
                        :show-page-size="showPageSize"
                        :forc-ellipses="forceEllipses"
                        :total-items="totalItems"
                        :page-count="pageCount"
                        
        ></van-pagination>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model, PropSync } from "vue-property-decorator";
import { Pagination } from 'vant';
@Component({})
class RvueMobliePagination extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-pagination";
    @Prop({ type: String, default: "multi" }) mode!:string; //显示模式
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
}
RvueMobliePagination.install = function (Vue: any) {
	Vue.component(RvueMobliePagination.compName, RvueMobliePagination);
};
Vue.use(Pagination);
export default RvueMobliePagination;
</script>