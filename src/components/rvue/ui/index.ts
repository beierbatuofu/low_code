/*
 * @Author: ben
 * @LastEditTime: 2022-03-03 13:45:08
 * 注意：有冲突保留
 */

//PC端
import { MessageBox as RvueMessageBox, Message as RvueMessage, Loading as RvueLoading, Notification as RvueNotification } from "element-ui";
import RvueDatetime from "./components/pc/rvue-datetime/rvueDatetime.vue";
import RvueDateSelect from "./components/pc/rvue-dateSelect/rvueDateSelect.vue";
import RvueInput from "./components/pc/rvue-input/rvueInput.vue";
import RvueSelectGroup from "./components/pc/rvue-select/rvueSelectGroup.vue";
import RvueInputNumber from "./components/pc/rvue-input-number/rvueInputNumber.vue";
import RvueNumberRange from "./components/pc/rvue-input-number/rvueNumberRange.vue";
import RvueSelectMulti from "./components/pc/rvue-selectMulti/rvueSelectMulti.vue";
import RvueRadioBox from "./components/pc/rvue-radio/rvueRadioBox.vue";
import RvueRadio from "./components/pc/rvue-radio/rvueRadio.vue";
import RvueRadioGroup from "./components/pc/rvue-radio/rvueRadioGroup.vue";
import RvueChecks from "./components/pc/rvue-checkbox/rvueChecks.vue";
import RvueAvatar from "./components/pc/rvue-avatar/rvueAvatar.vue";
import RvueTimeline from "./components/pc/rvue-timeline/rvueTimeline.vue";
import RvueCard from "./components/pc/rvue-card/rvueCard.vue";
import RvueDrawer from "./components/pc/rvue-drawer/rvueDrawer.vue";
import RvueButton from "./components/pc/rvue-button/rvueButton.vue";
import RvueTabs from "./components/pc/rvue-tabs/rvueTabs.vue";
import RvueTabPane from "./components/pc/rvue-tabs/rvueTabPane.vue";
import RvueTable from "./components/pc/rvue-table/rvueTable.vue";
import RvueDialog from "./components/pc/rvue-dialog/rvueDialog.vue";

import RvueSwitch from "./components/pc/rvue-switch/rvueSwitch.vue";
import RvueCollapse from "./components/pc/rvue-collapse/rvueCollapse";
import RvueCollapseItem from "./components/pc/rvue-collapse/rvueCollapseItem";
import RvueSelect from "./components/pc/rvue-select/rvueSelect.vue";
import RvueOption from "./components/pc/rvue-select/rvueOption.vue";
import RvueOptionGroup from "./components/pc/rvue-select/rvueOptionGroup.vue";
import RvueEmpty from "./components/pc/rvue-empty/rvueEmpty.vue";
import RvueRow from "./components/pc/rvue-layout/rvueRow.vue";
import RvueCol from "./components/pc/rvue-layout/rvueCol.vue";
import RuveBadge from "./components/pc/rvue-badge/rvueBadge.vue";
import RvueLink from "./components/pc/rvue-link/rvueLink.vue";
import RvueProgress from "./components/pc/rvue-progress/rvueProgress.vue";
import RvueImage from "./components/pc/rvue-image/rvueImage.vue";
import RvueDivider from "./components/pc/rvue-divider/rvueDivider.vue";
import RvueCalendar from "./components/pc/rvue-calendar/rvueCalendar.vue";
import RvueBreadcrumb from "./components/pc/rvue-breadcrumb/rvueBreadcrumb.vue";
import RvueFormsItem from "./components/pc/rvue-forms/rvueFormsItem.vue";
import RvueForms from "./components/pc/rvue-forms/rvueForms.vue";
import RvueAlert from "./components/pc/rvue-alert/rvueAlert.vue";
import RvueTooltip from "./components/pc/rvue-tooltip/rvueTooltip.vue";
import RvuePopover from "./components/pc/rvue-popover/rvuePopover.vue";
import RvueCarousel from "./components/pc/rvue-carousel/rvueCarousel.vue";
import RvueBacktop from "./components/pc/rvue-backtop/rvueBacktop.vue";
import RvueRate from "./components/pc/rvue-rate/rvueRate.vue";
import RvuePopconfirm from "./components/pc/rvue-popconfirm/rvuePopconfirm.vue";
import RvueTree from "./components/pc/rvue-tree/rvueTree.vue";
import RvueUpload from "./components/pc/rvue-upload/rvueUpload.vue";
import RvueContainer from "./components/pc/rvue-container/rvueContainer.vue";
import RvueSteps from "./components/pc/rvue-steps/rvueSteps.vue";
import RvuePageHeader from "./components/pc/rvue-pageHeader/rvuePageHeader.vue";
import RvueSlider from "./components/pc/rvue-slider/rvueSlider.vue";
import RvueTransfer from "./components/pc/rvue-transfer/rvueTransfer.vue";
import RvuePagination from "./components/pc/rvue-pagination/rvuePagination.vue";
import RvueCheckbox from "./components/pc/rvue-checkbox/rvueCheckbox.vue";
import RvueCheckboxGroup from "./components/pc/rvue-checkbox/rvueCheckboxGroup.vue";
import RvueCascader from "./components/pc/rvue-cascader/rvueCascader.vue";
import RvueCascaderPanel from "./components/pc/rvue-cascader/rvueCascaderPanel.vue";
import RvueColorPicker from "./components/pc/rvue-color-picker/rvueColorPicker";
import RvueTag from "./components/pc/rvue-tag/rvueTag.vue";
import RvueDropDown from "./components/pc/rvue-dropdown/rvueDropdown.vue";
import RvueDropDownItem from "./components/pc/rvue-dropdown/rvueDropdownItem.vue";
import RvueDropDownMenu from "./components/pc/rvue-dropdown/rvueDropdownMenu.vue";
//手机端

import RvueMobliePagination from "./components/mobileComp/rvue-pagination/rvuePagination.vue";
import RvueMobileDatetime from "./components/mobileComp/rvue-datetime/rvueDatetime.vue";

import lang from "./lang/index";

//根据平台加载组件
const bMobile: boolean = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
const pcComps: { [key: string]: any } = {
	RvueTag,
	RvueRow,
	RvueCol,
	RvueDatetime,
	RvueDateSelect,
	RvueInput,
	RvueSelectGroup,
	RvueSelect,
	RvueInputNumber,
	RvueNumberRange,
	RvueSelectMulti,
	RvueRadioBox,
	RvueRadio,
	RvueRadioGroup,
	RvueChecks,
	RvueAvatar,
	RvueTimeline,
	RvueCard,
	RvueDrawer,
	RvueButton,
	RvueTabs,
	RvueTabPane,
	RvueTable,
	RvueDialog,
	RvueSwitch,
	RvueColorPicker,
	RvueEmpty,
	RvueCollapse,
	RvueCollapseItem,
	RvueOption,
	RvueOptionGroup,
	RuveBadge,
	RvueLink,
	RvueProgress,
	RvueImage,
	RvueDivider,
	RvueCalendar,
	RvueBreadcrumb,
	RvueFormsItem,
	RvueForms,
	RvueAlert,
	RvueTooltip,
	RvuePopover,
	RvueCarousel,
	RvueBacktop,
	RvueRate,
	RvuePopconfirm,
	RvueTree,
	RvueUpload,
	RvueContainer,
	RvueSteps,
	RvuePageHeader,
	RvueSlider,
	RvueTransfer,
	RvuePagination,
	RvueCheckbox,
	RvueCheckboxGroup,
	RvueCascader,
	RvueCascaderPanel,
	RvueDropDown,
	RvueDropDownItem,
	RvueDropDownMenu,
};
let mobileComps: any = {
	RvueMobliePagination,
	RvueMobileDatetime,
};
let components: any = !bMobile ? pcComps : Object.assign(pcComps, mobileComps);

//安装组件
const install = function (Vue: any, opts: any = {}) {
	lang.use(opts.lang);
	Vue.prototype.$Ralert = RvueMessageBox.alert;
	Vue.prototype.$Rconfirm = RvueMessageBox.confirm;
	Vue.prototype.$Rprompt = RvueMessageBox.prompt;
	Vue.prototype.$Rmessage = RvueMessage;
	Vue.prototype.$Rloading = RvueLoading.service;
	Vue.prototype.$Rnotify = RvueNotification;
	Object.keys(components).forEach((key: string) => {
		let comp: any = components[key];
		// console.log(comp.compName)
		Vue.component(comp.compName, comp);
	});
};

//导出组件
export default {
	version: "0.0.1",
	install,
	lang: lang.use,
	RvueMessage,
	RvueMessageBox,
	RvueLoading,
	RvueNotification,
	...components,
};
