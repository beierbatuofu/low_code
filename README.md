## FED 规范 
``` 
1.变量函数命名参考 https://github.com/gscheartA/Improve-your-code/blob/master/%E5%91%BD%E5%90%8D%E6%8C%87%E5%8D%97%E5%A4%A7%E5%85%A8/%E7%BB%99%E5%87%BD%E6%95%B0%E8%B5%B7%E4%B8%AA%E5%A5%BD%E5%90%8D%E5%AD%97%E2%80%94%E5%8A%A8%E8%AF%8D%E9%80%89%E6%8B%A9.md
2.javascript class 类命名首字母必须大写并且遵守驼峰命名法 。
3.ts 全局类型命名以大写T开头并且遵守驼峰命名法 。
4.scss 和文件名统一 中间以中划线(-)分隔
5.文件夹命名以单词以中划线分隔(-),功能模块目录结构
    components 公用组件
    style 样式
    core 和vue 关联的逻辑代码
    utils 工具类
    模块文件夹中可沿用该命名结构，但是命名以下划线开头_表示该文件夹中私自
6.

```
## File Structure
```
 - src
   — api         api sevice
   - components  全局公共组件
   - core        vue 工具代码 
   - lang        多语言包
   - router      路由
   - store       vuex
   - style       全局样式
   - types       typescript 全局声明
   - utils       全局公共方法
   - views       所有页面
```   

## ui组件 yes 可用 no不可用
```
    rvue-alert yes
    rvue-avatar yes
    rvue-backtop yes
    rvue-badge  yes
    rvue-breadcrumb no
    rvue-button yes
    rvue-calendar yes
    rvue-card yes
    rvue-carousel no
    rvue-cascader yes
    rvue-cascader-panel yes
    rvue-checkbox yes
    rvue-checkbox-group yes
    rvue-collapse yes
    rvue-collapse-item yes
    rvue-color-picker yes
    rvue-container no
    rvue-header no
    rvue-main no
    rvue-footer no
    rvue-aside no
    rvue-date-select yes
    rvue-datetime yes
    rvue-dialog yes
    rvue-divider yes
    rvue-drawer yes
    rvue-dropdown yes
    rvue-dropdown-menu yes
    rvue-dropdown-item yes
    rvue-empty yes
    rvue-form no
    rvue-image yes
    rvue-input yes
    rvue-input-number yes
    rvue-row yes
    rvue-col yes
    rvue-link yes
    rvue-menu no
    rvue-page-header yes
    rvue-pagination no
    rvue-popconfirm no
    rvue-popover no
    rvue-progress yes
    rvue-radio yes
    rvue-radio group yes
    rvue-rate no
    rvue-select yes
    rvue-option yes
    rvue-slider no
    rvue-steps no
    rvue-step no
    rvue-switch yes
    rvue-tabs yes
    rvue-tab-pane yes
    rvue-tag yes
    rvue-timeline yes
    rvue-tooltip yes
    rvue-transfer no
    rvue-tree yes
    rvue-upload no
```