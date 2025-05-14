<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import rvueCol from "./rvueCol.vue";
	type TJustify = "start" | "end" | "center" | "space-around" | "space-between";
	type TAlign = "top" | "middle" | "bottom";

	@Component({
		"rvue-col": rvueCol,
	})
	class RvueRow extends Vue {
		@Model("change", { type: [String, Number] }) value!: string | number;
		public static install: (param: Vue) => any;
		public static compName = "rvue-row";

		@Prop({ type: Number, default: 0 }) gutter!: number;
		@Prop({ type: String, default: "" }) type!: string;
		@Prop({ type: String, default: "start" }) justify!: TJustify;
		@Prop({ type: String, default: "start" }) align!: TAlign;
		@Prop({ type: String, default: "div" }) tag!: string;

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default || [];

			const props = {
				gutter: this.gutter,
				type: this.type,
				justify: this.justify,
				align: this.align,
				tag: this.tag,
			};
			return (
				<el-row props={props}>
					{SlotDefaults.map((col: any) => {
						let props = col.componentOptions.propsData;
						let children = col.componentOptions.children;
						return <el-col props={props}>{children && children.map((item: any) => <span>{item}</span>)}</el-col>;
					})}
				</el-row>
			);
		}
	}
	RvueRow.install = function (Vue: any) {
		Vue.component(RvueRow.compName, RvueRow);
	};
	export default RvueRow;
</script>
<style lang="scss" scoped></style>
