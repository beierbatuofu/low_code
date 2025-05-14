<template>
	<div class="m-header" :style="{ display: headShow ? '' : 'none' }">
		<div class="nav-bar">
			<div class="nav left" @click="transformValue()">
				<slot>
					<router-link tag="div" class="link" :to="`/${$route.params.tenantId}/workbench`">
						<h1 class="text">
							<!-- <i class="el-icon-menu" style="color: #409eff; font-size: 22px"></i> -->
							<img :src="`${publicPath}img/logo.png`" width="32" height="32" />
							<el-divider direction="vertical"></el-divider>
							<div>{{ $i18n.t("Mheader.workbench") }}</div>
						</h1>
					</router-link>
				</slot>
				<slot name="bread"> </slot>
			</div>
			<div class="nav middle">
				<slot name="center"></slot>
			</div>
			<div class="nav right">
				<!-- <div class="block" style="margin-right:10px;">
					<el-color-picker size="mini" @change="bindColorChange" v-model="color"></el-color-picker>
				</div> -->

				<slot name="right"></slot>
				<slot name="custom-right"></slot>

				<el-button v-if="getAdminFlag" class="nav-btn" type="primary" size="mini" plain round @click.stop="handleCommand('a')">
					{{ $i18n.t("Mheader.entermanage") }}
				</el-button>

				<RvueLangSelect v-if="getLangFlag" />

				<el-dropdown v-if="!$scopedSlots['custom-right']" trigger="click" class="menu" @command="handleCommand">
					<div style="height: 45px; display: flex; align-items: center">
						<img class="avatar-image" height="30" width="30" :src="getAvatar" style="display: block; height: 30px; width: 30px" />
					</div>
					<el-dropdown-menu slot="dropdown">
						<!-- <el-dropdown-item command="a">{{ $i18n.t("Mheader.entermanage") }}</el-dropdown-item> -->
						<el-dropdown-item command="b">
							<p style="line-height: 30px">
								<img class="avatar-image" :src="getAvatar" style="width: 30px; vertical-align: top; height: 30px; margin-left: 3px" />
								{{ getUserName }}
							</p>
						</el-dropdown-item>
						<el-dropdown-item command="b" v-if="isShowWorkbench"
							><span class="mheader-item"><i class="el-icon-house icon"></i> {{ $i18n.t("Mheader.workbench") }}</span></el-dropdown-item
						>
						<!-- <el-dropdown-item command="a">
              {{ $i18n.t("Mheader.entermanage") }}
            </el-dropdown-item> -->
						<el-dropdown-item command="c" v-if="$utils.getPlatform() !== 'dd'"
							><span class="mheader-item"><i class="el-icon-switch-button icon"></i>{{ $i18n.t("Mheader.quit") }}</span></el-dropdown-item
						>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from "vue";
	import { UserModule } from "@/store/modules/user";
	import { removeLocalStorage } from "@/utils/storage";
	import { SettingsModule } from "@/store/modules/settings";
	import { LoginModule } from "@/store/modules/login";

	export default Vue.extend({
		name: "MHeader",
		data() {
			return {
				color: "#217346",
				appName: window.sessionStorage.getItem("appName") || "",
				SwitchValue: true, //切换值
				headShow: true, //头部显示
			};
		},
		computed: {
			isShowWorkbench() {
				return this.$route.path.indexOf("workbench") == -1;
			},
			getAvatar() {
				return UserModule.userAvatar;
			},
			getUserName() {
				return UserModule.userInfo.userName;
			},
			getLangFlag() {
				return this.$route.meta.langFlag ?? false;
			},
			getAdminFlag() {
				const { tenantId } = LoginModule.getTenant;
				return (this.$route.path == `/${tenantId}/workbench` && UserModule.appPerm.isAdmin) || false;
			},
		},
		methods: {
			//传递给父组件值
			transformValue() {
				this.$emit("passValue", this.SwitchValue);
			},
			handleCommand(command) {
				const { tenantId } = LoginModule.getTenant;

				switch (command) {
					case "a":
						this.$router.push(`/${tenantId}/platform/config`);
						break;
					case "b":
						this.$router.push(`/${tenantId}/workbench`);
						break;
					case "c":
						this.handleQuit();
						break;
				}
			},
			handleQuit() {
				removeLocalStorage("token");
				const { tenantId } = LoginModule.getTenant || {};
				window.location.href = `/#/${tenantId}/login`;
			},
			bindColorChange() {
				SettingsModule.SET_THEMECOLOR(this.color);
			},
		},
		created() {
			const oldColor = window.localStorage.getItem("theme");

			oldColor && (this.color = oldColor);
			if (localStorage.loginType == "guest") {
				this.headShow = false;
			}
		},
		mounted() {},
	});
</script>
<style lang="scss">
	$mheaderHeight: 56px;
	.m-header {
		background-color: #fff;
		@include PositionRelative(null, $mheaderHeight);
		z-index: 100;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.m-header .el-avatar--square {
		border-radius: 4px;
		overflow: hidden;
	}

	.m-header .el-button--primary.is-plain,
	.m-header .el-button--danger.is-plain {
		border-color: #4c81ff !important;
	}

	.m-header .el-button--primary.is-plain:hover,
	.m-header .el-button--danger.is-plain:hover,
	.m-header .el-button--primary.is-plain:active,
	.m-header .el-button--danger.is-plain:active,
	.m-header .el-button--primary.is-plain:focus,
	.m-header .el-button--danger.is-plain:focus {
		background: #dfe9ff !important;
		color: #4c81ff !important;
	}

	.m-header .el-button--primary.is-plain:focus,
	.m-header .el-button--danger.is-plain:focus {
		/* border-color:transparent!important; */
	}

	.m-header .el-tabs__nav-wrap:after {
	}

	.m-header .menu img {
		width: 28px;
		display: inline-block;
		cursor: pointer;
		margin-right: 5px;
		border-radius: 4px;
		vertical-align: top;
	}

	.m-header .menu .el-avatar {
		width: auto !important;
		background: transparent;
	}

	.nav-bar {
		@include PositionAbsoulte(0, 0, 0, 0);
		padding: 0 15px;
	}

	.nav.left {
		@include PositionRelative(null, 100%);
		float: left;
		left: 0;
		display: flex;
		align-items: center;
		color: #333;
		font-size: 16px;
		> div {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			div {
				display: inline-block;
				vertical-align: top;
			}
			a {
				display: inline-block;
			}
		}
	}

	.nav.right {
		@include PositionRelative(null, 100%);
		float: right;
		right: 20px;
		display: flex;
		align-items: center;
	}

	.nav .nav-btn {
		margin: 0 5px;
		background: #eaf1ff !important;
		color: #6087fd !important;
		border: none;
	}

	.nav .nav-btn:hover {
		background: #d8e1ff;
	}

	.nav.middle {
		font-size: 18px;
		line-height: $mheaderHeight;
		@include PositionAbsoulte(0, null, null, 50%);
		transform: translate(-50%, 0%);
		color: #333;
		height: $mheaderHeight;
		overflow: hidden;
	}

	.nav.middle .el-tabs__item {
		color: #333;
		font-size: 12px;
	}
	.text {
		cursor: pointer;
		line-height: $mheaderHeight;
		font-size: 16px;
		color: #333;
		display: flex;
		align-items: center;
	}

	.avatar-image {
		@include GlobalAvatar(100%, 100%, null, null);
	}
	.mheader {
		&-item {
			.icon {
				font-size: 16px;
			}
		}
	}
</style>
<style lang="scss" scoped>
	::v-deep {
		.el-dropdown-selfdefine {
			&:focus:active {
				background: transparent !important;
			}
		}
	}
</style>
