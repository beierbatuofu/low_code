/*
 * @Author: ben
 * @LastEditTime: 2021-08-10 11:20:40
 */
import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import classTheme from "@/utils/theme";
import store from "@/store";
import { RCall } from "@/utils/RCall";

export interface SettingsState {
	themeColor: string;
}

@Module({ dynamic: true, store, name: "design" })
class Settings extends VuexModule implements SettingsState {
	public themeColor = "";

	@Mutation
	public SET_THEMECOLOR(val: string) {
		let baseUrl = process.env.VUE_APP_ENV !== "test" ? "https://cdn-codezero-ui.risen.com" : window.location.origin || window.location.href.split("#")[0];
		// const hanldeTheme = classTheme.init(
		//     val,
		//     (RCall.newIns() as any).instance.get(baseUrl+'/style/theme.css')
		// )
		const hanldeTheme = classTheme.init(
			val,
			new Promise((resolve: any, reject: any) => {
				// if (!document.getElementById("themeLink")) {
				// 	let themeLink = document.createElement("link");
				// 	themeLink.href = baseUrl + "/style/theme.css";
				// 	themeLink.id = "themeLink";
				// 	themeLink.setAttribute("rel", "stylesheet");
				// 	themeLink.setAttribute("type", "text/css");
				// 	(<any>document).querySelector("head").appendChild(themeLink);
				// } else {
				// 	(<any>document.getElementById("themeLink")).href = baseUrl + "/style/theme.css";
				// }
			})
		);
		// window.localStorage.setItem('theme',val);
		this.themeColor = val;
	}
}

export const SettingsModule = getModule(Settings);
