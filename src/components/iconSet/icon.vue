<template>
	<div class="icon-edit-wrapper">
		<div @click="dialogIconVisible = true" style="cursor: pointer">
			<div class="icon-container" :style="{ color: defaultConf.color, borderRadius: round ? '50%' : '13px' }">
				<i :class="defaultConf.icon || 'el-icon-office-building'" :style="{ fontSize: '30px', background: 'rgba(255,255,255,0)', marginTop: '5px' }"></i>
			</div>
			<span style="font-size: 12px; marginleft: 10px; vertical-align: super; display: inline-block">{{ $l("global.clickToChangeIcon") }}</span>
		</div>
		<rvue-dialog :close-on-click-modal="false" class="dialog" width="500" :show-close="false" :visible.sync="dialogIconVisible" append-to-body destroy-on-close>
			<div class="color-wrap">
				<div
					class="color-select"
					:class="{ selected: app.color === i }"
					:key="i"
					v-for="i in colorList"
					:style="{ backgroundColor: i, borderRadius: round ? '50%' : '8px' }"
					@click="changeColor(i)"
				></div>
				<el-color-picker v-model="app.color" show-alpha></el-color-picker>
			</div>
			<el-divider></el-divider>
			<div class="icon-wrap">
				<div class="color" :key="i" v-for="i in iconList" :style="{ color: app.color, borderRadius: round ? '50%' : '13px' }" @click="changeIcon(i)">
					<i :class="i" :style="{ fontSize: '30px', background: 'rgba(255,255,255,0)', marginTop: '8px' }"></i>
				</div>
			</div>
			<!-- <div slot="footer" class="dialog-footer">
      <el-button @click="dialogIconVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
      <el-button type="primary" @click="editAppIcon">{{ $t("crud.filter.submitBtn") }}</el-button>
    </div> -->
		</rvue-dialog>
	</div>
</template>
<script>
	export default {
		name: "IconSet",
		props: {
			default: {
				type: Object,
				default: () => ({}),
			},
			round: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				dialogIconVisible: false,
				colorList: ["#EFB53F", "#F87557", "#52D28B", "#60B6E9", "#4B95F8", "#B275DA"],
				iconList: [
					"el-icon-office-building",
					"el-icon-s-data",
					"el-icon-s-check",
					"el-icon-s-cooperation",
					"el-icon-s-order",

					"el-icon-notebook-1",
					"el-icon-truck",
					"el-icon-tableware",
					"el-icon-cpu",
					"el-icon-phone-outline",
					"el-icon-data-line",
					"el-icon-coin",
					"el-icon-lock",
					"el-icon-s-tools",
					"el-icon-shopping-cart-2",
					"el-icon-message",
					"el-icon-odometer",
					"el-icon-s-custom",
					"el-icon-s-opportunity",
					"el-icon-menu",
					"el-icon-s-marketing",
					"el-icon-s-promotion",
				],
				app: this.default,
			};
		},
		methods: {
			editAppIcon() {
				this.dialogIconVisible = false;
				this.$emit("editIcon", this.app);
			},
			changeColor(color) {
				this.app = {
					...this.app,
					color,
				};
			},
			changeIcon(icon) {
				this.app = {
					...this.app,
					icon,
				};
				this.editAppIcon();
			},
		},
		computed: {
			defaultConf() {
				return this.default;
			},
		},
	};
</script>
<style lang="scss" scoped>
	.icon-edit-wrapper {
		// width: 50px;
		display: inline-block;
	}

	.color-wrap,
	.icon-wrap {
		display: flex;

		.color {
			@include GlobalAvatar(46px, 46px, 13px, null);
			margin-right: 10px;
			cursor: pointer;

			&.selected {
				border: 3px solid #b2daf0;
			}
		}

		.color-select {
			@include GlobalAvatar(30px, 30px, 8px, null);
			margin-right: 8px;
			cursor: pointer;

			&.selected {
				border: 1px solid #b2daf0;
			}
		}
	}

	.icon-wrap {
		flex-flow: wrap;

		.color {
			text-align: center;
			margin-bottom: 10px;
		}

		// .el-icon-menu {
		// 	color: #fff !important;
		// }
	}

	.icon-container {
		@include PositionRelative(46px, 46px);
		display: inline-block;
		line-height: 50px;
		text-align: center;
		border-radius: 13px;

		// .el-icon-menu {
		// 	color: #fff !important;
		// }
	}

	// .color-cover-1 {
	// 	background-image: -webkit-linear-gradient(#f4cf54, #e89121);
	// }

	// .color-cover-2 {
	// 	background-image: -webkit-linear-gradient(#fd927e, #f25127);
	// }

	// .color-cover-3 {
	// 	background-image: -webkit-linear-gradient(#82e89e, #18b875);
	// }

	// .color-cover-4 {
	// 	background-image: -webkit-linear-gradient(#7dd3fa, #4298d8);
	// }

	// .color-cover-5 {
	// 	background-image: -webkit-linear-gradient(#71bafc, #2873f3);
	// }

	// .color-cover-6 {
	// 	background-image: -webkit-linear-gradient(#d69ef8, #8b49ba);
	// }
</style>

<style lang="scss">
	.dialog {
		.el-dialog {
			width: 300px;
			.el-dialog__header {
				padding: 0;
			}
			.el-divider--horizontal {
				margin: 10px 0;
			}
		}

		.el-color-picker {
			.el-color-picker__trigger {
				width: 30px;
				height: 30px;
			}
		}
	}
</style>
