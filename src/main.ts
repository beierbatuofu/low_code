import Vue, { CreateElement } from "vue";
import "@/styles/font.css";
import "@/styles/main.scss";
import "@/styles/mobile/index.scss";
import "vant/lib/index.css";
import VueLazyload from "vue-lazyload";
import Component from "vue-class-component";
/**
 * TODO
 * ElementUI 应在rvue-ui中引用
 */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "@/router";
import Intercept from "@/router/intercept";
import store from "@/store";
import "@/core/permission.ts";
import "@/core/directive.ts";
import App from "@/App.vue";
import { addProviders } from "@/router/ProviderInit";
import { FormInfoProvider } from "@/router/provider/FormInfoProvider";
import EnvFlagProvider from "@/router/provider/EnvFlagProvider";
import { AppPermProvider } from "@/router/provider/AppPermProvider";
import FormDesign from "@/components/formDesign/";
import * as filters from "@/core/filters";
import i18n, { loadI18n } from "@/lang";
import utils from "@/utils";
import "./components/rvue/custom/styles/index.scss";
// import { AppError } from "@/utils/Error";
import registerComps from "@/core/registerComps";
import RvueUi from "@/components/rvue/ui/index.ts";
import singleSpaVue from "single-spa-vue";

// 初始化语言包
loadI18n();

// 测试环境下开启vconsole
utils.bMobile && process.env.NODE_ENV == "production" && process.env.VUE_APP_ENV == "test" && new (require("vconsole/dist/vconsole.min.js"))();

//组件内部路由生命周期
Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave", "beforeRouteUpdate"]);

//自动注册全局组件 驼峰命名 文件以Rvue|Attr|Config|Rfield开头
registerComps(require.context("./components", true, /(Rvue|Attr|Config|Rfield|TD|CT|BT).+\.(vue)$/));

// 注册全局过滤器
Object.keys(filters).forEach((key) => Vue.filter(key, (filters as { [key: string]: Function })[key]));
//挂载工具包
Vue.use((vm: any) => (vm.prototype.$utils = utils));

//模块安装
Vue.use(VueLazyload);
// Vue.use(RvueUi, { locale:'zh' });
Vue.use(ElementUI);
// Vue.use(Vant); //手机端使用vant组件
Vue.use(FormDesign);
// Vue.use(AvueUeditor);
// Vue.use(AvueMap);

//安装组件库
Vue.use(RvueUi);

Vue.config.productionTip = false;

//全局捕获代码错误
// Vue.config.errorHandler = function (err, vm, info) {
// 	AppError.ins(err);
// };

process.env.NODE_ENV != "production" && (Vue.config.performance = true);

// 在这里添加需要执行的策略
addProviders(new EnvFlagProvider());
addProviders(new FormInfoProvider());
addProviders(AppPermProvider.ins());

/**
 * TODO:
 * 路由发生变化会触发该方法，vuex store的数据会被重置
 * 因此应尽可能的减少路由变更
 */
//router.beforeEach(beforeEachProcess);

//移动端路由拦截
new Intercept().mobileIntercept();
//console.log(process.env.VUE_APP_VERSION);
localStorage.setItem("version", <string>process.env.VUE_APP_VERSION);
Vue.prototype.publicPath = process.env.VUE_APP_BASE_URL;
/**
 *  TODO
 *  微应用配置,基座未完成
 *  路由BASE_URL未配置
 *
 */
let appOptions: Record<string, any> = {
	el: "#microApp",
	router,
	store,
	i18n,
	render: (h: CreateElement) => h(App),
};

if (!(<Window & Record<string, any>>window).singleSpaNavigate) {
	delete appOptions.el;
	new Vue(appOptions).$mount("#app");
}

let vueLifecycle = singleSpaVue({
	Vue,
	appOptions,
});

//微应用生命周期
export function bootstrap() {
	return vueLifecycle.bootstrap(() => {});
}

export function mount() {
	return vueLifecycle.mount(() => {});
}

export function unmount() {
	return vueLifecycle.unmount(() => {});
}

export function update() {
	return vueLifecycle.update(() => {});
}
