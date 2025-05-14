<!--
 * @Author: ben
 * @LastEditTime: 2022-05-07 10:19:38
-->
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";

	import storeModule, { namespace } from "../_store";

	@Component({})
	export default class Left extends Vue {
		@Prop({ type: Object, default: {} }) fieldText!: any;
		@Prop({ default: () => ({}), type: Object }) curField!: TJson;
		@Model("change", { type: Object }) readonly fieldJson!: TJson;

		private actives = ["1"];
		private get list() {
			let arrList: any[] = [];
			try {
				let list = (<any>this.$store.state[`${namespace}`]).fieldList;
				return list.filter((item: any) => item.fieldId != this.curField.fieldId);
			} catch (err) {
				return [];
			}
		}

		private bindClick(item: NFormulaEdit.TField) {
			this.$emit("change", {
				...item,
				timestamp: new Date().getTime(),
			});
		}

		private createContainer(h: CreateElement) {
			let liVNodes: VNode[] = [];
			let lang: any = localStorage.getItem("lang");
			this.list.forEach((item: any) => {
				//TODO 子表格.子字段
				let aList = ["separator", "uploadFile"];
				if (aList.includes(item.type)) return;
				let prop = {
					on: {
						click: this.bindClick.bind(this, item),
					},
				};
				let label = item.parentTitle && item.parentTitle[lang] ? item.parentTitle[lang] + "." + item.title[lang] : item.title[lang];
				let VNode = h("p", prop, [h("span", { class: "formula-field" }, [label]), h("span", { class: `tag-${item.type}` }, [(<any>this).$t("formula." + item.type)])]);
				liVNodes.push(VNode);
			});

			return h(
				"el-collapse",
				{
					class: "field-list",
					props: {
						value: this.actives,
					},
					on: {},
				},
				[
					h(
						"el-collapse-item",
						{
							props: {
								name: "1",
								title: this.$t("formula.Currentfield"),
							},
						},
						liVNodes
					),
				]
			);
		}

		private createH3(h: CreateElement) {
			const TEXT = "字段";
			return h(
				"div",
				{
					class: "h3",
				},
				[TEXT]
			);
		}

		protected render(h: CreateElement) {
			const children = [this.createContainer(h)];
			return h(
				"div",
				{
					class: "left",
				},
				children
			);
		}
	}
</script>
