/*
 * @Author: ben
 * @LastEditTime: 2021-08-10 14:19:21
 */
import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
import { t } from "../lang/index";

declare module "vue/types/vue" {
	interface Vue {
		t?: any;
		format?: string;
	}
}

declare type TUiSize = "medium" | "small" | "mini"| "number" | "large";

@Component
export default class Mixins extends Vue {
	@Prop({ type: Boolean, default: false }) readonly!: boolean; //只读
	@Prop({ type: Boolean, default: true }) edit!: boolean; //是否可编辑
	@Prop({ type: String, default: t("placeholder") }) placeholder!: string; //占位符
	@Prop({ type: String, default: "small" }) size!: TUiSize; //组件大小
	@Prop({ type: String, default: "timestamp" }) format!: string; // 时间格式
	@Prop({ type: String, default: "" }) valueFormat!: string;
	@Prop({ type: Boolean, default: false }) disabled!: boolean;

	public t = (key: string) => t(key);
}
