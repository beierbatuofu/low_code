<script lang="tsx">
	import { getDtTempToken, login } from "@/api/login";
	import { RespData } from "@/utils/RCall";
	import { Vue, Component } from "vue-property-decorator";
	import { LoginModule } from "@/store/modules/login";
	import Logins from "@/core/Logins.ts";

	@Component
	export default class LoginRollback extends Vue {
		protected mounted() {
			let loginType: string = this.$route.params.loginType;
			Logins.init(this, loginType);
		}

		protected render() {
			return <div></div>;
		}
	}
</script>
