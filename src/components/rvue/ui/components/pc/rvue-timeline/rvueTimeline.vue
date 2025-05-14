<!--
 * @Author: ben
 * @LastEditTime: 2021-07-30 17:49:09
-->
<script lang="ts">
import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
import { CreateElement } from "vue";
import { VNode } from "vue";
declare type TPlacement = "bottom" | "top";
declare type TTimelineType = "primary" | "success" | "warning" | "danger" | "info";
declare type TTimelineColor = "hsl" | "hsv" | "hex" | "rgb";
declare type TTimelineSize = "normal" | "large";

@Component({})
class rvueTimeline extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-timeline";
	@Prop({ type: Boolean, default: false }) reverse!: boolean;
	@Prop({ type: String }) icon!: string;
	@Prop({ type: String, default: "normal" }) size!: TTimelineSize;
	@Prop({ type: String }) color!: TTimelineColor;
	@Prop({ type: String }) type!: TTimelineType;
	@Prop({ type: String }) placement!: TPlacement;
	@Prop({ type: Boolean, default: false }) hideTimestamp!: boolean;

	private createChild(h: CreateElement) {
		let nodes: VNode[] = [];
		(<VNode[]>this.$slots.default).forEach((node: VNode) => {
			const props = (<TJson>node.data).attrs;
			nodes.push(
				h(
					"el-timeline-item",
					{
						props,
					},
					node.children
				)
			);
		});

		return nodes;
	}

	protected render(h: CreateElement) {
		let self = this;
		let childrens = this.createChild(h);
		return h(
			"el-timeline",
			{
				props: {
					reverse: self.reverse,
				},
			},
			childrens
		);
	}
}

rvueTimeline.install = function (Vue: any) {
	Vue.component(rvueTimeline.compName, rvueTimeline);
};

export default rvueTimeline;
</script>
<style lang="scss" scoped></style>
