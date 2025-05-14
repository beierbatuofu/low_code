<script lang="tsx">
	import { Component, Vue, Prop, Inject } from "vue-property-decorator";

	@Component({})
	export default class Dynamic extends Vue {
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		@Prop({ type: Boolean, default: true }) isEdit!: boolean;
		@Inject() flowJSON!: Record<"configList", any>;

		private get value() {
			try {
				return this.nodeConf.data.dynamic.filter((id: string) => this.userAndDept.findIndex((item: Record<string, any>) => item.fieldId == id) >= 0);
			} catch (err) {
				return [];
			}
		}

		private set value(v: string[]) {
			console.log(v, "vvvvv");
			this.$set(this.nodeConf.data, "dynamic", v);
		}

		private get userAndDept() {
			return this.flowJSON.configList.filter((field: Record<string, any>) => ["user", "userRadio", "dept", "deptRadio"].includes(field.type));
		}

		protected render() {
			let props = {
				value: this.value,
				multiple: true,
				disabled: this.isEdit,
			};
			let lang = localStorage.getItem("lang") || "zh";
			return (
				<div class="dynamic">
					{this.userAndDept.length ? (
						<div>
							<div class="title">{this.$t("process.dynamic")}</div>
							<rvue-select
								props={props}
								on={{
									change: (v: string[]) => {
										this.value = v;
									},
								}}
							>
								{this.userAndDept.map((item: Record<string, any>) => {
									let optsProps = {
										label: item.title[lang],
										value: item.fieldId,
									};
									return <rvue-option props={optsProps} key={item.fieldId}></rvue-option>;
								})}
							</rvue-select>
						</div>
					) : (
						<div></div>
					)}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-select {
			width: 100%;
		}
	}
</style>
