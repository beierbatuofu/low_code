<template>
    <el-breadcrumb :separator="separator" :separator-class="separatorClass">
        <el-breadcrumb-item :to="to" :replace="replace"></el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script lang="ts">
import { Component, Vue, Prop, } from "vue-property-decorator";
@Component({})
class RvueBreadcrumb  extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-breadcrumb";
        @Prop({ type: String, default: "/"}) separator!: string;//分隔符
        @Prop({ type: String }) separatorClass!: string; //图标分隔符 class

        @Prop({ type:[String,Object]}) to!:string | object; //路由跳转对象
        @Prop({ type: Boolean, default: false }) replace!: boolean; //在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录
    }
RvueBreadcrumb.install = function (Vue: any) {
		Vue.component(RvueBreadcrumb.compName, RvueBreadcrumb);
	};
	export default RvueBreadcrumb;
</script>