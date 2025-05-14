<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";
	import rvueRadio from "./rvueRadio.vue";

	@Component({
		mixins: [Mixins],
		components: {
			"rvue-radio": rvueRadio,
		},
	})
	class RvueRadioGroup extends Vue {
		@Model("change", { type: [String, Number, Array] }) value!: string | number | any[];
		@Prop({ type: String, default: "#ffffff" }) textColor!: string;
		@Prop({ type: String, default: "#6087FD" }) fill!: string;
		@Prop({ type: String, default: "vertical" }) layout!: "vertical" | "horizontal";

		public static install: (param: Vue) => any;
		public static compName = "rvue-radio-group";

		private handleChange(props: any) {
			this.$emit("change", props.label);
		}

		private handleClear(evt: Event) {
			// @ts-ignore
			if (this.disabled) return;
			this.$emit("change", "");
		}

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default || [];

			let props = {
				value: this.value,
				// @ts-ignore
				size: this.size,
				// @ts-ignore
				disabled: this.disabled,
				"text-color": this.textColor,
				fill: this.fill,
				name: this.value,
			};

			return (
				<el-radio-group props={props}>
					{SlotDefaults.map((item: TJson, index: number) => {
						let props = item.componentOptions.propsData;
						return (
							<div style={{ margin: "3px 10px 3px 0", display: this.layout == "vertical" ? "block" : "inline-block" }}>
								<div style={{ position: "relative", display: "inline-block" }}>
									<el-radio props={props} on-change={() => this.handleChange(props)}>
										<span>{item.componentOptions.children && item.componentOptions.children.map((ite: TJson) => ite)}</span>
									</el-radio>
									<div on-click={this.handleClear} class="close"></div>
								</div>
							</div>
						);
					})}
				</el-radio-group>
			);
		}
	}

	RvueRadioGroup.install = function (Vue: any) {
		Vue.component(RvueRadioGroup.compName, RvueRadioGroup);
	};
	export default RvueRadioGroup;
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
	::v-deep .el-radio {
		margin-right: 10px;
		.el-radio__label {
			display: inline-block;
			white-space: pre-line;
			word-wrap: break-word;
			overflow: hidden;
			vertical-align: middle;
			line-height: 18px;
		}
		@media screen and (max-width: 768px) {
			.el-radio__label {
				display: inline-block;
				white-space: nowrap;
				word-wrap: break-word;
				overflow: hidden;
				vertical-align: middle;
				line-height: 18px;
			}
		}
	}
	.close {
		display: none;
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
	}

	::v-deep {
		.is-checked ~ .close {
			display: inline-block;
		}
	}
</style>
