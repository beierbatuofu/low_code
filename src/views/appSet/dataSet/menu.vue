<template>
	<div class="dataset-menu">
		<!-- 数据集查询 -->
		<!-- <rvue-input :suffixIcon="'el-icon-search'" v-model="searchVal" :placeholder="'请输入搜索内容'"></rvue-input> -->
		<div style="position: relative; height: 32px; margin-bottom: 10px">
			<img class="customizeImage" :src="`${publicPath}img/search.svg`" />
			<el-select
				v-model="searchVal"
				size="small"
				value-key="name"
				@change="handleInfo(searchVal)"
				style="margin: 5px 10px; display: block"
				filterable
				remote
				clearable
				no-match-text
				:remote-method="remoteMethod"
				placeholder="请输入搜索内容"
			>
				<el-option v-for="item in selectInfo" :key="item.id" :label="item.name.zh" :value="item"></el-option>
			</el-select>
		</div>
		<!-- 创建数据集按钮 -->
		<el-button type="primary" size="small" style="width: 95%; margin: 0 auto; display: block" @click="addDataset">创建数据集</el-button>

		<!-- 数据集菜单 -->
		<ul class="dataset-list">
			<li v-for="item in DataSetList" :key="item.id" :class="{ active: listColors == item.datasetCode }" @click="selectDataSet(item.datasetCode)">
				<span class="dataset-list-name">{{ item | getName }}</span>
				<span class="icon el-icon-s-tools" @click.stop="goDetail(item.datasetCode)"></span>
			</li>
		</ul>

		<!--创建数据集弹框 -->
		<rvue-dialog :visible.sync="addVisible" destroy-on-close append-to-body class="appDialog dataSetDialog">
			<div slot="title" class="dialog-title">
				<div class="dialog-title-font">{{ $l("appset.dataSetName") }}</div>
			</div>
			<RvueLangInput class="el-form-item" :maxlength="100" style="width: 90%" @change="handleChange" />
			<div slot="footer" class="dialog-footer">
				<rvue-button size="mini" @click="cancelDataSetName">{{ $t("linkDataDialog.cancel") }}</rvue-button>
				<rvue-button size="mini" type="primary" @click="handleDataSetName">{{ $t("crud.filter.submitBtn") }}</rvue-button>
			</div>
		</rvue-dialog>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive, PropSync } from "vue-property-decorator";

	import { addDataset, getDataset, queryDataset } from "@/api/dataset.ts";

	@Component({})
	export default class Menu extends Vue {
		@PropSync("listColor", { type: String, default: "" }) listColors!: String;

		private appCode: string = "";
		private searchVal: string = ""; //查询数据集
		private addVisible: boolean = false;
		private dataSetName: any = {}; //新创建数据集name
		private selectInfo: any = []; //option存放
		private DataSetList: any = [
			{
				name: "数据集1",
				id: "1",
			},
			{
				name: "数据集2",
				id: "2",
			},
			{
				name: "数据集3",
				id: "3",
			},
			{
				name: "数据集4",
				id: "4",
			},
		]; //数据集 数组

		private handleInfo(el: any) {
			this.selectDataSet(el.datasetCode);
			this.searchVal = "";
		}
		private addDataset() {
			this.addVisible = true;
		}
		// 点击中英文确认
		private handleChange(val: any) {
			this.dataSetName = val;
		}
		//取消添加
		private cancelDataSetName() {
			this.dataSetName = {};
			this.addVisible = false;
		}
		private remoteMethod(val: any) {
			if (val !== "") {
				this.selectInfo = this.DataSetList.filter((item: any) => {
					return item.name.zh.toLowerCase().indexOf(val.toLowerCase()) > -1;
				});
			} else {
				this.selectInfo = [];
			}
		}

		// 确认添加
		private async handleDataSetName() {
			if ((this.dataSetName.zh || this.dataSetName.en) && (this.dataSetName.zh !== "" || this.dataSetName.en !== "")) {
				let { code, data } = await addDataset(this.appCode, this.dataSetName);
				this.$message.success("创建成功");
				this.addVisible = false;
				this.$router.push(`dataset/${data.datasetCode}`);
			}
		}

		private async selectDataSet(id: any) {
			if (this.listColors == id) return;
			this.listColors = id;
			let res = await queryDataset(this.appCode, id);
			this.$emit("datasetDeploy", res.data);
		}

		private goDetail(code: string) {
			this.$router.push(`dataset/${code}`);
		}

		private async getDataSet(appCode: any) {
			let res = await getDataset(appCode);
			this.DataSetList = res.data;
		}

		protected created() {
			this.appCode = this.$route.params.appCode;
			this.getDataSet(this.appCode);
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .dialog-title-font{
	font-weight: 600;
}
	.customizeImage {
		width: 24px;
		margin-right: 5px;
		position: absolute;
		left: 255px;
		top: 50%;
		transform: translateY(-12px);
		z-index: 10;
		opacity: 0.5;
		height: 24px;
	}
	.dataset-menu {
		width: 300px;
		height: calc(100vh - 120px);
		overflow: auto;
		margin-left: 50px;
		margin-right: 5px;
		background-color: white;
		overflow: auto;
		padding-bottom: 20px;
		border: 1px solid #f1f1f1;
		border-radius: 4px;
	}

	::v-deep .rvue-input {
		width: 95%;
		margin: 5px 2%;

		.el-input {
			.el-input__inner {
				border-radius: 10px;
			}

			.el-input__icon,
			.el-icon-search {
				font-weight: 700;
				font-size: 18px;
				color: #1f1b1b9e;
			}
		}
	}

	::v-deep.el-button {
		// @include GlobalAvatar(95%, null, 5px, null);
		// margin: 5px 2%;
	}

	.dataset-list {
		width: 100%;
		margin-top: 10px;

		li {
			line-height: 40px;
			text-align: center;
			@include PositionRelative(100%, 40px);
			.dataset-list-name {
				padding: 0 10px;
				width: 260px;
				display: inline-block;
				font-size: 14px;
				color: rgb(96, 135, 253);
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}

			.icon {
				display: block;
				width: 20px;
				height: 20px;
				line-height: 20px;
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
				color: rgb(153, 153, 153);
				cursor: pointer;
			}
		}

		.active {
			background-color: rgb(223, 231, 255);
		}
	}

	::v-deep.dataSetDialog {
		.el-dialog {
			width: 550px !important;
			overflow: hidden;

			.el-dialog__body {
				.input {
					margin-left: 40px;
				}
			}
		}
	}
</style>
