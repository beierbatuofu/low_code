<template>
	<div class="bi-quota-container">
		<div v-if="data.dimensions && data.dimensions.length !== 0 && data.indicators && data.indicators.length !== 0">
			<div class="total">
				<span>共计</span><span>{{ total }}</span>
			</div>
			<template v-for="(item, index) in data.quotaList">
				<div v-if="item.indicatorValue != 0 && item.dimensionValue !== null" class="row" :key="index">
					<div class="content">{{ getName(item.dimensionValue) }}</div>
					<div class="sum">{{ item.indicatorValue }}</div>
				</div>
			</template>
		</div>
		<div v-else class="view">
			<span v-if="total === 0 || (data.dimensions.length !== 0 && data.indicators.length == 0) || (data.dimensions.length == 0 && data.indicators.length == 0)">暂无数据</span>
			<span v-else class="total">{{ total }}</span>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import { dateAdd } from "@/components/chartDesign/components/attr/CTdi/_core/methods";
	@Component({
		components: {},
	})
	export default class BiQuota extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) formConfig!: any;
		@Inject() readonly processStatusList!: TJson;
		private indicatorsList: TJson = {};
		//总数
		private get total() {
			let total = 0;
			console.log(this.data.quotaList, "this.data.quotaList");
			this.data.quotaList &&
				this.data.quotaList.forEach((ite: any) => {
					if (this.data.dimensions.length == 0) {
						total += Number(ite.indicatorValue);
					} else {
						if (ite.dimensionValue !== null) {
							total += Number(ite.indicatorValue);
						}
					}
				});
			return total;
		}
		//名字转化
		private getName(item: any) {
			if (this.data.dimensions[0].dataTypeEnum == "address") {
				let address = JSON.parse(item);
				return address.province + address.city + address.district + address.detail;
			}
			//时间日期
			if (["create_time", "update_time", "datetime"].includes(this.data.dimensions[0].dataTypeEnum)) {
				return item + (<any>dateAdd)[this.data.dimensions[0].dateTimeSummary];
			} else if (this.data.dimensions[0].dataTypeEnum == "process_status") {
				let dicData: any = { 1: "进行中", 9: "流转完成", 8: "强制结束" };
				return dicData[item];
			}
			try {
				return JSON.parse(item)
					.map((item: any) => {
						console.log("name", item.name);
						return item.name || item;
					})
					.join(",");
			} catch (error) {
				return item;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bi-quota-container {
		padding: 20px;
		height: 100%;
		overflow-y: scroll;
		.total {
			padding-bottom: 10px;
			display: flex;
			justify-content: space-between;
			font-size: 24px;
		}
		.row {
			display: flex;
			justify-content: space-between;
		}
		.view {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			font-size: 24px;
			.total {
				font-size: 64px;
			}
		}
		.content {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 80%;
		}
	}
</style>
