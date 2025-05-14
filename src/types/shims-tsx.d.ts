import Vue, { VNode } from "vue";

declare global {
	namespace JSX {
		// tslint:disable no-empty-interface
		interface Element extends VNode {}
		// tslint:disable no-empty-interface
		interface ElementClass extends Vue {}
		interface IntrinsicElements {
			[elem: string]: any;
		}
	}
}

declare module "vue/types/options" {
	interface ComponentOptions<V extends Vue> {
		[propName: string]: any;
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$Rconfirm: (message: string, title: string, options: TJson) => Promise<any>;
		$Ralert: (message: string, title: string, options: TJson) => Promise<any>;
		$Rprompt: (message: string, title: string, options: TJson) => Promise<any>;
		$utils: TJson;
		$Rmessage: any;
		$Rloading: any;
	}
}
