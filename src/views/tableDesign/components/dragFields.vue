<template>
  <div>
    <div class="drag-item">
      <span style="margin-left:19px;">{{$t('global.selectAll')}}</span>
      <!-- 全选按钮 -->
      <el-checkbox class="checkbox" v-model="checkAll" @change="handleCheckAllChange"><span /></el-checkbox>
    </div>
    <el-checkbox-group v-model="list" class="checklist">

      <Draggable @start="drag=true" @end="drag= false" animation="300" handle=".mover" chosenClass="chosen"
        v-model="newFields">

        <div v-for="(item,index) in newFields" :key="index" class="drag-item">
          <i class="el-icon-s-operation mover"></i>
          <span v-if="item.title">{{item | getLang }} </span>
          <span v-else>{{$t('tableDesign.'+item.prop)}}</span>
          <el-checkbox :label="item.prop" class="checkbox" @change="handleCheckbox"><span /></el-checkbox>
        </div>

      </Draggable>
    </el-checkbox-group>
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Vue,
    Watch,
    Prop,
    PropSync,
    Inject
  } from "vue-property-decorator";
  import Draggable from "vuedraggable"


  @Component({
    components: {
      Draggable
    }
  })
  export default class dragFields extends Vue {
    @Prop({
      type: Array,
      default: () => ([])
    }) fields!: any[]; //全部模块
    @Prop({
      type: Array,
      default: () => ([])
    }) checkList!: TJson[]; //所选模块

    @Prop({
      type: String,
      default: ''
    }) tabflg!: string; //所选模块


    private list: any[] = []
    private newFields: any[] = []
    private checkAll: boolean = false;


    // 全选
    private handleCheckAllChange(val: any) {
      this.list = val ? this.newFields.map((item: TJson) => item.prop) : [];
    }
    // 全选反选
    private handleCheckbox() {
      let checkList = this.list;
      // console.log(checkList, 'xxxxxxxxxxxxxxx');
      this.checkAll = checkList.length == this.newFields.length;
    }

    // @Watch('checkList', {
    //   immediate: true
    // })
    // private onChangecheckList(val: any) {
    // this.newFields = JSON.parse(JSON.stringify(this.fields));
    // this.list = this.checkList.map((item: TJson) => item.prop);
    // this.handleCheckbox();
    // }

    created() {

    }
    @Watch('fields', {
      immediate: true
    })
    private onChangefields(val: any) {
      // console.log(this.checkList);
      this.newFields = val;
      this.list = this.checkList.map((item: TJson) => item.prop);
      this.handleCheckbox();
    }


    @Watch('newFields')
    private onChangeNewFields(val: any) {
      this.$emit('upQueryList', val)
      this.$emit('update', this.newFields)
      this.$emit('change', this.newFields.filter((item: TJson) => this.list.includes(item.prop)));
    }


    @Watch('list', {
      immediate: true
    })
    private onChangeList(n: string[]) {
      this.$emit('upQueryList', this.newFields)
      this.$emit('change', this.newFields.filter((item: TJson) => this.list.includes(item.prop)));
    }
  }
</script>


<style lang="scss" scoped>
  .checklist {
    max-height: 400px;
    overflow-y: auto;
  }

  .checklist::-webkit-scrollbar {
    display: none;
  }

  .drag-item>span {
    @include ExtraNotDisplayed();
    @include VertivalAlign(inline-block,text-bottom,80%,null);
  }
</style>