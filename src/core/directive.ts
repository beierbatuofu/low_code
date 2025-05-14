import Vue from "vue";
import { UserModule } from "@/store/modules/user";
import { PermissionModule } from "@/store/modules/permission";

//v-route-auth="{code:'create'}"
Vue.directive("route-auth", {
	inserted: (el: any, binding, vnode: any) => {
		const { code, route } = binding.value;
		const routes = route || vnode.context.$route;
		if (process.env.VUE_APP_ENV == "production" && routes.meta && routes.meta.handleCode && routes.meta.handleCode.length > 0) {
			if (!routes.meta.handleCode.some((item: any) => new RegExp(code + "$").test(item.perms))) {
				el.parentNode.removeChild(el);
			}
		}
	},
});

Vue.directive("isAdmin", {
	inserted: (el: any, binding, vnode: any) => {
		const { isAdmin } = UserModule.appPerm;
		const group = binding.value || "";
		if (!isAdmin && (!group || UserModule.appPerm[group].length == 0)) {
			return el.parentNode.removeChild(el);
		}
	},
});

Vue.directive("notCanDevApps", {
	inserted: (el: any, binding, vnode: any) => {
		const canDevApps = UserModule.appPerm.canDevApps || [];
		const { isAdmin } = UserModule.appPerm;
		const code = binding.value;
		if (!isAdmin && !canDevApps.includes(code)) {
			//el.parentNode.removeChild(el);
		}
	},
});

Vue.directive("roleDev", {
	inserted: (el: any, binding, vnode: any) => {
		// if (PermissionModule.isCurPerm) {
		// 	el.parentNode.removeChild(el);
		// }
	},
});

Vue.directive("loadmore", {
	bind(el, binding) {
		const selectWrap: any = el.querySelector(".el-table__body-wrapper");
		let preScrollTop: any = null;
		selectWrap.addEventListener("scroll", function (e: any) {
			//水平滚动不进入
			// console.log(e.target.scrollTop, el.offsetTop);

			const sign = 10;

			if (e.target.scrollTop + sign > 28 + 95 * (Number(el.getAttribute("data-size")) - 3)) {
				return;
			}

			if (preScrollTop != e.target.scrollTop) {
				preScrollTop = e.target.scrollTop;
			} else {
				return;
			}

			//到底部距离
			const scrollDistance: any = selectWrap.scrollHeight - selectWrap.scrollTop - selectWrap.clientHeight;
			// console.log(selectWrap.scrollHeight, "整个的高度");
			// console.log(selectWrap.scrollTop, "到上面的高度");
			// console.log(selectWrap.clientHeight, "自己的 没有滚动条的高度");
			if (scrollDistance <= sign) {
				//触发加载函数
				binding.value();
			}
		});
	},
});

Vue.directive("dialogdrag", {
	bind(el, binding, vnode, oldVnode) {
		const value = binding.value;
		if (value == false) return;
		// 获取拖拽内容头部
		const dialogHeaderEl: any = el.querySelector(".el-dialog__header");
		const dragDom: any = el.querySelector(".el-dialog");
		(<any>dialogHeaderEl).style.cursor = "move";
		// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
		const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

		dragDom.style.position = "absolute";
		dragDom.style.top = `${dragDom.style.marginTop}`;
		dragDom.style.marginTop = 0;
		let width = dragDom.style.width;
		if (width.includes("%")) {
			width = +document.body.clientWidth * (+width.replace(/\%/g, "") / 100);
		} else {
			width = +width.replace(/\px/g, "");
		}
		dragDom.style.left = `${(document.body.clientWidth - width) / 2}px`;
		// 鼠标按下事件
		dialogHeaderEl.onmousedown = (e: any) => {
			// 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
			const disX = e.clientX - dialogHeaderEl.offsetLeft;
			const disY = e.clientY - dialogHeaderEl.offsetTop;

			// 获取到的值带px 正则匹配替换
			let styL: any, styT: any;

			// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
			if (sty.left.includes("%")) {
				styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);
				styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
			} else {
				styL = +sty.left.replace(/\px/g, "");
				styT = +sty.top.replace(/\px/g, "");
			}

			// 鼠标拖拽事件
			document.onmousemove = function (e) {
				// 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
				const l = e.clientX - disX;
				const t = e.clientY - disY;

				const finallyL = l + styL;
				const finallyT = t + styT;

				// // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
				// // dragDom.offsetParent表示弹窗阴影部分
				// if (finallyL < 0) {
				//   finallyL = 0
				// } else if (finallyL > dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft) {
				//   finallyL = dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft
				// }

				// if (finallyT < 0) {
				//   finallyT = 0
				// } else if (finallyT > dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft) (
				//   finallyT = dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft
				// )

				// 移动当前元素
				dragDom.style.left = `${finallyL}px`;
				dragDom.style.top = `${finallyT}px`;

				//将此时的位置传出去
				//binding.value({x:e.pageX,y:e.pageY})
			};

			document.onmouseup = function (e) {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	},
});
