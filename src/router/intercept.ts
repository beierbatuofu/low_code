import router from "@/router";
import { Vue } from "vue-property-decorator";
import { isMobile } from "@/utils/global";
export default class Intercept extends Vue {
	public mobileIntercept() {
		//不能进入的路由
		const cantClickRouteArray = [
			"AppEdit",
			"AppIndex",
			"AppIndexSon",
			"TableDesign",
			"FormDesign",
			"FormFlow",
			"CorpLog",
		];
		router.beforeEach((to, from, next) => {
			if (!isMobile()) {
				next();
				return;
			}
			if (to.name && cantClickRouteArray.includes(to.name)) {
				this.$message({
					duration:2000,
					message: "暂不支持移动端",
					type: "warning",
				});
				console.log(from.fullPath);
				from.fullPath != "/dashboard" &&
					setTimeout(() => {
						next({ path: "/" });
					}, 2000);
				return;
			}
			next();
		});
	}
}
