<template>
	<div class="flow-log" v-if="flowLogData && flowLogData.length">
		<div class="top">
			<h4 class="title">{{ $t("tableDesign.journal") }}</h4>
			<div class="top-right">
				<slot name="top"></slot>
			</div>
		</div>
		<div class="flow-log-wrap">
			<rvue-timeline style="padding-top: 20px">
				<div v-for="(item, index) of flowLogData" :key="index" :timestamp="item.nodeName" placement="top">
					<rvue-card>
						<div class="node">
							<div class="left">
								<rvue-avatar :size="30" v-if="item.creatorAvatar" :src="item.creatorAvatar"></rvue-avatar>
								<i v-else class="el-icon-finished" style="font-size: 30px"></i>
							</div>
							<div class="right">
								<h4>
									<span>{{ item.creatorName }}</span>
									<span
										:class="{
											red: item.operationType == 3,
											lime: item.operationType == 9,
											blue: item.operationType == 1 || item.message == '暂存' || item.operationType == 2 || item.operationType == 4,
										}"
										>{{ $t(`newflow.${statusMap[item.operationType]}`) }}</span
									>
								</h4>
								<p v-if="item.createTime">{{ $t("global.startManage") }}：{{ item.createTime }}</p>
								<p v-if="item.totalTime">{{ $t("global.tiemConsuming") }}：{{ item.totalTime }}</p>
							</div>
						</div>
					</rvue-card>
				</div>
			</rvue-timeline>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";

	@Component
	export default class FlowLog extends Vue {
		@Prop({ type: Array, default: () => [] }) flowLogData!: TJson[];
		private statusMap = {
			1: "submit",
			2: "pass",
			3: "over",
			4: "back",
			9: "end",
		};
	}
</script>
<style lang="scss" scoped>
	.el-card.is-always-shadow,
	.el-card.is-hover-shadow:focus,
	.el-card.is-hover-shadow:hover {
		border-radius: 6px;
		box-shadow: none;
		// box-shadow: 0px 2px 8px -1px #b1b1b1;
	}
	.flow-log-wrap {
		height: 80vh;
		overflow-y: auto;
	}

	::v-deep .el-timeline-item {
		margin-right: 16px;
		.el-timeline-item__tail {
			// display:block !important;
			border-left: 2px dotted #cacaca;
		}
		.el-timeline-item__node {
			background-color: #5287ee;
		}
	}
	::v-deep .el-card__body {
		padding-left: 0;
	}
	.top {
		@include PositionRelative(null, null);
		&-right {
			@include PositionAbsoulte(50%, 16px, null, null);
			transform: translateY(-50%);
		}
	}
	.title {
		width: 60px;
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		border-bottom: 4px solid #4c81ff;
	}
	.flow-log {
		.node {
			@include JustityAndFlexWrap(flex, space-around, null, null);
			.left {
				padding-top: 5px;
				width: 15%;
				min-width: 40px;
				text-align: center;
				line-height: 30px;
				img {
					width: 30px;
					height: 30px;
					vertical-align: middle;
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
