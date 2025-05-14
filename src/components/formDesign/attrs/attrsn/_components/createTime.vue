<script lang="tsx">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";

	@Component
	export default class CreateTime extends Vue {
		@Prop({ type: Object, default: () => ({}) }) conf!: Record<string, any>;

		private defineFormats = [
			{
				value: "yyyy",
				label: "yyyy",
			},
			{
				value: "yyyyMM",
				label: "yyyyMM",
			},
			{
				value: "yyyy-MM",
				label: "yyyy-MM",
			},
			{
				value: "yyyyMMdd",
				label: "yyyyMMdd",
			},
			{
				value: "yyyy-MM-dd",
				label: "yyyy-MM-dd",
			},

			{
				value: "yyyyMMddHHmmss",
				label: "yyyyMMddHHmmss",
			},
			{
				value: "yyyy-MM-dd HH:mm:ss",
				label: "yyyy-MM-dd HH:mm:ss",
			},
		];

		protected render() {
			return (
				<div>
					<rvue-select
						on={{
							change: (v: any) => (this.conf.format = v),
						}}
						props={{
							value: this.conf.format,
						}}
					>
						{this.defineFormats.map((item: Record<string, any>) => {
							return <rvue-option props={item} key={item.value}></rvue-option>;
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
