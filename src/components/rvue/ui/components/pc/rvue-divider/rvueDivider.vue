<script lang="tsx">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import { VNode } from "vue";
declare type Tdirection = "horizontal " | "vertical";
declare type TPosition = "left" | "right" | "center";

@Component({})
class RvueDivider extends Vue {
	@Prop({ type: String, default: "horizontal" }) direction!: Tdirection;
	@Prop({ type: String, default: "center" }) contentPosition!: TPosition;

	protected render(h:CreateElement){
		let { direction, contentPosition }=this;
		let props={ direction, contentPosition };
		return <el-divider props={props}></el-divider>
	}
	public static install: (param: Vue) => any;
	public static compName = "rvue-divider";
}
RvueDivider.install = function (Vue: any) {
	Vue.component(RvueDivider.compName, RvueDivider);
};
export default RvueDivider;
</script>


