<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import RvueTabPane from "./rvueTabPane.vue";

	declare type TTabsType = "card" | "border-card";
	declare type TTabPosition = "top" | "right" | "bottom" | "left";
	declare type TTabAction = "remove" | "add";

	@Component({})
	class RvueTabs extends Vue {
		@Model("change", { type: [String, Number] }) value!: string | number;
		@Prop({ type: String }) type!: TTabsType;
		@Prop({ type: Boolean, default: false }) closable!: boolean;
		@Prop({ type: Boolean, default: false }) addable!: boolean;
		@Prop({ type: Boolean, default: false }) editable!: boolean;
		@Prop({ type: Boolean, default: false }) stretch!: boolean;
		@Prop({ type: String, default: "top" }) tabPosition!: TTabPosition;
		@Prop({ type: Function, default: () => {} }) beforeLeave!: () => void;

		public static install: (param: Vue) => any;
		public static compName = "rvue-tabs";

		private handleClick(evt: TJson) {
			this.$emit("change", evt.name);
			this.$emit("tab-click", evt);
		}

		private handleRemove(name: string) {
			this.$emit("tab-remove", name);
		}

		private handleAdd(evt: Event) {
			this.$emit("tab-add", evt);
		}

		private handleEdit(targetName: string, aciton: TTabAction) {
			this.$emit("edit", targetName, aciton);
		}

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default;
			let { value, type, closable, addable, editable, tabPosition, stretch, beforeLeave } = this;
			let props = { value, type, closable, addable, editable, "tab-position": tabPosition, stretch, "before-leave": beforeLeave };

			return (
				<el-tabs props={props} on-tab-add={this.handleAdd} on-edit={this.handleEdit} on-tab-click={this.handleClick} on-tab-remove={this.handleRemove}>
					{SlotDefaults &&
						SlotDefaults.map((item: any) => {
							if (!item.componentOptions) return <div></div>;
							let { label, name, disabled, closable, lazy } = item.componentOptions.propsData;
							let itemProps = { label, name, disabled, closable, lazy };

							return (
								<el-tab-pane props={itemProps}>
									{item.componentOptions.children &&
										item.componentOptions.children.map((ite: any) => {
											if (ite.data?.slot == "label") {
												return <div slot="label">{ite}</div>;
											}
											return ite;
										})}
								</el-tab-pane>
							);
						})}
				</el-tabs>
			);
		}
	}
	RvueTabs.install = function (Vue: any) {
		Vue.component(RvueTabs.compName, RvueTabs);
	};
	export default RvueTabs;
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
		}
	}
</style>
