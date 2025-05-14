<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	declare type TTabsType = "card" | "border-card";
	declare type TTabPosition = "top" | "right" | "bottom" | "left";
	declare type TTabAction = "remove" | "add";

	@Component({})
	class RvueCollapse extends Vue {
		@Model("change", { type: [String, Array] }) value!: string | any[];
		@Prop({ type: String }) type!: TTabsType;
		@Prop({ type: Boolean, default: false }) closable!: boolean;
		@Prop({ type: Boolean, default: false }) addable!: boolean;
		@Prop({ type: Boolean, default: false }) editable!: boolean;
		@Prop({ type: Boolean, default: false }) stretch!: boolean;
		@Prop({ type: String, default: "top" }) tabPosition!: TTabPosition;
		@Prop({ type: Function, default: () => {} }) beforeLeave!: () => void;

		public static install: (param: Vue) => any;
		public static compName = "rvue-collapse";

		private handleClick(evt: Event) {
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
			console.log(SlotDefaults);

			return (
				<el-collapse props={props}>
					{SlotDefaults &&
						SlotDefaults.map((item: any) => {
							if (item.componentOptions.tag !== "rvue-collapse-item") return item;
							let { title, name, disabled } = item.componentOptions.propsData;
							let itemProps = { title, name, disabled };
							return <el-collapse-item props={itemProps}>{item.componentOptions.children && item.componentOptions.children.map((ite: any) => ite)}</el-collapse-item>;
						})}
				</el-collapse>
			);
		}
	}
	RvueCollapse.install = function (Vue: any) {
		Vue.component(RvueCollapse.compName, RvueCollapse);
	};
	export default RvueCollapse;
</script>
<style lang="scss" scoped></style>
