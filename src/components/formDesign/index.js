
import FormDesign from "./index.vue";
import locale from './lang/index';


export default {
	install(Vue,opts={}) {
		locale.use(opts.locale);
		
		Vue.component("Rvue" + FormDesign.name, FormDesign);
	},
	locale: locale.use
};
