<script lang="tsx">
	import { Component, Vue, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
	})
	class RvueFormsOldItem extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-forms-old-item";
		@Prop({ type: String }) prop!: string;
		@Prop({ type: String }) label!: string; //标签文本
		@Prop({ type: String }) labelWidth!: string; //表单域标签的的宽度
		@Prop({ type: Boolean, default: false }) required!: boolean; //是否必填
		@Prop({ type: Object }) rules!: object; //表单验证规则
		@Prop({ type: String }) error!: string; //表单域验证错误信息
		@Prop({ type: Boolean, default: true }) showMessage!: boolean; //是否显示校验错误信息
		@Prop({ type: Boolean, default: false }) inlineMessage!: boolean; //以行内形式展示校验信息

		private handleValidate(evt: TJson) {
			this.$emit("validate", evt);
		}
		protected render(h: CreateElement) {
			let { prop, label, labelWidth, required, rules, error, showMessage, inlineMessage } = this;
			let props = { prop, label, labelWidth, required, rules, error, showMessage, inlineMessage };
			return <el-formsOld props={props} on-validate={this.handleValidate}></el-formsOld>;
		}
	}
	RvueFormsOldItem.install = function (Vue: any) {
		Vue.component(RvueFormsOldItem.compName, RvueFormsOldItem);
	};
	export default RvueFormsOldItem;
</script>
<style lang="scss" scoped></style>
