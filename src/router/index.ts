import LoginPage from "@/views/login";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { bMobile } from "@/utils/global";

// 对push方法进行重新，防止catch捕获
const originalPush: any = VueRouter.prototype.push;
// @ts-ignore
VueRouter.prototype.push = function push(location: any, onResolve: any, onReject: any) {
	if (onResolve || onReject) {
		return originalPush.call(this, location, onResolve, onReject);
	}
	return originalPush.call(this, location).catch((err: any) => err);
};

Vue.use(VueRouter);

export const constantRoutes: RouteConfig[] = [
	{
		path: "/",
		redirect: "/no_password",
		meta: {
			hideHeader: true,
			mobile: true,
		},
	},

	{
		path: "/no_password",
		component: () => import("@/views/verify/verify.vue"),
		meta: {
			hideHeader: true,
			mobile: true,
			noLogin: true,
		},
	},
	{
		path: "/:tenantId/login/",
		component: LoginPage,
		meta: {
			hideHeader: true,
			mobile: true,
			noLogin: true,
		},
	},
	{
		path: "/:tenantId/qr/:loginType",
		component: () => import("@/views/login/_components/loginRollback.vue"),
		meta: {
			hideHeader: true,
			mobile: true,
			noLogin: true,
		},
	},
	{
		path: "/not_permission",
		component: () => import("@/views/errorPage/notPermission.vue"),
		meta: {
			mobile: true,
		},
	},

	{
		path: "/ddfreelogin",
		component: () => import("@/views/ddFreeLogin/index.vue"),
		meta: {
			mobile: true,
			noLogin: true,
		},
	},
	{
		path: "/ext-link/f/:id",
		component: () => import("@/views/ext-link/ext-link.vue"),
		meta: {
			keepAlive: false,
			requireLogin: false,
			mobile: true,
			noLogin: true,
		},
	},
	{
		path: "/tenants",
		component: () => import("@/views/tenants/tenants.vue"),
		meta: {
			// keepAlive: false,
			// requireLogin: false,
			// mobile: true,
			noLogin: true,
		},
	},
];

// 根据权限动态加载路由
export const asyncRoutes: RouteConfig[] = [
	{
		path: "/:tenantId/workbench",
		component: () => import("@/views/workbench/workbench.vue"),
		meta: {
			requireLogin: true,
			langFlag: true,
			mobile: true,
		},
	},
	{
		path: "/",
		name: "Index",
		redirect: "/:tenantId/workbench",
		meta: {
			requireLogin: true,
			mobile: true,
		},
	},
	{
		path: "/:tenantId/platform/config",
		name: "CorpLog",
		component: () => import("@/views/corp/corp.vue"),
		meta: {
			requireLogin: true,
			mobile: false,
		},
	},
	{
		path: "/app/:dataId/ext_ddlink/:formCode",
		component: () => import("@/views/extDDLink/index.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			mobile: true,
			noLogin: true,
		},
	},

	//二维码

	{
		path: "/:tenantId/flow",
		component: () => import("@/views/flowcenter/index.vue"),
		redirect: "/:tenantId/flow/todo",
		meta: {
			permissionCode: "todo:manager",
			name: "我的待办",
			mobile: true,
		},
		children: [
			{
				path: "todo",
				component: () => import("@/views/flowcenter/todo.vue"),
				meta: {
					permissionCode: "todo:manager",
					name: "我的待办",
					mobile: true,
				},
			},
			{
				path: "create",
				component: () => import("@/views/flowcenter/create.vue"),
				meta: {
					permissionCode: "initiate:manager",
					name: "我的发起",
					mobile: true,
				},
			},
			{
				path: "transactors",
				component: () => import("@/views/flowcenter/transactors.vue"),
				meta: {
					permissionCode: "handle:manager",
					name: "我的处理",
					mobile: true,
				},
			},
			{
				path: "ccUsers",
				component: () => import("@/views/flowcenter/ccUsers.vue"),
				meta: {
					permissionCode: "cc:manager",
					name: "我的抄送",
					mobile: true,
				},
			},
			{
				path: "draft",
				component: () => import("@/views/flowcenter/draft.vue"),
				// meta: {
				// 	permissionCode: "",
				// 	name: "我的草稿",
				// },
			},
		],
	},

	//普通详情页
	{
		path: "/:tenantId/app/:appCode/:flag/form/:formCode/:dataId",
		name: "detail",
		component: () => import("@/views/details/detail.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			langFlag: true,
			perm: "canVisitApps",
			mobile: true,
			isGuest: true,
		},
	},
	//数据管理详情页
	{
		path: "/:tenantId/app/:appCode/:flag/manage_detail/:formCode/:dataId",
		name: "manageDetail",
		component: () => import("@/views/details/manageDetail.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			langFlag: true,
			perm: "canVisitApps",
			mobile: true,
			isGuest: true,
		},
	},

	//具体的图表 "/app/:appCode/bi/:formCode/biEdit/:type/:id"
	{
		path: "/:tenantId/appd/:appCode/:flag/bi/:formCode/chart/:type/:id",
		component: () => import("@/views/bidesign/index.vue"),
		meta: {
			hideHeader: true,
			mobile: false,
			perm: "canDevApps",
		},
		name: "BiReport",
	},
	//仪表盘 path: "/app/:appCode/bi/:formCode/biDashboard"
	{
		path: "/:tenantId/appd/:appCode/:flag/bi/:formCode/dashboard_design/",
		component: () => import("@/views/bilist/index.vue"),
		meta: {
			mobile: true,
			perm: "canDevApps",
		},
		name: "BiDashboard",
	},
	{
		path: "/:tenantId/app/:appCode/:flag/",
		name: "canVisitApps",
		component: () => import("@/views/app/index.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			langFlag: true,
			perm: "canVisitApps",
			mobile: true,
			isGuest: true,
		},
		children: [
			{
				path: "form/:formCode",
				name: "canVisitApps",
				component: () => import("@/views/formData/formData.vue"),
				meta: {
					keepAlive: false,
					requireLogin: true,
					perm: "canVisitApps",
					mobile: true,
					langFlag: true,
					isGuest: true,
				},
			},
			{
				path: "bi_form/:formCode",
				name: "canVisitApps",
				component: () => import("@/views/formData/biForm.vue"),
				meta: {
					keepAlive: false,
					requireLogin: true,
					perm: "canVisitApps",
					mobile: true,
					langFlag: true,
					isGuest: true,
				},
			},
			{
				path: "date/:formCode",
				name: "canVisitApps",

				component: () => import("@/views/fulldate/detail/detail.vue"),
				meta: {
					keepAlive: false,
					requireLogin: true,
					perm: "canVisitApps",
					mobile: true,
					langFlag: true,
					isGuest: true,
				},
			},
		],
	},
	{
		path: "/:tenantId/app/:appCode/:flag/fulldate/:formCode",
		name: "canVisitApps",

		component: () => import("@/views/fulldate/detail/detail.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			perm: "canVisitApps",
			mobile: true,
			langFlag: true,
			isGuest: true,
		},
	},

	//--------------二维码 路由地址 LK --11.19------------
	{
		path: "/:tenantId/anonymousUser/:appCode/form/:formCode/:dataId/:assignCode",
		name: "AnonymousUser",
		component: () => import("@/views/qrcode/qrcode.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			langFlag: true,
			//perm: "canVisitApps",
			mobile: true,
			noLogin: true,
			isGuest: true,
		},
	},

	// {
	// 	path: "/:tenantId/app/:appCode/form/:formCode/dataInfo/:dataInfo",
	// 	name: "addListBtn",
	// 	component: () => import(/* webpackChunkName: "chunk-appHome" */ "@/views/anonymous/addListBtn.vue"),
	// 	meta: {
	// 		keepAlive: false,
	// 		requireLogin: true,
	// 		langFlag: true,
	// 		//perm: "canVisitApps",
	// 		mobile: true,
	// 	},
	// },

	//-----新增按钮 外链模式为路由 LK --11.23------
	{
		path: "/:tenantId/app/:appCode/form/:formCode/dataInfo/:dataInfo",
		name: "addListBtn",
		component: () => import("@/views/form/addListBtn.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			langFlag: true,
			//perm: "canVisitApps",
			mobile: true,
			isGuest: true,
		},
	},

	{
		path: "/:tenantId/app/:appCode/:flag/flow/",
		component: () => import("@/views/flowcenter/appflowcenter.vue"),
		redirect: "/:tenantId/app/:appCode/:flag/flow/todo",
		meta: {
			permissionCode: "todo:manager",
			name: "我的待办",
			mobile: true,
		},
		children: [
			{
				path: "todo",
				component: () => import("@/views/flowcenter/todo.vue"),
				meta: {
					permissionCode: "todo:manager",
					name: "我的待办",
					mobile: true,
				},
			},
			{
				path: "create",
				component: () => import("@/views/flowcenter/create.vue"),
				meta: {
					permissionCode: "initiate:manager",
					name: "我的发起",
					mobile: true,
				},
			},
			{
				path: "transactors",
				component: () => import("@/views/flowcenter/transactors.vue"),
				meta: {
					permissionCode: "handle:manager",
					name: "我的处理",
					mobile: true,
				},
			},
			{
				path: "ccUsers",
				component: () => import("@/views/flowcenter/ccUsers.vue"),
				meta: {
					permissionCode: "cc:manager",
					name: "我的抄送",
					mobile: true,
				},
			},
		],
	},
	{
		path: "/:tenantId/appd/:appCode/:flag/",
		component: () => import("@/views/app/app-set.vue"),
		meta: {
			keepAlive: false,
			requireLogin: true,
			permissionCode: "form:manager",
			name: "应用管理",
			langFlag: true,
			perm: "canDevApps",
			mobile: false,
		},
		name: "appEdit",
	},
	// {
	// 	path: "/app/:appCode/form",
	// 	component: () => import(/* webpackChunkName: "chunk-appCode-form" */ "@/views/form/form.vue"),
	// 	children: [
	// 		{
	// 			path: "",
	// 			component: () => import(/* webpackChunkName: "chunk-rvue-form" */ "@/views/form/avue-form"),
	// 			meta: {
	// 				requireLogin: true,
	// 				permissionCode: "form:manager",
	// 				perm: "canDevApps",
	// 				mobile: true,
	// 			},
	// 		},
	// 	],
	// 	meta: {
	// 		requireLogin: true,
	// 		permissionCode: "form:manager",
	// 		perm: "canDevApps",
	// 	},
	// },
	{
		path: "/:tenantId/appd/:appCode/:flag/form/:id/",
		component: () => import("@/views/form/form.vue"),
		redirect: "/:tenantId/appd/:appCode/:flag/form/:id/form_design",
		meta: {
			keepAlive: false,
			requireLogin: true,
			permissionCode: "form:manager",
			perm: "canDevApps",
			mobile: false,
		},
		children: [
			{
				path: "form_design",
				name: "FormDesign",
				component: () => import("@/views/form/avue-form"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			{
				path: "form_publish",
				component: () => import("@/views/form/form-publish.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			{
				path: "form_data",
				component: () => import("@/views/form/form-data.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
				},
			},
			{
				path: "flow_design",
				name: "FormFlow",
				component: () => import("@/views/flow/index.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},

			{
				path: "list_design",
				name: "TableDesign",
				component: () => import("@/views/tableDesign/designs.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			//数据管理  LK 12.09
			{
				path: "data_management",
				name: "dataManagent",
				component: () => import("@/views/formData/dataManagement.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
		],
	},
	{
		path: "/:tenantId/appd/:appCode/:flag/conf/",
		component: () => import("@/views/appSet/appSet.vue"),
		redirect: "/:tenantId/appd/:appCode/:flag/conf/basic",
		meta: {
			permissionCode: "form:manager",
			perm: "canDevApps",
			mobile: false,
		},
		children: [
			{
				path: "basic",
				component: () => import("@/views/appSet/basicSet/basicSet.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			{
				path: "designer",
				component: () => import("@/views/appSet/appDesigner/appDesigner.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			{
				path: "role",
				component: () => import("@/views/appSet/role/role.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
					name: "role",
				},
			},
			{
				path: "dataset",
				component: () => import("@/views/appSet/dataSet/dataSet.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
			{
				path: "dataset/:datasetId",
				component: () => import("@/views/appSet/_components/sql/sql.vue"),
				meta: {
					permissionCode: "form:manager",
					perm: "canDevApps",
					mobile: false,
				},
			},
		],
	},
	// {
	// 	path: "/app/:appCode/form/:id/preview",
	// 	component: () => import("@/views/form/mobile-preview.vue"),
	// 	meta: {
	// 		perm: "canDevApps",
	// 		mobile: true,
	// 	},
	// },

	{
		path: "/:tenantId/appd/:appCode/:flag/fulldate/:formCode/fulldate_design",
		component: () => import("@/views/fulldate/design/fulldateDesign.vue"),
		meta: {
			// hideHeader: true,
			// mobile: false,
			// perm: "canDevApps",
		},
		name: "fulldateDesign",
	},
	{
		path: "*",
		redirect: "/not_permission",
		meta: {
			mobile: true,
		},
	},
];

// const router = new VueRouter({
// 	scrollBehavior: (to, from, savedPosition) => {
// 		if (savedPosition) {
// 			return savedPosition;
// 		} else {
// 			return { x: 0, y: 0 };
// 		}
// 	},
// 	mode: "hash",
// 	base: process.env.BASE_URL,
// 	routes:
// 		process.env.VUE_APP_ENV == "production"
// 			? constantRoutes
// 			: [...constantRoutes, ...asyncRoutes],
// });

//todo 移动端访问权限

const testRouters =
	process.env.VUE_APP_ENV == "test"
		? [
				{
					path: "/:tenantId/test",
					component: () => import("@/views/test/test.vue"),
					meta: {
						// keepAlive: false,
						// requireLogin: false,
						// mobile: true,
					},
				},
		  ]
		: [];
const routers = [...constantRoutes, ...testRouters, ...asyncRoutes].filter((item: any) => {
	if (item.meta && bMobile) {
		return item.meta.mobile;
	}
	return true;
});

const router = new VueRouter({
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { x: 0, y: 0 };
		}
	},
	mode: "hash",
	base: process.env.BASE_URL,
	routes: routers,
});

export default router;
