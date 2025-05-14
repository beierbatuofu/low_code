<!--
 * @Author: ben
 * @LastEditTime: 2021-09-14 17:10:21
-->
<template>
	<div class="flow-chart">
		<el-timeline style="padding-top: 20px">
			<el-timeline-item v-for="(item, index) of flowData" :key="index" :timestamp="item.nodeName" placement="top">
				<el-card>
					<div class="node">
						<div class="left">
							<!-- <headPhoto v-if="item.userAvatar" :src="item.userAvatar" :size="30"></headPhoto> -->
							<rvue-avatar v-if="item.userAvatar" :src="item.userAvatar" :size="30"></rvue-avatar>
							<i v-else class="el-icon-finished" style="font-size: 30px"></i>
						</div>
						<div class="right">
							<h4>
								<span>{{ item.userName }}</span>
								<span
									:class="{
										red: item.message == '强制结束',
										lime: item.message == '流转完成',
										blue: item.message == '提交' || item.message == '暂存' || item.message == '通过' || item.message == '回退',
									}"
									>{{ item.message }}</span
								>
							</h4>
							<p v-if="item.createTime">{{ $t("global.startManage") }}：{{ item.createTime }}</p>
							<p v-if="item.totalTime">{{ $t("global.tiemConsuming") }}：{{ item.totalTime }}</p>
						</div>
					</div>
				</el-card>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { getFlowChart } from "@/api/flowcenter";
	import FlowDialog from "./flowDialog";
	//import headPhoto from "@/components/rvue/custom/components/headPhoto";

	@Component({
		components: {
			//headPhoto,
		},
	})
	export default class flowChart extends Vue {
		@Prop({ type: String, default: "" }) formCode!: string;
		@Prop({ type: String, default: "" }) dataId!: string;
		@Prop({ type: String, default: "" }) flowType!: string;
		@Prop({ type: Number, default: -1 }) processStatus!: number;

		private flowData = [];
		created() {
			this.getFlowChart();
		}

		private getFlowChart() {
			if (this.$route.path.split("/").pop() != "draft" && this.processStatus != 9 && this.flowType == "F") {
				getFlowChart({
					dataId: this.dataId,
					formCode: this.formCode,
				}).then((resp) => {
					this.flowData = resp.data;
					// console.log("获取流程数据", resp);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-timeline-item {
		margin-right: 16px;
		.el-timeline-item__tail {
			// display:block !important;
			border-left: 2px dotted #666666;
		}
		.el-timeline-item__node {
			background-color: #5287ee;
		}
	}
	::v-deep .el-card__body {
		padding-left: 0;
	}
	.flow-chart {
		.node {
			@include JustityAndFlexWrap(flex, space-around, null, null);
			.left {
				padding-top: 5px;
				width: 15%;
				text-align: center;
				line-height: 30px;
				img {
					@include VertivalAlign(null, middle, 30px, 30px);
					border-radius: 50%;
				}
			}
			.right {
				width: 85%;
				h4 {
					@include JustityAndFlexWrap(flex, space-between, null, null);
					span:last-child {
						margin-right: 10%;
					}
				}
				> p {
					color: rgb(173, 175, 186);
				}
			}
		}
	}
	.red {
		color: #e44e4e;
	}
	.lime {
		color: lime;
	}

	.blue {
		color: #4c81ff;
	}
	.black {
		color: black;
	}
</style>
