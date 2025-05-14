<template>
	<div class="header">
		<div class="l"></div>
		<div class="r">
			<slot></slot>
			<el-button type="primary" size="small" class="save" @click="saveHandle('save')">{{ $t("global.save") }}</el-button>
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";

	import {
		// saveList,
		getRightList,
		updateRightList,
	} from "@/api/form";

	import { debounce } from "@/utils/global";

	@Component
	export default class TDHeader extends Vue {
		@Prop({ type: String, default: "" })
		jscode!: string;

		@Prop({
			type: Array,
			default: () => [],
		})
		queryList!: TJson[];

		@Prop({
			type: Array,
			default: () => [],
		})
		buttonList!: TJson[];

		@Prop({
			type: Object,
			default: () => {},
		})
		tableObj!: any;

		@Prop({
			type: Object,
			default: () => {},
		})
		rightList!: any;

		@Watch("tableObj", {
			deep: true,
			immediate: true,
		})
		onChanegTableObj(val: any) {
			this.tableObj.tableHeader = val.tableHeader;
		}

		private fn1 = debounce(() => {
			this.reqHttp().then((res: TJson) => {
				if (res.msg == "ok") {
					this.$emit("setRightList", res.data);
					this.$message.success("保存成功");
				} else {
					this.$message.warning("保存失败");
				}
			});
		}, 300);

		private reqHttp() {
			let queryList = this.queryList;
			let buttonList = this.buttonList;
			let tabList = this.tableObj;
			let viewStructure = {
				queryList,
				buttonList,
				tabList,
				jscode: this.jscode,
			};
			let { formCode, code, name ,perms} = this.rightList;
			return updateRightList({
				formCode,
				code,
				name,
				viewStructure,
				perms,
			});
			// if (res.msg == "ok") {
			// 	this.$emit("setRightList", res.data);
			// 	this.$message.success("保存成功");
			// } else {
			// 	this.$message.warning("保存失败");
			// }
		}

		private saveHandle(type: string) {
			// debugger
			if (type == "save") {
				this.fn1();
			} else {
				return this.reqHttp().then((res: TJson) => {
					if (res.msg == "ok") {
						this.$message.success("保存成功");
					} else {
						this.$message.warning("保存失败");
					}
				});
			}
		}
	}
</script>
<style lang="scss">
	@import "./styles/index.scss";
</style>
<style lang="scss" scoped>
	.jscode {
		color: $color;
		background: #fff;
	}
</style>
