<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
declare type TStatus= "wait" | "process" | "finish" | "error" | "success"
@Component({})
class RvueStep extends Vue{
    @Prop({ type: String }) title!: string;
    @Prop({ type: String }) description!: string;
    @Prop({ type: String }) icon!: string;
    @Prop({ type: String, default: false}) status!: TStatus;

    protected render(h:CreateElement){
        let SlotDefaults: any = this.$slots.default || [];
        let {title,description,icon,status}=this;
        let props={title,description,icon,status};
        return <el-step props={props}>
                  {SlotDefaults.map((item: TJson) => item)}   
               </el-step>;
    }
    public static install: (param: Vue) => any;
	public static compName = "rvue-step";
}
RvueStep.install = function (Vue: any) {
		Vue.component(RvueStep.compName, RvueStep);
	};
	export default RvueStep;
</script>