import Flow from "./flow.vue";

(Flow as Record<string, any>).install = function (Vue: Record<string, any>) {
	Vue.component((Flow as Record<string, any>).compName, Flow);
};

export default Flow;
