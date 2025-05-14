<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
	})
	class RvueCheckGroup extends Vue {
		@Model("change", { type: Array }) value!: any[];

		public static install: (param: Vue) => any;
		public static compName = "rvue-checkbox-group";
		@Prop({ type: String }) size!: string;
		@Prop({ type: Number }) min!: number;
		@Prop({ type: Number }) max!: number;
		@Prop({ type: String, default: "#ffffff" }) textColor!: string;
		@Prop({ type: String, default: "#6087FD" }) fill!: string;

		private handleChange(...args: any[]) {}

		private handleCheck(isChecked: boolean, props: TJson) {
			if (isChecked) {
				this.value.push(props.label);
			} else {
				let idx = this.value.findIndex((l: string) => l == props.label);
				this.value.splice(idx, 1);
			}
		}

		protected render(h: CreateElement) {
			let props: TJson = {
				value: this.value,
				size: this.size,
				min: this.min,
				max: this.max,
				"text-color": this.textColor,
				fill: this.fill,
			};
			let defaultSlots = this.$slots.default;

			return (
				<el-checkbox-group props={props}>
					{defaultSlots &&
						defaultSlots.map((item: TJson, idx: number) => {
							if (item.componentOptions.tag == "rvue-checkbox") {
								let propsData = item.componentOptions.propsData;
								return (
									<el-checkbox
										on-change={(bool: any) => {
											this.handleCheck(bool, propsData);
										}}
										props={propsData}
									>
										{item.componentOptions.children && item.componentOptions.children.map((ite: TJson) => ite)}
									</el-checkbox>
								);
							} else {
								return item;
							}
						})}
				</el-checkbox-group>
			);
		}
	}

	RvueCheckGroup.install = function (Vue: any) {
		Vue.component(RvueCheckGroup.compName, RvueCheckGroup);
	};
	export default RvueCheckGroup;
</script>
<style lang="scss" scoped>
	.el-tabs {
		* {
			font-weight: normal;
		}
	}
	::v-deep .el-collapse-item {
		display: inline;
	}
	::v-deep .el-tabs__nav {
		& > div {
			padding: 0 10px;
		}
	}
</style>
