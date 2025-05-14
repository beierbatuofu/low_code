import { Provider, ProviderParam } from "../ProviderInit";
import { getFormSingle } from "@/api/form";
import { FormModule } from "@/store/modules/form";
import { UserModule } from "@/store/modules/user";
import { Route } from "vue-router";

/**
 * 表单信息的provider
 */
export class FormInfoProvider implements Provider {
	// addFlag(to: Route, from: Route, next: any){
	// 	let {path} = to;

	// 	if(/^\/app.+edit.*/.test(path)){
	// 		(<any>UserModule).SET_ENC_MODE("test");
	// 	}else{

	// 		(<any>UserModule).SET_ENC_MODE("");
	// 	}

	// }

	support(params: ProviderParam): boolean {
		const reg = /^\/app\/\w+\/form\/\w+/;
		var re = new RegExp(reg);
		return re.test(params.to.path);
	}
	excute(params: ProviderParam): void {
		if (params && params.to) {
			const param = params.to.params;
			// {
			//     "appCode": "1",
			//     "id": "93eded09ba11409c9877130a4e41165c"
			// }
			// getFormSingle(param.appCode, param.id).then((res: any) => {
			// 	try{
			// 		const { structure, name, type } = res.data;

			// 		// this.options = structure || { column: [] };
			// 		FormModule.setForm({
			// 			options: structure || { column: [] },
			// 			name,
			// 			type,
			// 		});
			// 	}catch(err){

			// 	}

			// });
		}
	}
}
