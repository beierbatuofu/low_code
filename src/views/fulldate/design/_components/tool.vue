<script lang="tsx">
	import { Component, Vue, Prop, Watch, Emit, Model } from "vue-property-decorator";

	@Component
	export default class Tool extends Vue {
		@Prop({ type: Object, default: () => ({}) }) opts!: Record<string, any>;
		private leftOptions = [
			{
				label: "上页",
				value: "prev",
			},
			{
				label: "下页",
				value: "next",
			},
			{
				label: "今天",
				value: "today",
			},
		];

		private rightOptions = [
			{
				label: "月",
				value: "dayGridMonth",
			},
			{
				label: "周",
				value: "timeGridWeek",
			},
			{
				label: "日",
				value: "timeGridDay",
			},
			{
				label: "日程",
				value: "listWeek",
			},
		];
		private get leftVals() {
			if (!this.opts.left) return [];

			return this.opts.left.split(",");
		}

		private set leftVals(arr: string[]) {
			this.opts.left = arr.join();
		}

		private get rightVals() {
			if (!this.opts.right) return [];
			return this.opts.right.split(",");
		}

		private set rightVals(arr: string[]) {
			this.opts.right = arr.join();
		}

		private get showTitle() {
			return !!this.opts.center;
		}

		private set showTitle(v: boolean) {
			this.opts.center = v ? "title" : "";
		}

		protected render() {
			return (
				<div class="tool">
					<div class="group">
						<div class="label">左</div>
						<rvue-select
							class="select"
							on={{
								change: (arr: string[]) => {
									this.leftVals = arr;
								},
							}}
							props={{ value: this.leftVals }}
							multiple
							placeholder="请选择"
						>
							{this.leftOptions.map((item: { label: string; value: string }, idx: number) => (
								<rvue-option props={item} key={idx}></rvue-option>
							))}
						</rvue-select>
					</div>
					<div class="group">
						<div class="label">右</div>
						<rvue-select
							class="select"
							on={{
								change: (arr: string[]) => {
									this.rightVals = arr;
								},
							}}
							props={{ value: this.rightVals }}
							multiple
							placeholder="请选择"
						>
							{this.rightOptions.map((item: { label: string; value: string }, idx: number) => (
								<rvue-option props={item} key={idx}></rvue-option>
							))}
						</rvue-select>
					</div>
					<div class="group">
						<div class="label">显示标题</div>
						<el-switch
							on={{
								change: (v: boolean) => {
									this.showTitle = v;
								},
							}}
							props={{ value: this.showTitle }}
							active-color="#13ce66"
							inactive-color="#ff4949"
						></el-switch>
					</div>
				</div>
			);
		}
	}
</script>
<style scoped lang="scss">
	.group {
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.label {
		padding-right: 5px;
		color: #666;
	}
	.select {
		width: 100%;
	}
</style>
