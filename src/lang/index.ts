/*
 * @Author: ben
 * @LastEditTime: 2022-02-02 16:22:58
 */
import Vue from "vue";
import VueI18n from "vue-i18n";
import designLocale from "@/components/formDesign/lang";
import locale from "element-ui/lib/locale";

import en from "./languages/en";
import zh from "./languages/zh";

declare module "vue/types/vue" {
	interface Vue {
		$l: typeof VueI18n.prototype.t;
	}
}

Vue.use(VueI18n);
Vue.prototype.$l = Vue.prototype.$t;

// delete Vue.prototype.$t;

//默认系统语言
const osLanguage = (navigator.language || (navigator as any).userLanguage).split("-")[0].toLowerCase();

const messages: any = {
	en,
	zh,
};

export const defaultLang = () => {
	//兼容safari
	try {
		return localStorage.getItem("lang") || (Object.keys(messages).includes(osLanguage) && osLanguage) || "zh";
	} catch (err) {
		return "zh";
	}
};

const i18n = new VueI18n({
	locale: defaultLang(),
	messages: {},
});

//默认加载语言包
export const loadlanguages = (sLang: string) =>
	import(`./languages/${sLang}.ts`).then((_module: any) => {
		i18n.setLocaleMessage(sLang, _module.default);
		i18n.locale = sLang;
	});

loadlanguages("en");

export const loadI18n = () => {
	const lang: any = defaultLang();

	designLocale.use(lang);
	const elelang = lang == "zh" ? lang + "-CN" : lang;
	if (!elelang || elelang == "undefined") return;
	locale.use(require(`element-ui/lib/locale/lang/${elelang}`).default);
	loadlanguages(lang);
};

export default i18n;
