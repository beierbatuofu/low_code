<template>
    <div class="appdesigner-container">
      <header class="title">{{ $t("appset.ApplicationDesigner") }}</header>
      <div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item add-item" @click="showAddApctDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#6087FD',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addApplicationDesigner") }}
					</li>
          <li class="select-item select-user-item" :key="item.id" v-for="item in designerList">
            <i v-if="item.dtUserId !== selfUserId" class="el-icon-close close-btn"
              @click="delDesigner(item.id)"></i>
            <div class="user-avatar">
              <img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
              <i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#4c81ff', color: '#fff', borderRadius: '50%' }"></i>
            </div>
            <div>
              <p class="name">{{ item.name }}</p>
              <p class="email">{{ item.email }}</p>
            </div>
          </li>
				</ul>
			</div>

		<RvueDepartmentMembers :defaultTags="designerList" :dialogVisible.sync="applicationdialogVisible" @closeDialog="bindGetTagsApplicationDesigner" :hide="[0, 1]" :multiple="true" />
    </div>
</template>

<script lang ='ts'>
import { Component, Vue, Watch, Prop, Provide } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { queryAppDesignerList, updateAppDesigner } from "@/api/tenant";
@Component({
})
export default class AppDesigner extends Vue  {
  private applicationdialogVisible = false; //添加应用设计者 成员dialog
  private designerList = [];
  private selfUserId = UserModule.userInfo.userId;
  private data:any = {};

  private get appCode() {
    return this.$route.params.appCode;
  }

  private created() {
    this.getList()
    }

  private getList() {
    queryAppDesignerList(this.appCode, "0")
    .then(res => {
      this.data = res.data[0];
      this.designerList = this.data.users || [];
    })
  }

  private showAddApctDialog() {
    this.applicationdialogVisible = true;
  }

  //添加应用设计者
  private bindGetTagsApplicationDesigner(tags:any) {
    updateAppDesigner(this.appCode, this.data.code, {
      type: "0",
      name: this.data.name,
      operateTypes: this.data.operateTypes,
      users: tags,
    }).then(res => {
      if(res.data) {
        this.$message.success("添加成功！")
        this.getList()
      }
    })
  }

  // 删除应用设计者
  private delDesigner(id:any) {
    this.$confirm('确认删除?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      updateAppDesigner(this.appCode, this.data.code, {
        type: "0",
        name: this.data.name,
        operateTypes: this.data.operateTypes,
        users: this.designerList.filter((item:any) => item.id !== id),
      }).then(res => {
        if(res.data) {
          this.$message.success("删除成功！")
          this.getList()
        }
      })
    });
  }

}
</script>
<style lang="scss" scoped>
.select-user-item:hover{
  border :1px solid #f1f1f1;
  border-radius: 4px;
  box-shadow: 3px 3px 2px #ccc;
  .close-btn{
    color:#8c8c8c
  }
}
.title{
  margin-left:50px;
}
.appdesigner-container {
  background-color: #efeff6;
  height: calc(100vh - 40px);
  overflow: hidden;
  .cont-wrap {
    margin:30px 50px;
    padding: 30px;
    @include GlobalAvatar(null,null,3px,#fff);

    .select-list {
      @include JustityAndFlexWrap(flex,null,null,wrap);
      .select-item {
        @include PositionRelative(250px,60px);
        @include JustityAndFlexWrap(flex,null,center,null);
        padding-left: 15px;
        margin: 10px;
        border: 1px solid #eee;

        &.visit-item {
          width: 150px;
          height: 40px;
        }

        @at-root .user-avatar {
          @include VertivalAlign(inline-block,middle,30px,30px);
          margin-top:0px;
          margin-right: 14px;
          line-height: 30px;

          .avatar-image {
            @include GlobalAvatar(100%,100%,50%)
          }
        }

        .name {
          font-size: 16px;
          //margin-bottom: 10px;
        }

        .email {
          font-size: 12px;
        }

        .close-btn {
          @include PositionAbsoulte(5px,5px,null,null);
          cursor: pointer;
        }
      }

      .select-user-item {
        display: flex;
        align-items: center;
      }

      .select-group-item {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .avatar-wrapper {
          width: 100%;

          .user-count {
            float: right;
            margin-right: 5px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            border: 1px solid #ccc;
            @include GlobalAvatar(20px,20px,50%,null);
          }
        }

        .user-avatar {
          margin-right: 12px;
          @include VertivalAlign(inline-block,middle,20px,20px);
          line-height: 20px;

          .avatar-image {
            @include GlobalAvatar(100%,100%,50%)
          }
        }
      }

      .add-item {
        cursor: pointer;
      }
    }
  }
}
</style>