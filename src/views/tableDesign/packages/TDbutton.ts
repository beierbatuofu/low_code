import { Component, Vue, Watch, Prop , PropSync , Emit} from "vue-property-decorator";
 
@Component
export default class TDbutton extends Vue {
    @Emit('update')
    private handleUpdate(data:TJson){
        return data;
    }
}