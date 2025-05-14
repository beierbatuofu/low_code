<template>
	<div class="avue-scan">
		<van-field
			v-if="showScan"
			v-model="text"
			:label="label"
			placeholder="请输入"
			right-icon="scan"
			@click-right-icon="scan"
		/>
		<el-input v-else v-model="text" placeholder="请输入"></el-input>
	</div>
</template>
<script>
	import * as dd from "dingtalk-jsapi";

	export default {
		name: "RvueScan",
		props: {
			value: {
				type: String,
				default: () => {
					return "";
				},
			},
			label: String,
		},
		data() {
			return {
				text: "",
				showScan: false,
			};
		},
		created() {
			// 判断环境是否为钉钉
			if (dd.env.platform === "notInDingTalk") {
				return;
			} else {
				this.showScan = true;
			}
		},
		watch: {
			value: {
				handler(val) {
					this.text = val;
				},
				deep: true,
				immediate: true,
			},
			text: {
				handler(val) {
					this.$emit("input", val);
				},
				deep: true,
			},
		},
		computed: {},
		methods: {
			scan() {
				// 调起钉钉扫码API
				let that = this;
				dd.ready(function () {
					dd.biz.util.scan({
						type: "all", // type 为 all、qrCode、barCode，默认是all。
						onSuccess: function (data) {
							//onSuccess将在扫码成功之后回调
							/* data结构
									{ 'text': String}
									*/
							that.text = data.text;
						},
						onFail: function (err) {
							alert(JSON.stringify(err));
						},
					});
				});
			},
		},
	};
</script>
