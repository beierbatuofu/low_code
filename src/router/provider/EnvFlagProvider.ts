import { UserModule } from "@/store/modules/user";
import { Provider, ProviderParam } from "../ProviderInit";
import { FormModule } from "@/store/modules/form";

export default class EnvFlagProvider implements Provider {
	support(param: ProviderParam): boolean {
		return true;
	}

	async getCurrApp(to: any) {
		let { path, params } = to;
		let { appCode } = params;
		let res: Record<string, any> = {};

		appCode && (res = await FormModule.getAppInfo(appCode));
		const { name } = res;

		document.title = to.path.includes("workbench") || !name ? "聆风" : name;
	}

	excute(param: ProviderParam): void {
		let { path } = param.to;
		(<any>this).getCurrApp(param.to);

		if (/appd/.test(path)) {
			(<any>UserModule).SET_ENC_MODE("test");
		} else {
			(<any>UserModule).SET_ENC_MODE("");
		}
	}
}
