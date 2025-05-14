<template>
	<div class="setlang">
		<div :class="[inline ? 'inline group' : 'group']">
			<div class="input">
				<el-input @input="bindInput" v-model="value" :placeholder="placeholder" :type="type" @blur="bindBlur" :maxlength="maxlength" />
				<span class="custom-icon-record-sphere" @click="dialogVisible = true"></span>
			</div>
		</div>
		<rvue-dialog :destroy-on-close="true" :visible.sync="dialogVisible" width="30%" append-to-body>
			<div style="margin-top: 15px" class="setlang-dialog">
				<el-form :model="form" label-width="40px" class="langForm">
					<el-form-item class="form-item" v-for="(item, index) in ['zh', 'en']" :key="index" :label="$l('global.' + item)" style="width: 80%">
						<el-input v-model="form[item]" :maxlength="maxlength" />
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogVisible = false">{{ $l("global.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="bindSubmit">{{ $l("global.confirm") }}</el-button>
			</span>
		</rvue-dialog>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { defaultLang } from "@/lang/index";
	const langlist = ["zh", "en"];

	@Component
	export default class InputLang extends Vue {
		@Prop({ type: Boolean, default: false }) inline!: boolean;
		@Prop({ type: String, default: "" }) placeholder!: string;
		@Prop({ type: Object, default: () => ({}) }) field!: TJson;
		@Prop({ type: String, default: "text" }) type!: string;

		@Prop({ type: Boolean, default: false }) empty!: boolean;
		@Prop({ type: [String, Number], default: 100 }) maxlength!: string | number;

		private dialogVisible = false;
		private form: TJson = {};
		private value = "";
		private oValue: any = "";
		private changeLang: TJson = {};

		private get langs() {
			return Object.keys(this.changeLang).length ? this.changeLang : this.field;
		}

		protected created() {
			let langs: TJson = this.field || {};
			Object.keys(this.langs).forEach((key: string) => this.$set(this.form, key, langs[key] || this.langs[key]));
			this.value = this.form[defaultLang()];
		}

		private bindInput() {
			this.field[defaultLang()] = this.value;
		}

		private bindBlur() {
			if (this.empty) return;

			this.value ? (this.field[defaultLang()] = String(this.value).trim()) : (this.field[defaultLang()] = this.value = this.oValue);
		}

		private bindSubmit() {
			let data = (<any>this).$utils.clone(this.form);
			this.value = this.form[defaultLang()];
			this.dialogVisible = false;
			Object.keys(this.form).forEach((k: any) => {
				this.form[k] = String(this.form[k]).trim();
			});
			this.changeLang = this.form;
			this.$emit("change", this.form);
		}

		@Watch("value")
		onChangeValue(n: any, o: any) {
			o & (this.oValue = <any>String(o || "").trim());
			n && (this.form[defaultLang()] = <any>String(n || "").trim());

			n && this.$emit("change", this.form);
		}

		@Watch("dialogVisible")
		onChangeDialogVisible(n: Boolean) {
			n && (this.form = (<any>this).$utils.clone(this.langs));
		}

		@Watch("field")
		onChangeField(n: any) {
			this.value = n[defaultLang()];
		}
	}
</script>
<style lang="scss">
	%labelStyle {
		white-space: nowrap;
		display: block;
		font-size: 14px;
		padding-right: 12px;
	}

	.setlang {
		&-dialog {
			.el-form-item {
				display: flex;
			}
			.el-form-item__label {
				white-space: nowrap;
				padding-right: 5px;
				display: block;
				float: none;
				width: 60px !important;
				text-align: right;
				padding-right: 5px;
			}
			.el-form-item__content {
				flex: 1;
				margin: 0 !important;
			}
		}

		.form-item {
			margin-bottom: 22px;
			display: flex;
		}
		.group {
			label {
				text-align: left;
				@extend %labelStyle;
				margin-bottom: 10px;
			}
			.input {
				padding-right: 25px;
				position: relative;
				flex: 1;
				display: flex;
				.el-input {
					position: relative;
					input {
						// height: 36px !important;
						// line-height: 36px !important;
					}
				}
			}
			.custom-icon-record-sphere {
				font-size: 20px;
				@include PositionAbsoulte(50%, 0, null, null);
				transform: translateY(-50%);
				cursor: pointer;
				color: $color;
			}
		}

		.inline {
			display: flex;
			align-items: center;
			label {
				text-align: right;
				@extend %labelStyle;
				margin-bottom: 0px;
			}
		}
	}

	.langForm {
		.el-form-item__label {
			margin-right: 30px;
		}
	}
</style>
