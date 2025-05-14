import Vue from "vue";
import Vuex from "vuex";

import { UserState } from "./modules/user";
import { FormState } from "./modules/form";
import { FlowState } from "./modules/flow";
import { PermissionState } from "./modules/permission";
import { DesignState } from "./modules/design";
import { SettingsState } from "./modules/settings";
import { LoginState } from "./modules/login";
import { ChartState } from "./modules/chart";

Vue.use(Vuex);

export interface RootState {
	user: UserState;
	form: FormState;
	flow: FlowState;
	permission: PermissionState;
	design: DesignState;
	settings: SettingsState;
	login: LoginState;
	chart: ChartState;
}

export default new Vuex.Store<RootState>({});
