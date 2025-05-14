/*
 * @Author: ben
 * @LastEditTime: 2022-04-24 15:34:48
 */

import { Component, Vue, Watch, Prop, PropSync, Emit } from "vue-property-decorator";

@Component
export default class BaseAttr extends Vue {
	@Prop({ type: Object, default: () => ({}) }) config!: TJson;
	@Prop({ type: Object, default: () => ({}) }) data!: TJson;
	@Prop({
		type: Object,
		default: () => {
			column: [];
			code: "";
		},
	})
	formConfig!: any;
	public blackList = ["table", "separator", "uploadFile", "textarea", "tab"];
	public get lang(): string {
		return localStorage.getItem("lang") || "zh";
	}
	@Emit("update")
	public handleUpdate(data: TJson, type: string) {}
}
