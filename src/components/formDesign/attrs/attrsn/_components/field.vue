<script lang="tsx">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";

	@Component
	export default class Field extends Vue {
		@Prop({ type: Object, default: () => ({}) }) conf!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) configList!: Record<string, any>[];
		@Prop({ type: Array, default: () => [] }) textList!: string[];

		private get options() {
			let list: Record<string, any>[] = [];
			this.configList.forEach((item: Record<string, any>) => {
				if (this.textList.includes(item.type)) {
					list.push({
						type: item.type,
						label: item.title,
						value: item.fieldId,
					});
				}
			});

			return list;
		}

		protected render() {
			let lang = localStorage.getItem("lang") || "zh";

			return (
				<div>
					{" "}
					<rvue-select
						on={{
							change: (v: any) => (this.conf.fieldId = v),
						}}
						props={{
							value: this.conf.fieldId,
						}}
					>
						{this.options.map((item: Record<string, any>) => {
							return (
								<rvue-option
									props={{
										label: item.label[lang],
										value: item.value,
									}}
									key={item.value}
								></rvue-option>
							);
						})}
					</rvue-select>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-input__inner {
			height: 32px;
			line-height: 32px;
			padding: 5px 10px;
		}
	}
</style>
