<script lang="tsx">
	import { Vue, Component, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";
	import RvueOptionGroup from "./rvueOptionGroup.vue";

	@Component({
		mixins: [Mixins],
		components: {
			"rvue-option-group": RvueOptionGroup,
		},
	})
	class RvueSelect extends Vue {
		@Model("change", { type: [String, Number, Array] }) value!: string | number | any[];
		@Prop({ type: Boolean, default: false }) multiple!: boolean;
		@Prop({ type: String, default: "" }) valueKey!: string;
		@Prop({ type: Boolean, default: false }) clearable!: boolean;
		@Prop({ type: Boolean, default: false }) collapseTags!: boolean;
		@Prop({ type: Number, default: 0 }) multipleLimit!: number;
		@Prop({ type: String }) name!: string;
		@Prop({ type: String, default: "off" }) autocomplete!: string;
		@Prop({ type: Boolean, default: false }) filterable!: boolean;
		@Prop({ type: Boolean, default: false }) allowCreate!: boolean;
		@Prop({ type: Function }) filterMethod!: () => void;
		@Prop({ type: Boolean, default: false }) remote!: boolean;
		@Prop({ type: Function }) remoteMethod!: () => void;
		@Prop({ type: Boolean, default: false }) loading!: boolean;
		@Prop({ type: String, default: "加载中" }) loadingText!: string;
		@Prop({ type: String, default: "无匹配数据" }) noMatchText!: string;
		@Prop({ type: String, default: "无数据" }) noDataText!: string;
		@Prop({ type: String }) popperClass!: string;
		@Prop({ type: String, default: "请选择" }) placeholder!: string;
		@Prop({ type: Boolean, default: false }) reserveKeyword!: boolean;
		@Prop({ type: Boolean, default: false }) defaultFirstOption!: boolean;
		@Prop({ type: Boolean, default: true }) popperAppendToBody!: boolean;
		@Prop({ type: Boolean, default: false }) automaticDropdown!: boolean;
		@Prop({ type: String, default: "medium" }) size!: string;

		public static install: (param: Vue) => any;
		public static compName = "rvue-select";

		private options: any[] = [];

		private handleChange(evt: TJson) {
			this.$emit("change", evt);
		}

		private handleVisibleChange(evt: TJson) {
			this.$emit("visible-change", evt);
		}

		private handleRemoveTag(evt: TJson) {
			this.$emit("remove-tag", evt);
		}

		private handleClear(evt: TJson) {
			this.$emit("clear", evt);
		}
		private handleBlur(evt: TJson) {
			this.$emit("blur", evt);
		}

		private handleFocus(evt: TJson) {
			this.$emit("focus", evt);
		}

		protected render(h: CreateElement) {
			let SlotDefaults: any = this.$slots.default || [];
			let SlotEmpty: any = this.$slots.empty || [];
			let SlotPrefix: any = this.$slots.prefix || [];

			let props = {
				value: this.value,
				multiple: this.multiple,
				// @ts-ignore
				disabled: this.disabled,
				"value-key": this.valueKey,
				// @ts-ignore
				clearable: this.clearable,
				"collapse-tags": this.collapseTags,
				"multiple-limit": this.multipleLimit,
				name: this.name,
				autocomplete: this.autocomplete,
				// @ts-ignore
				placeholder: this.placeholder,
				filterable: this.filterable,
				"allow-create": this.allowCreate,
				"filter-method": this.filterMethod,
				remote: this.remote,
				"remote-method": this.remoteMethod,
				loading: this.loading,
				"loading-text": this.loadingText,
				"no-match-text": this.noMatchText,
				"no-data-text": this.noDataText,
				"popper-class": this.popperClass,
				"reserve-keyword": this.reserveKeyword,
				"default-first-option": this.defaultFirstOption,
				"popper-append-to-body": this.popperAppendToBody,
				"automatic-dropdown": this.automaticDropdown,
				// @ts-ignore
				readonly: this.readonly,
				size: this.size,
			};

			// @ts-ignore
			if (this.readonly) return <div class="widget-readonly">{String(this.value || "")}</div>;
			return (
				<el-select
					props={props}
					on-focus={this.handleFocus}
					on-blur={this.handleBlur}
					on-clear={this.handleClear}
					on-remove-tag={this.handleRemoveTag}
					on-change={this.handleChange}
					on-visible-change={this.handleVisibleChange}
				>
					{SlotDefaults.length
						? SlotDefaults.map((item: TJson) => {
								let tag = item.componentOptions.tag;
								let style = item.data.staticStyle || {};

								if (tag == "rvue-option-group") return <rvue-option-group props={item.componentOptions.propsData}></rvue-option-group>;

								return (
									<el-option style={style} props={item.componentOptions.propsData}>
										{item.componentOptions.children && item.componentOptions.children.map((ite: TJson) => ite)}
									</el-option>
								);
						  })
						: SlotEmpty.map((item: TJson) => {
								return <template slot="empty">{item}</template>;
						  })}

					{SlotEmpty.map((item: TJson) => {
						//会导致设置empty input框也有
						// return <div slot="prefix">{item}</div>;
					})}

					<span slot="prefix">{SlotPrefix.map((item: TJson) => item)}</span>
				</el-select>
			);
		}
	}

	RvueSelect.install = function (Vue: any) {
		Vue.component(RvueSelect.compName, RvueSelect);
	};
	export default RvueSelect;
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
