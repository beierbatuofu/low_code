<template>
	<div>
		<div v-if="!readonly">
			<div v-if="Array.isArray(datetimeValue)">
				<div @click="handelValue('start')" style="text-align: center">
					<div>
						<input
							type="text"
							class="startTime"
							style="margin-bottom: 20px"
							:disabled="disabled"
							readonly="true"
							:placeholder="$t('tableDesign.startTime')"
							:value="this.datetimeValue[0]"
						/>
					</div>
				</div>
				<div @click="handelValue('end')" style="text-align: center">
					<div>
						<input type="text" class="endTime" readonly="true" :disabled="disabled" :placeholder="$t('tableDesign.endTime')" :value="this.datetimeValue[1]" />
					</div>
				</div>
			</div>
			<div v-else>
				<input
					v-if="!readonly"
					@click="handelValue()"
					:class="disabled ? 'rsingleTime' : 'singleTime'"
					type="text"
					:disabled="disabled"
					:placeholder="$t('tableDesign.chooseTime')"
					:value="this.datetimeValue"
				/>
			</div>

			<van-popup v-model="startOpen" :position="position">
				<van-datetime-picker
					v-model="allValue"
					type="datetime"
					:min-date="minDate"
					:max-date="maxDate"
					:title="titleName"
					:swipe-duration="swipeDuration"
					:confirm-button-text="$t('linkDataDialog.confirm')"
					:cancel-button-text="$t('linkDataDialog.cancel')"
					@confirm="confirmStart"
					@cancel="cancelStart"
					:formatter="formatter"
				>
				</van-datetime-picker>
			</van-popup>
		</div>
		<div v-if="readonly" class="widget-readonly" style="width: 100%">{{ this.datetimeValue }}</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
	import { DatetimePicker, Popup } from "vant";

	declare type TType = "date" | "time" | "year-month" | "month-day" | "datehour";
	declare type TClumns = "year" | "month" | "day" | "hour" | "minute";
	declare type TPosition = "top" | "bottom" | "right" | "left";
	const defaultFormat = ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm"];
	const defaultType = ["datetime", "datetimerange"]; //type类型

	enum Ttype {
		"yyyy" = "year",
		"yyyy-MM" = "month",
		"yyyy-MM-dd" = "date",
		"yyyy-MM-dd HH:mm" = "datetime",
		"yyyy-MM-dd HH:mm:ss" = "datetime",
	}

	Vue.use(DatetimePicker);
	Vue.use(Popup);

	@Component({})
	class RvueMobileDatetime extends Vue {
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;

		public static install: (param: Vue) => any;
		public static compName = "rvue-datetime";

		//--------popup属性-----------
		@Prop({ type: String, default: "bottom" }) position!: String;
		//----------datetimePicker----
		@Prop({ type: String, default: "datetime" }) type!: string; //时间类型
		@Prop({ type: String, default: "确认" }) confirmButtonText!: String; //确认按钮文字
		@Prop({ type: String, default: "取消" }) cancelButtonText!: String; //取消按钮文字
		@Prop({ type: Boolean, default: true }) showToolbar!: Boolean; //是否显示顶部栏
		@Prop({ type: Boolean, default: false }) readonly!: Boolean; //是否为只读状态，只读状态下无法切换选项
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: [String] }) columnsOrder!: TClumns; //自定义列排序数组,
		@Prop({ type: [Number, String], default: "34" }) itemHeigh!: Number | String; //选项高度
		@Prop({ type: [Number, String], default: 6 }) visibleItemCount!: Number | String; //可见的选项个数
		@Prop({ type: [Number, String], default: "1000ms" }) swipeDuration!: Number | String; //快速滑动时惯性滚动的时长 單位:ms
		@Prop({ type: String, default: "" }) valueFormat!: string;
		private startOpen: Boolean = false;
		private openTime: string = "";
		private closeTime: string = "";
		private allValue: Date = new Date();
		private valFlag: string = "";

		private handelValue(e: string) {
			this.startOpen = true;
			this.valFlag = e;
		}

		private get titleName() {
			if (this.valFlag == "start") {
				return this.$t("tableDesign.startTime");
			} else if (this.valFlag == "end") {
				return this.$t("tableDesign.endTime");
			} else {
				return this.$t("tableDesign.chooseTime");
			}
		}

		@Model("change") value!: any;

		private minDate: Date = new Date("1980/1/1 00:00:00");
		private maxDate: Date = new Date("2100/1/1 00:00:00");

		// private get defaultTime() {
		// 		return /HH/g.test(<string>this.format) || !/range/.test(this.getType) ? "" : ["00:00:00", "23:59:59"];
		// 	}
		// private get getFormat() {
		// 	let format = this.format;
		// 	if (defaultFormat.includes(<string>format)) return format;
		// 	return format;
		// }

		private get getType() {
			let value = this.datetimeValue;
			if (Array.isArray(value)) {
				return /HH/g.test(<string>this.format) ? "datetimerange" : "daterange";
			}
			return Ttype[<keyof typeof Ttype>this.format];
		}
		private get datetimeValue() {
			this.minDate = new Date("1980/1/1 00:00:00");
			this.maxDate = new Date("2100/1/1 00:00:00");

			return this.value;
		}

		private mounted() {
			if (this.datetimeValue != "") {
				this.datetimeValue = Array.isArray(this.datetimeValue) ? this.datetimeValue.map((t: string) => this.dateFormat(t)) : this.dateFormat(this.datetimeValue);
			}
		}
		private set datetimeValue(n) {
			this.$emit("change", n);
		}

		private confirmStart(e: any) {
			if (Array.isArray(this.datetimeValue)) {
				if (this.valFlag == "start") {
					this.openTime = this.dateFormat(e);
					this.datetimeValue[0] = this.openTime;
				} else {
					this.closeTime = this.dateFormat(e);
					this.datetimeValue[1] = this.closeTime;
				}
				this.$emit("change", this.datetimeValue);
			} else {
				this.closeTime = this.dateFormat(e);
				this.$emit("change", this.closeTime);
			}
			this.startOpen = false;
		}
		private cancelStart() {
			this.startOpen = false;
		}

		private dateFormat(val: any) {
			var newTime = val.toString().replace(/\-/g, "/");
			var date = new Date(newTime);
			var year = date.getFullYear();
			var M: any = date.getMonth() + 1;
			M = M < 10 ? "0" + M : M;
			var d: any = date.getDate();
			d = d < 10 ? "0" + d : d;
			var h: any = date.getHours();
			h = h < 10 ? "0" + h : h;
			var m: any = date.getMinutes();
			m = m < 10 ? "0" + m : m;
			var s: any = date.getSeconds();
			s = s < 10 ? "0" + s : s;
			let time: string = year + "/" + M + "/" + d + " " + h + ":" + m + ":" + s;

			return time;
		}
		private formatter(type: any, value: any) {
			if (type === "year") {
				return `${value}年`;
			} else if (type === "month") {
				return `${value}月`;
			} else if (type === "day") {
				return `${value}日`;
			} else if (type === "hour") {
				return `${value}时`;
			} else if (type === "minute") {
				return `${value}分`;
			} else if (type === "second") {
				return `${value}秒`;
			}
		}

		@Watch("valFlag", { deep: true })
		chooseTime(val: any) {
			if (this.value.length > 0) {
				if (val == "start") {
					this.minDate = new Date("1980/1/1 00:00:00");
					this.maxDate = !this.closeTime ? new Date("2100/1/1 00:00:00") : new Date(this.closeTime);
				}
				if (val == "end") {
					this.maxDate = new Date("2100/1/1 00:00:00");
					this.minDate = !this.openTime ? new Date("1980/1/1 00:00:00") : new Date(this.openTime);
					//日期new Date("1980")
				}
			} else {
				if (val == "start" || val == "end") {
					this.minDate = new Date("1980/1/1 00:00:00");
					this.maxDate = new Date("2100/1/1 00:00:00");
				}
			}
		}
	}
	RvueMobileDatetime.install = function (Vue: any) {
		Vue.component(RvueMobileDatetime.compName, RvueMobileDatetime);
	};

	export default RvueMobileDatetime;
</script>
<style lang="scss" scoped>
	.startTime,
	.endTime {
		width: 100%;
		height: 40px;
		line-height: 39px;
		text-align: center;
		border: 1px solid #e7d7d7;
	}

	.singleTime {
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding: 0 30px;
		border: 1px solid #e4e7ed;
		text-align: center;
	}
	input::-webkit-input-placeholder {
		color: #c4c4c4 !important;
	}
	.rsingleTime {
		width: 100%;
		height: 40px;
		padding: 0 30px;
		background-color: #f5f7fa;
		border-color: #e4e7ed;
		color: #c0c4cc;
		cursor: not-allowed;
	}
	.readyTime {
		width: 100%;
		min-height: 40px;
		border-bottom: 1px solid #dcdfe6;
		line-height: 39px;
		text-align: center;
	}
	.readonly {
		position: absolute;
		width: 100%;
		height: 100%;
		//background-color: black;
		opacity: 0.5;
		top: 0px;
		left: 0px;
	}
	input::-webkit-input-placeholder {
		color: #d1d1d1;
	}

	.van-picker__cancel,
	.van-picker__confirm {
		background: #fff;
		font-size: 16px;
		color: #6087fd;
	}
</style>
