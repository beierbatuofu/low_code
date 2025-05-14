<script lang="tsx">
	import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	@Component({})
	class RvueDialog extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-dialog";

		@PropSync("visible", { type: Boolean, default: false }) syncVisible!: boolean;
		@Prop({ type: String, default: "" }) title!: string;
		@Prop({ type: String, default: "60%" }) width!: string;
		@Prop({ type: Boolean, default: false }) fullscreen!: boolean;
		@Prop({ type: String, default: "15vh" }) top!: string;
		@Prop({ type: Boolean, default: true }) modal!: boolean;
		@Prop({ type: Boolean, default: true }) modalAppendToBody!: boolean;
		@Prop({ type: Boolean, default: false }) appendToBody!: boolean;
		@Prop({ type: Boolean, default: true }) lockScroll!: boolean;
		@Prop({ type: String }) customClass!: string;
		@Prop({ type: Boolean, default: true }) closeOnClickModal!: string;
		@Prop({ type: Boolean, default: true }) closeOnPressEscape!: string;
		@Prop({ type: Boolean, default: true }) showClose!: string;
		@Prop({ type: Function }) beforeClose!: (done: any) => {};
		@Prop({ type: Boolean, default: false }) center!: boolean;
		@Prop({ type: Boolean, default: false }) destroyOnClose!: boolean;

		private handleOpen() {
			this.$emit("open");
		}

		private handleOpened() {
			this.$emit("opened");
		}

		private handleClose() {
			this.$emit("close");
		}

		private handleClosed() {
			this.$emit("closed");
		}
		private handleClick() {
			this.syncVisible = false;
		}

		protected render(h: CreateElement) {
			let self = this;

			let titleSlot = this.$slots.title || [];
			let defaultSlot = this.$slots.default || [];
			let footerSlot = this.$slots.footer || [];
			let scopedSlots: Record<string, any> = this.$scopedSlots;

			scopedSlots.hasOwnProperty("title") && (titleSlot = scopedSlots.title());
			scopedSlots.hasOwnProperty("default") && (defaultSlot = scopedSlots.default());
			scopedSlots.hasOwnProperty("footer") && (footerSlot = scopedSlots.footer());
			return (
				<el-dialog
					props={{
						title: self.title,
						visible: self.syncVisible,
						width: self.width,
						fullscreen: self.fullscreen,
						top: self.top,
						modal: self.modal,
						"modal-append-to-body": self.modalAppendToBody,
						"append-to-body": self.appendToBody,
						"lock-scroll": self.lockScroll,
						"custom-class": self.customClass,
						"close-on-click-modal": self.closeOnClickModal,
						"close-on-press-escape": self.closeOnPressEscape,
						"show-close": self.showClose,
						"before-close": self.beforeClose,
						center: self.center,
						"destroy-on-close": self.destroyOnClose,
					}}
					on={{
						"update:visible": function (b: boolean) {
							self.syncVisible = b;
						},
						open: self.handleOpen,
						close: self.handleClose,
					}}
				>
					{!!titleSlot.length && <div slot="title">{titleSlot.map((item) => item)}</div>}

					<div>{defaultSlot.map((item) => item)}</div>
					<div slot="footer" style="width:100%">
						{footerSlot.map((item) => item)}
					</div>
				</el-dialog>
			);
		}
	}
	RvueDialog.install = function (Vue: any) {
		Vue.component(RvueDialog.compName, RvueDialog);
	};
	export default RvueDialog;
</script>
<style lang="scss" scoped>
	.close {
		@include PositionAbsoulte(50%, 10px, null, null);
		transform: translateY(-50%);
	}
	::v-deep .el-dialog__title {
		font-size: 16px;
	}
	::v-deep .el-dialog__header {
		font-size: 16px;
		color: #333;
		text-align: left;
		padding: 10px 10px 10px 20px;
		position: relative;
	}
	@media screen and (max-width: 768px) {
		::v-deep .el-dialog__title {
			font-size: 16px;
		}
		::v-deep .el-dialog__header {
			font-size: 16px;
			padding: 6px;
		}
		::v-deep .el-dialog__close {
			font-size: 16px !important ;
			line-height: 45px;
		}
	}
	::v-deep .el-dialog__headerbtn {
		top: 50%;
		transform: translateY(-50%);
	}
	::v-deep {
		.el-dialog__header {
			.el-dialog__close {
				//	color: #000 !important;
				font-size: 16px;
			}
		}
		.el-dialog__body {
			border: none !important;
			padding: 12px !important;
		}
		.dialog-title {
			padding: 0 0 0 12px !important;
			height: 40px;
			line-height: 40px;
			text-align: left;
			position: relative;

			&::before {
				content: "";
				height: 30px;
				width: 5px;
				background: $color;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}
		.el-dialog__footer,
		.dialog-footer {
			padding: 8px 10px !important;
			text-align: right !important;
			box-sizing: border-box;
		}
	}
</style>
