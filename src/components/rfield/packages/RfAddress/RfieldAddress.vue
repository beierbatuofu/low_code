<template>
	<div class="rvue-form-group" :class="{ 'in-table': !!tableProp }">
		<template v-if="!readonly">
			<rvue-address style="width: 100%; margin-bottom: 10px" v-model="city" :disabled="bDisabled" :readonly="readonly"></rvue-address>
			<rvue-input type="textarea" class="detail" @blur="handleBlur" v-model="detail" :disabled="bDisabled" :placeholder="$t('global.placeholderAddress')" :readonly="readonly"></rvue-input>
		</template>
		<div v-else class="widget-readonly">{{ city.join("") }} {{ detail }}</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfAddress.ts";
	import RvueAddress from "@/components/rvue/custom/packages/address/RvueAddress.vue";

	@Component({
		components: {
			"rvue-address": RvueAddress,
		},
	})
	export default class RvueFieldAddress extends WidgetField {
		private get addressValue() {
			try {
				return JSON.parse(JSON.stringify(this.value));
			} catch (err) {
				return "";
			}
		}

		private set addressValue(v: any) {
			this.value = JSON.parse(JSON.stringify(v));
		}

		private get detail() {
			if (!this.addressValue) return "";
			return this.addressValue.detail;
		}

		private set detail(v: string) {
			if (typeof this.value == "string") this.value = JSON.parse(this.value);
			let { province, city, district } = this.addressValue;
			this.addressValue = {
				province,
				city,
				district,
				detail: v,
			};
			this.handleUpdate(this.addressValue);
		}

		private get city() {
			if (!this.addressValue) return [];
			if (typeof this.addressValue == "string" && this.addressValue) this.value = JSON.parse(this.value);
			return [this.addressValue.province, this.addressValue.city, this.addressValue.district].filter((s: string | undefined) => !!s);
		}

		private set city(a: string[]) {
			if (typeof this.value == "string" && this.value) this.value = JSON.parse(this.value);

			this.addressValue = {
				province: a[0] ?? "",
				city: a[1] ?? "",
				district: a[2] ?? "",
				detail: this.addressValue.detail,
			};
			// this.value.province = a[0] ?? "";
			// this.value.city = a[1] ?? "";
			// this.value.district = a[2] ?? "";

			this.handleUpdate(this.addressValue);
		}

		private get bDisabled() {
			return this.disabled;
		}

		// private get inputValue() {
		// 	return (<any>this).value;
		// }

		// private set inputValue(n: any) {
		// 	(<any>this).value = n;

		// 	this.handleInput(n);
		// }
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
</style>
<style lang="scss" scoped>
	::v-deep {
		textarea {
			padding: 5px 30px !important;
			min-height: 60px !important;
		}
	}
</style>
