export default {
	snrule: {
		createTime: "提交日期",
		count: "自动计数",
		fixedChars: "固定字符",
		field: "表单字段",
	},
	sql: {
		run: "运行预览",
		save: "保存",
		cancel: "取消",
		sqlSaveSuccess: "保存成功",
		sqlRunSuccess: "运行成功",
		return: "返回",
		pleaseRunSql: "请先点击运行预览",
		checked: "不能包含关键字{0}",
		undefined: "undefined",
		deleted: "已被删除",
	},
	formPrompt: {
		submit: "已提交",
		edit: "编辑成功",
		ts: "已暂存",
		pass: "已通过",
		del: "已删除",
		endTitle: "您确认要结束流程吗？",
		backTitle: "你确认要退回流程吗？",
		isSaveFormDesign: "是否保存当前表单设计",
	},
	linkDataDialog: {
		title1: "选择目标表单",
		pleaseApp: "请选择应用",
		pleaseForm: "请选择表单",
		title2: "联动条件",
		filteTtitle2: "筛选条件",
		or: "或",
		orCondition: "或条件",
		andCondition: "且条件",
		targetField: "目标表单字段",
		judge: "判断符",
		pleaseEnter: "请输入",
		currentField: "当前表单字段",
		title3: "联动赋值",
		title4: "设置子字段赋值",
		clickSettings: "点击设置",
		assignTo: "赋值给",
		confirm: "确定",
		cancel: "取消",
		relationError: "请选择至少一条当前表单字段",
		judgeValuesError: "请将过滤条件填写完整",
		targetFieldError: "请选择联动赋值内容",
		save: "保存",
		copy: "复制",
		paste: "粘贴",
		will: "将",
	},
	errorLogin: {
		failed: "系统错误，请联系管理员",
		loginFailed: "登录失败，请重新登录",
		permissionFailed: "权限不足，请联系管理员",
		exists: "当前租户不存在，请访问其他租户",
		empty: "表单为空,重新编辑",
	},
	errorRelation: {
		faile: "表单数据联动失败",
		failed: "数据联动失败: 目标字段不存在或者已删除",
		form: "数据联动失败:目标表单不存在或者已删除",
	},
	errorSql: {
		failed: "sql文运行错误,请检查",
	},
	errorForm: {
		failed: "系统错误，请联系管理员",
		exist: "表单未发布，请联系管理员",
		verification: "字段配置有误，请检查配置",
		addFailed: "文件夹创建失败，请重新创建",
		hasFailed: "文件夹下存在有效表单,不允许删除",
		delFailed: "删除文件夹",
		updateFailed: "请重新选择文件夹",
		notExists: "当前文件夹不存在，请刷新",
		notForm: "表单不存在，请联系管理员",
		empty: "表单结构为空，请确认操作！",
		pDeleteError: "当前仪表盘下存在报表，不能删除",
		dataSourceNotFound: "数据源不存在",
		delDesignFail: "应用设计者不能删除自己",
	},
	errorCm: {
		failed: "系统错误，请联系管理员",
		maintenance: "系统维护中，请联系管理员",
		addFailed: "新增数据失败",
		updateFailed: "修改数据失败",
		dataFailed: "批量新增数据过多，请重新操作",
	},
	errorDt: {
		failed: "系统错误，请联系管理员",
	},
	errorApp: {
		updateFailed: "应用没有需要更新内容",
		del1Failed: "分组下存在有效应用",
		del2Failed: "应用下存在有效表单或仪表盘",
		collectionFailed: "请不要重复收藏",
		releaseFailed: "应用内有未发布的表单，请发布",
		designerFailed: "应用设计者不能为空",
		roleFailed: "更新角色信息参数错",
	},
	errorFlow: {
		releaseAutoFailed: "{自动化节点}配置有误，无法发布",
		failed: "系统错误，请联系管理员",
		delFormFailed: "表单数据已被删除，请检查",
		configFailed: "流程设计配置有误，请检查",
		verificationFailed: "该表单不是流程表单，请检查",
		noRepet: "新增表单不允许出现相同值",
		noTask: "该流程已被处理",
		insufficient: "权限不足",
		isEnd: "该流程已结束",
		noDeleteSelf: "应用设计者不能删除自己",
		noExist: "应用设计者不能为空",
		updateError: "更新角色信息参数错误",
		flowFailed: "不符合流转条件，请联系管理员",
		deleteFailed: "流程中的数据已删除，流程失效",
	},
	errorCalendar: {
		fieldUndef: "字段不存在或已修改，请重新配置",
	},
	formula: {
		datetime: "日期时间",
		input: "文本",
		number: "数字",
		dept: "数组",
		deptRadio: "部门",
		user: "成员",
		userRadio: "成员",
		textarea: "文本",
		radio: "文本",
		selectMulti: "数组",
		checkbox: "数组",
		select: "文本",
		editFormula: "编辑公式",
		Currentfield: "当前字段",
		functions: "常用函数",
		sn: "文本",
		address: "地址",
	},
	widgetConfig: {
		snRuleTip: "规则",
		attrWidthTip: "配置表单布局，可以单行多字段排布",
		attrRequired: "选择必填后，填写者不填写将无法提交表单",
		attrFieldTip: "提示属性用于指定对该模块进行一些附加说明，一般用来指导填写者输入。",
		attrScanMode: "支持二维码/条形码，仅支持移动端使用",
		attrDefaultValue: "设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交。",
		attrTypeTip: "类型用于告诉填写者该字段是什么类型的字段",
		attrTitleTip: "标题用于告诉填写者应该在该字段中输入什么样的内容。通常是一个词语或词组，也可以是一个问题。",
		attrLineStyleTip: "配置分割线样式。",

		attrFieldVerification: "字段校验",
		attrTimeFormatTip: "日期时间格式用于该日期时间字段的显示方式，支持年、年-月、年-月-日、年-月-日 时:分、年-月-日 时:分:秒	",
		attrTextRange: "限制字数范围",
		attrNumRange: "限制数值范围",
		attrNumRangeTip: "限制数值范围用于限制用户在提交表单界面所输入的数值大小。	",
		attrNumFormat: "数字格式用于该数字字段的显示方式，支持显示保留小数、百分比、以及千分符。	",
		attrTextRangeTip: "限制字数范围用于限制用户在提交表单界面所输入的字符数。	",
		attrVerification: "校验",
		attrVerificationTip: "字段校验用于对提交人在该字段所输入内容进行一定程度的校验。	",
		attrScanCodeTip: "该功能仅支持移动端，支持条形码和二维码",
		attrValid: "字段权限用于该字段在提交表单界面可见性以及可编辑性的权限设置。	",
	},
	test: "测试{0}",
	formDesign: {
		tabTitle: "标签标题",
		user: "请选择人员",
		formula: "关联公式",
		setFilterCriteria: "设置筛选条件",
		custom: "自定义",
		relation: "关联已有数据",
		now: "当前时间",
		addDic: "添加选项",
		dicDesc: "选项内容",
		eq: "等于",
		ne: "不等于",
		gt: "大于",
		ge: "大于等于",
		lt: "小于",
		le: "小于等于",
		empty: "为空",
		not_empty: "不为空",
		contain: "包含",
		not_contain: "不包含",
		between: "范围查询",
		contain_one: "包含任意一个",
		contain_all: "同时包含",
		eq_all: "全等",
		dynamic: "动态赋值",
		CurrentFormField: "当前表单字段",
		setFormula: "设置公式",
		otherFormData: "关联其他表单数据",
		eq_ymd: "年月日相等",
		eq_ym: "年月相等",
		eq_year: "年相等",
	},
	Rfield: {
		address: "地址",
		tab: "标签",
		dept: "部门多选",
		user: "成员多选",
		separator: "分割线",
		input: "单行文本",
		textarea: "多行文本",
		deptRadio: "部门单选",
		number: "数字",
		radio: "单选按钮组",
		checkbox: "复选按钮组",
		datetime: "日期时间",
		select: "下拉单选框",
		uploadFile: "附件",
		tableField: "表格",
		selectMulti: "下拉复选框",
		userRadio: "成员单选",
		setFormula: "设置公式",
		formula: "关联公式",
		table: "表格",
		creater: "提交人",
		create_time: "提交时间",
		process_status: "流程状态",
		update_time: "更新时间",
		text: "文本",
		option: "选项",
		pane: "标签",
		sn: "流水号",
	},
	widgetConf: {
		line: "~",
		noLimit: "不限",
		numFormat: {
			format: "格式",
			number: "数值",
			percent: "百分比",
			allowDecimalDigits: "允许小数位数",
		},
		numRange: {
			limitNumRange: "限制数值范围",
		},
		textRange: {
			limitTextRange: "限制字数",
		},
		scanQrCode: {
			scan: "扫码录入",
			allowScan: "允许扫码输入",
			comment: "该功能仅对钉钉移动端有效",
			editable: "可修改扫码结果",
			scanQrCode: "扫描二维码",
			scanBarcode: "扫描条形码",
		},
	},
	rules: {
		textLenMin: "内容长度不能少于{0}",
		textLenMax: "内容长度不能大于{0}",
		numRange: "数字必须在{0}~{1}之间",
		numRangeMax: "数字必须大于{0}",
		numRangeMin: "数字必须小于{0}",
		requiredFields: "此项为必填项",
		isNumeric: "此项为必须填写数字",
		isFormEmpty: "至少填写一项",
	},
	tableDesign: {
		chooseTime: "选择时间",
		TransferredNode: "转移的节点",
		nodeInProcess: "处理中的节点",
		nodeUntreated: "未处理节点",
		NO: "编号",
		addQueryCriteria: "添加查询条件",
		handleButton: "添加操作按钮",
		queryCriteria: "查询条件",
		style: "查询样式",
		default: "默认",
		range: "范围",
		dynamic: "动态值",
		today: "今天",
		yesterday: "昨天",
		theWeek: "本周",
		lastWeek: "上周",
		theMonth: "本月",
		lastMonth: "上月",
		theYear: "今年",
		lastYear: "去年",
		last7day: "最近7天",
		last30day: "最近30天",
		last90day: "最近90天",
		defaultValue: "默认值",
		matchingRules: "匹配规则",
		readOnly: "只读",
		startTime: "开始时间",
		endTime: "结束时间",
		add: "新增",
		import: "导入",
		export: "导出",
		batch: "批量操作",
		delete: "删除",
		recover: "数据回收站",
		status: "流程状态",
		status_1: "进行中",
		status_8: "强制结束",
		status_9: "流转完成",
		submitDate: "提交时间",
		replaceDate: "更新时间",
		process_status: "流程状态",
		create_time: "提交时间",
		update_time: "更新时间",
		currentNode: "当前节点",
		tableSet: "表格设置",
		currentuser: "当前负责人",
		propuser: "提交人",
		updater: "当前负责人",
		creater: "提交人",
		currentUsers: "当前用户",
		journal: "流程日志",
		flowChart: "流程图",
	},
	chartDesign: {
		dimension: "维度",
		indicator: "指标",
		dataSetting: "数据设置",
		chartSetting: "图表设置",
		plzDataSource: "请选择数据源",
		filter: "筛选条件",
		addFilter: "点击添加筛选条件",
		dataShow: "数据显示",
		limit: "显示前几条",
		dataLabel: "数据标签",
		showLegend: "显示图例",
		legendLocation: "图例位置",
		bottom: "底部",
		top: "顶部",
		left: "左侧",
		right: "右侧",
		YaxisSetting: "y轴设置",
		isShow: "是否显示",
		YName: "纵坐标名称",
		max: "最大值",
		plzYName: "请输入纵坐标名称",
		min: "最小值",
		plzYMin: "请输入y轴最小值",
		plzYMax: "请输入y轴最大值",
		xSetting: "x轴设置",
		xName: "横坐标名称",
		plzxName: "请输入横坐标名称",
		grid: "图表边框",
		xtile: "x轴倾斜",
		transverse: "横向",
		portrait: "纵向",
		leftTilt: "左倾斜",
		rightTilt: "右倾斜",
		guide: "辅助线",
		addGuide: "添加辅助线",
		plzac: "请选择图表",
		cc: "点击配置",
		ft: "字段类型",
		ff: "筛选字段",
		ds: "数据源",
		form: "表单",
		dv: "默认值",
		save: "保存",
		selectSll: "全选",
		confirm: "确定",
		cancel: "取消",
		dataset: "数据集",
		nonField: "无可选字段，请调整筛选字段或图表数据源",
		methodOne: "单项统计",
		methodMut: "复项统计",
		COUNT_CONTAIN_NULL: "计数包含空值",
		COUNT: "计数",
		sort: "排序",
		default: "默认",
		asc: "升序",
		desc: "降序",
		method: "汇总方式",
		DimensionSetting: "维度设置",
		IndicatorSetting: "指标设置",
		SUM: "求和",
		AVG: "平均数",
		MAX: "最大值",
		MIN: "最小值",
	},
	table: {
		create_time: "创建时间",
		creater: "创建人",
		id: "编号",
		noMoreThen200: "不能超过30行",
	},
	global: {
		address: "地址",
		snRule: "规则",
		fieldId: "组件id",
		printQrCode: "打印二维码",
		uploading: "附件上传中",
		cancelUpload: "取消上传",
		tab: "标签",
		role: "角色",
		roleGroup: "角色组",
		userRadio: "成员单选",
		deptRadio: "部门单选",
		addNewFlow: "新建流程",
		isSaveFormDesign: "是否保存当前表单设计",
		isSaveTablemDesign: "是否保存当前列表设计",
		isSaveChartDesign: "是否保存当前报表设计",
		isSavePDesign: "是否保存当前仪表盘设计",
		favorite: "我的收藏",
		other: "其他",
		chooseDepartmentUser: "选择部门成员",
		errorPage: "抱歉，您没有该页面的访问权限",
		notVisitApp: "您无当前应用的访问权限！",
		netWorkError: "网络错误，请重试",
		pass: "通过",
		choseFile: "上传文件",
		currentuser: "当前用户",
		chooseDepartment: "选择部门",
		chooseUser: "选择成员",
		recover: "批量操作",
		batch: "批量处理",
		export: "导出",
		import: "导入",
		reset: "重置",
		search: "查询",
		empty: "暂无数据",
		expand: "展开",
		collapse: "收起",
		requestError: "请求出错{0}",
		submitted: "提交{0}",
		maxUploadSize: "图片大小不能超过",
		isEdit: "可编辑",
		placeholder: "请输入内容",
		noSameVal: "不允许重复值",
		errNoSameVal: "该字段不允许重复值",
		barcode: "条形码",
		qrcode: "二维码",
		scanMode: "扫码方式",
		textReminder: "文字提示",
		textDescription: "描述文字",
		relation: "关联已有数据",
		fieldProportion: "字段占比",
		isVisable: "可见",
		tableField: "布局",
		isRequired: "必填",
		isMultiple: "仅允许上传单个文件",
		noData: "暂无数据",
		custom: "自定义",
		big: "大",
		standard: "标准",
		small: "小",
		plzAdd: "无字段",
		dataAssociation: "关联数据",
		associateExistingData: "关联已有数据",
		defaultValue: "默认值",
		matchingRules: "匹配规则",
		checkbox: "多选框组",
		byFormulaCalculation: "通过公式计算",
		type: "类型",
		zh: "中文",
		en: "英文",
		HtmlTitle: "聆风",
		save: "保存",
		notSave: "不保存",
		disability: "禁用",
		deletion: "删除",
		flow: "流程",
		start: "开始节点",
		startManage: "开始处理",
		tiemConsuming: "处理耗时",
		end: "强制结束",
		flowEnd: "结束节点",
		refuse: "拒绝",
		TS: "暂存",
		back: "退回",
		copy: "复制",
		success: "成功",
		language: "中文",
		pleaseChoose: "请选择",
		pleaseInput: "请输入",
		equal: "等于",
		add: "新增",
		update: "更新",
		edit: "编辑",
		cancel: "取消",
		confirm: "确定",
		either: "任一",
		all: "所有",
		predicate: "判断符",
		visible: "可见",
		selectAll: "全选",
		apply: "启用流程",
		title: "标题",
		dept: "部门多选",
		member: "成员",
		customField: "自定义",
		inputField: "输入",
		input: "单行文本",
		text: "文本",
		textarea: "多行文本",
		number: "数字",
		selectField: "选择",
		radio: "单选框组",
		array: "数组",
		select: "下拉单选",
		selectMulti: "下拉复选",
		date: "日期",
		datetimeField: "日期时间",
		timestamp: "时间戳",
		uploadFiled: "上传附件",
		uploadFile: "附件",
		viewErr: "抱歉~目前暂时只支持图片格式的预览",
		datetime: "日期时间",
		separator: "分割线",
		otherFields: "其他",
		preview: "预览",
		clear: "清空",
		emptyField: "拖拽字段进行配置",
		isReadonly: "是否只读",
		user: "成员多选",
		dateFormat: "日期格式",
		dateFormatY: "年",
		dateFormatYm: "年-月",
		dateFormatYmd: "年-月-日",
		dateFormatYmdhm: "年-月-日 时:分",
		dateFormatYmdhms: "年-月-日 时:分:秒",
		layoutTitle: "排列方式",
		layoutHorizontal: "横向排列",
		layoutVertical: "纵向排列",
		lineStyle: "样式",
		setting: "设置",
		showTitle: "显示标题",
		rename: "重命名",
		table: "表格",
		clickToChangeIcon: "点击更换图标",
		return: "返回",
		delete: "删除",
		deleteAll: "全部删除",
		imports: "导入",
		sn: "流水号",
		placeholderAddress: "请输入详细地址",
	},
	bi: {
		send_DT_WORK: "推送工作通知",
		send_DT_GROUP: "推送群通知",
		timedpush: "定时推送",
		ddNoticeSetting: "钉钉通知设置",
		pushTitle: "推送标题",
		markdown: "消息内容",
		link: "图片链接",
		noticeType: "通知方式",
		workNotice: "工作通知",
		groupNotice: "群通知",
		userNotice: "成员通知",
		deptNotice: "部门通知",
		singleTitle: "按钮文字",
		openNotice: "开启通知",
		msgType: "消息类型",
		comfirm: "确定",
		cancel: "取消",
		remind: "定时策略",
	},
	crud: {
		summary: {
			count: "计数:",
			avg: "平均:",
			sum: "合计:",
		},
		filter: {
			addBtn: "新增条件",
			clearBtn: "清空数据",
			resetBtn: "清空条件",
			cancelBtn: "取 消",
			submitBtn: "确 定",
		},
		tipStartTitle: "当前表格已选择",
		tipEndTitle: "项",
		editTitle: "编 辑",
		copyTitle: "复 制",
		addTitle: "新 增",
		viewTitle: "查 看",
		filterTitle: "过滤条件",
		showTitle: "列显隐",
		menu: "操作",
		addBtn: "新 增",
		show: "显 示",
		hide: "隐 藏",
		showBtn: "显 隐",
		filterBtn: "过 滤",
		refreshBtn: "刷 新",
		printBtn: "打 印",
		excelBtn: "导 出",
		updateBtn: "修 改",
		cancelBtn: "取 消",
		searchBtn: "搜 索",
		emptyBtn: "清 空",
		menuBtn: "功 能",
		saveBtn: "保 存",
		viewBtn: "查 看",
		editBtn: "编 辑",
		copyBtn: "复 制",
		delBtn: "删 除",
	},
	newflow: {
		approvalNode: "审批节点",
		appBranch: "添加子分支",
		copyNode: "粘贴",
		datafilter: "数据筛选",
		submit: "提交",
		pass: "通过",
		over: "强制结束",
		back: "回退",
		end: "结束",
		flowSetting: "流程设置",
		ddNotify: "钉钉通知",
		openCarbonCopy: "启用抄送",
	},
	flow: {
		unused: "未启用",
		history: "历史",
		oldApplication: "启用过",
		notCopyLine: "连线无法复制",
		notDelNode: "开始或结束节点无法删除",
		saveNodeError: "无法保存,请选择节点({0})的{1}",
		saveLineError: "无法保存,{0}没有连接流程",
		saveFlowError: "无法保存,流程无法走通",
		tip: "拖动添加节点，然后连接节点设置流程关系",
		version: "流程版本",
		application: "启用成功",
		versionManage: "管理流程版本",
		configError: "配置",
		leaderError: "负责人",
		permError: "字段权限",
		autoNode: "自动化节点",
		flowNode: "流程节点",
		headerText: "流程已经启用，如需增删节点和连线，请选择未在启用中的版本或添加新版本",
		notCopyNode: "开始或者结束节点无法复制，请重新选择节点",
		headerMsg1: "流程发起节点不能被",
		headerMsg2: "流程发起节点不能被",
		nodeName: "节点名称",
		setEventAction: "设置事件动作",
		targetApplication: "目标应用",
		updateRules: "更新规则",
		filterData: "筛选数据",
		createRules: "创建规则",
		addRules: "添加规则",
		UpdateConfiguration: "更新配置",
		autoNodeText1: "如果您对自动化节点进行过修改，注意及时更新配置以免造成属性丢失",
		autoNodeMsg1: "筛选数据不能为空",
		autoNodeMsg2: "规则不能为空",
		autoNodeMsg3: "请选择目标应用",
		autoNodeMsg4: "配置更新成功",
		addNewVersion: "添加新版本",
		processReminder: "流程提醒",
		meetsThe: "符合以下",
		dataOfCirculationConditions: "流转条件的数据",
		addCirculationConditions: "添加流转条件",
		dataFlowConditions: "数据流转条件",
		matchDialogText1: "只有满足筛选条件的数据才会被更新",
		orCondition: "或",
		andTheCondition: "且条件",
		targetApplicationField: "目标应用字段",
		nodePropText1: "没有下级节点的节点会自动连接至流程结束；如果您需要在中途结束流程，请将需要结束流程的节点，连接到流程结束，并设置相应的流转条件。",
		setPrincipal: "点击设置负责人",
		setCarbonCopy: "点击设置抄送人",
		fieldPermissions: "字段权限",
		btnsPermissions: "审批按钮",
		basicAttributes: "基础属性",
		ruleDialogPlaceholder1: "请选择目标应用字段",
		start: "首页",
		end: "末页",
		currentNode: "当前流程节点",
		startUser: "提交人",
		now: "当前",
		processCenter: "流程中心",
		mytodolist: "我的待办",
		mylaunch: "我发起的",
		myhandle: "我处理的",
		myDraft: "我的草稿",
		carbonCopy: "抄送我的",
		draft: "草稿",
		launchnewflow: "我的草稿",
		launchneing: "草稿",
		currentTodo: "我的待办",
		startFlow: "发起流程",
		approvalComments: "审批意见",
		submit: "提交",
		doing: "进行中",
		finish: "结束",
		stopFlow: "强制结束",
		flowSuccess: "流转完成",
		flowFail: "请配置",
		flowFinish: "流转完成",
	},
	Mheader: {
		formDesign: "表单设计",
		processDesign: "流程设定",
		dataManagement: "数据管理",
		editForm: "编辑表单",
		editDashboard: "编辑仪表盘",
	},
	dashboard: {
		myCollection: "我的收藏",
		createGroup: "创建分组",
		groupName: "分组名称",
		groupSort: "分组排序",
		groupRange: "分组可见范围",
		allVisible: "所有人可见",
		someVisible: "指定范围可见",
		plz: "请选择",
		createApp: "创建应用",
		appName: "应用名称",
		chooseGroup: "选择分组",
		edit: "修改",
		color: "颜色",
		plzColor: "请选择颜色",
		icon: "图标",
		plzIcon: "请选择图标",
		create: "创建",
	},
	setting: {
		createManger: "添加管理员",
		addGroup: "添加开发组",
		platformAdministrator: "平台管理员",
		applicationDevelopmentGroup: "应用开发组",
		base: "基本信息",
		authorityManagement: "权限管理",
		addressBookManagement: "通讯录管理",
		enterpriseLog: "企业日志",
		platformAdministratorLimit: "平台管理员上限",
		applicationDevelopmentGroupLimit: "应用开发组上限",
		addAssGroup: "新增权限组",
		assName: "权限组名称",
		admin: "管理员",
		appAss: "应用权限",
		createAss: "创建权限",
		deleteAss: "删除权限",
		plzAss: "请填写权限组名称",
		plzAppAss: "请添加应用权限",
		plzName: "请输入名称",
		addSuccess: "添加成功!",
		deleteSuccess: "删除成功!",
		confirmDelete: "确定删除?",
		deleteAppGroup: "删除应用开发组",
		deleteTip: "该开发组已在应用内生效，您确定删除当前开发组么？如果确认删除，请键入当前应用开发组名称。",
		cancelInput: "取消输入",
	},
	appedit: {
		create: "创建",
		createDir: "创建文件夹",
		createChart: "创建仪表盘",
		createForm: "创建表单",
		appSet: "应用设置",
		dirName: "文件夹名称",
		formType: "表单类型",
		processSheet: "流程表单",
		generalForm: "普通表单",
		editForm: "应用图标",
		formIcon: "表单图标",
		formName: "表单名称",
		dashboardName: "仪表盘名称",
		formSet: "表单设置",
		folderSet: "文件夹设置",
		dashboardSet: "仪表盘设置",
		icon: "图标",
		appPub: "应用版本发布",
		type: "类型",
		changeContent: "变更内容",
		time: "创建时间",
		updateTime: "更新时间",
	},
	appset: {
		createFulldate: "创建日历图",
		createDashboard: "创建仪表盘",
		fulldataIcon: "日历图图标",
		fulldataName: "日历图名称",
		applicationAdministrator: "应用管理员",
		applyAccess: "应用访问权限",
		userGroup: "用户组",
		addUserGroup: "新建用户组",
		addRoleGroup: "新建角色组",
		appName: "应用名称",
		appDesc: "应用描述",
		effectiveSettings: "生效设置",
		immediately: "保存表单立即生效",
		releasedEffect: "需发布应用生效",
		deleteApp: "删除App",
		permissionSetting: "权限设置",
		addApplicationAdministrator: "添加应用管理员",
		dataManagementAuthority: "数据管理权限",
		userGroupName: "用户组名称",
		userGroupMembers: "用户组成员",
		ApplicationDesigner: "应用设计者", //LK8.4
		addApplicationDesigner: "添加应用设计者", //LK8.4
		dataSet: "数据集", //LK8.5
		dataSetName: "数据集名称",
		dataPreview: "数据预览",
		basalSet: "基础设置",
		setStatus: "配置状态",
		setSuccess: "配置成功",
		setError: "配置失败",
		propSetting: "属性设置",
		originType: "原始类型",
		fieldType: "字段类型",
		originName: "原始名称",
		fieldName: "字段名称",
	},
	departmantBody: {
		organizationalStructure: "组织架构",
		none: "没有可选成员",
	},
	process: {
		personInCharge: "负责人",
		dynamic: "动态负责人",
	},
	RC: {
		bar: "柱形图",
		line: "折线图",
		pie: "饼图",
		table: "表格",
		quota: "指标图",
		editor: "富文本",
		costum: "自定义图表",
		filter: "筛选器",
		barC: "未命名柱形图",
		lineC: "未命名折线图",
		pieC: "未命名饼图",
		tableC: "未命名表格",
		quotaC: "未命名指标图",
		editorC: "未命名富文本",

		costumC: "未命名自定义图表",
		filterC: "未命名筛选器",
	},
	"Mheader.workbench": "工作台",
	"Mheader.entermanage": "平台设置",
	"Mheader.quit": "退出",
	"Mheader.goappmanage": "进入应用管理",
	"Mheader.goappview": "进入应用访问",
	"Mheader.appversionrelease": "应用版本发布",
	"Mheader.appversionreleasetip": "有新的内容可以发布",
	"Mheader.formdesign": "表单设计",
	"Mheader.flowset": "流程设定",
	"Mheader.tableDesign": "列表设计",
	"Dashboard.mytodolist": "我的待办",
	"Dashboard.mylaunch": "我发起的",
	"Dashboard.myhandle": "我处理的",
	"Dashboard.launchnewflow": "我的草稿",
	"Dashboard.totalapps": "全部应用",
	"Dashboard.newgroup": "创建分组",
	"Dashboard.modifygroupname": "分组设置",
	"Dashboard.deletegroup": "删除分组",
	"Dashboard.newapp": "创建应用",
	"Dashboard.modifyapp": "管理应用",
	"Dashboard.deleteapp": "删除应用",
	"Dashboard.modifyicon": "修改图标",
	"Dashboard.modifyname": "修改名称",

	"appformlist.modifyname": "修改名称",
	"appformlist.delete": "删除",
	"appformlist.newform": "新建表单",
	"appformlist.newformtip": "表单可用来搜集数据，并带有数据协作功能，适合进行数据上报",
	"appformlist.newflowform": "新建流程表单",
	"appformlist.newflowformtip": "流程表单适合报销、请假申请或其他工作流",
	"appformlist.created": "被创建",
	"appformlist.modified": "有修改",
	"appformlist.deleted": "已删除",

	"appindex.directsubdata": "直接提交数据",
	"appindex.managetotaldata": "管理全部数据",
	"appindex.temporarystorage": "暂存",
	"form.formpublish.towardsmembers": "对成员发布",
	"form.formpublish.towardsmemberstip": "将成员加入权限组，授权他们填写或管理数据",
	"form.formpublish.newauthgroup": "新建权限组",
	"form.formpublish.edit": "编辑",
	"form.formpublish.clickselectuser": "点击选择成员",
	"form.formpublish.towardspublic": "公开发布",
	"form.formpublish.towardspublictip": "通过公开链接，无需登录即可访问表单和数据",
	"form.formpublish.copy": "复制",
	"form.formpublish.gostraight": "直接打开",
	"form.formpublish.nameinfo": "名称信息",
	"form.formpublish.nameinfotip": "可设置权限组名称和描述信息",
	"form.formpublish.opreateauth": "操作权限",
	"form.formpublish.opreateauthtip": "可对数据进行哪些操作",
	"form.formpublish.fieldauth": "字段权限",
	"form.formpublish.fieldauthtip": "可以查看和编辑数据的哪些字段",
	"form.formpublish.field": "字段",
	"form.formpublish.visible": "可见",
	"form.formpublish.editable": "可编辑",
	"form.formpublish.Displayquery": "显示查询条件",
	"form.formpublish.Hidequery": "隐藏查询条件",

	"appset.modifyfoldername": "修改文件夹名称",
	"appset.deletefolder": "删除文件夹",
	"appset.modifyform": "基础设置",

	"platformset.basicinfo": "基本信息",
	"platformset.authoritymanage": "权限管理",
	"platformset.platformanager": "平台管理员",
	"platformset.appdevelopteam": "应用开发组",
	"platformset.addressbook": "通讯录管理",
	"platformset.enterpriselog": "企业日志",
	"platformset.createmanager": "添加管理员",
	"platformset.createdevelopteam": "添加开发组",
	"platformset.groupcreateauthority": "应用创建权限",
	"platformset.appdeleteauthority": "应用删除权限",
	"platformset.devgroupname": "开发组名称",
	"platformset.appdeveloper": "应用开发者",
	"platformset.appauthority": "应用权限",
	"platformset.editappdevgroup": "编辑应用开发组",
	"platformset.newappdevgroup": "新增应用开发组",
};
