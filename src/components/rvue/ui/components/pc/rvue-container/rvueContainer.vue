<template>
	<el-container :direction="direction">
		<el-header :height="height"></el-header>
		<el-container>
			<el-aside :width="width"></el-aside>
		</el-container>
		<el-container>
			<el-main></el-main>
			<el-footer :height="height"></el-footer>
		</el-container>
	</el-container>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
declare type TDirection = "horizontal " | " vertical ";
@Component({})
class RvueContainer extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-container";
	@Prop({ type: String, default: "vertical" }) direction!: TDirection;
	@Prop({ type: String, default: "60px" }) height!: string;
	@Prop({ type: String, default: "300px" }) width!: string;
}
RvueContainer.install = function (Vue: any) {
	Vue.component(RvueContainer.compName, RvueContainer);
};
export default RvueContainer;
</script>