/*
 * @Author: ben
 * @LastEditTime: 2021-05-27 13:07:49
 */
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { loadI18n, defaultLang } from "@/lang";

export interface LangState {
	language: string;
}

@Module({ dynamic: true, store, name: "lang" })
class Lang extends VuexModule implements LangState {
	public language = defaultLang();

	@Mutation
	private SET_LANGUAGE(language: string) {
		this.language = language;
		localStorage.setItem("lang", language);
		loadI18n();
	}

	@Action
	public SetLanguage(language: string) {
		this.SET_LANGUAGE(language);
	}
}

export const LangModule = getModule(Lang);
