<template>
    <div class="role-container">
      <header class="title titleRole">{{ $t("global.role") }}</header>
      <div class="cont-wrap">
				<ul class="select-list">
					<li v-if="curPerm.isAppDesign" class="select-item add-item" @click="showDialog('CREATE')">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#6087FD',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addRoleGroup") }}
					</li>
					<li class="select-item select-group-item" :key="item.id" v-for="item in groupList" @click="showDialog('UPDATE',item)">
						<i v-if="curPerm.isAppDesign" class="el-icon-close close-btn" @click.stop="delGroup(item.code, item.name)"></i>
						<div class="name">{{ item.name }}</div>
						<div class="avatar-wrapper">
							<div class="user-avatar" :style="{backgroundColor: i.type === '0'?'#A1A1A1':'#ececea'}" :key="i.id" v-for="i in item.users">
                <rvue-tooltip :content="i.name">
                <img v-if="i.type === '0'" style="width: 14px;height: 14px;margin: 3px;" :src="`${publicPath}img/department.svg`" />
                </rvue-tooltip>
								<img v-if="i.type === '2'" class="avatar-image" :src="i.avatar || `${publicPath}img/avatar.svg`" />
							</div>
							<!-- <div class="user-count">{{ item.users.length }}</div> -->
						</div>
					</li>
				</ul>
			</div>

      <!-- 添加角色组 -->
		<rvue-dialog :title="group.code?'修改角色组':'新建角色组'" :visible.sync="dialogGroupVisible" append-to-body>
      <div class="lineOnly"></div>
			<el-form v-if="dialogGroupVisible" ref="roleGroupForm" :model="group" label-width="120px">
				<el-form-item label="角色组名称" prop="name" :rules="nameRules">
					<rvue-input :disabled="!curPerm.isAppDesign" v-model="group.name" autocomplete="off"></rvue-input>
				</el-form-item>
				<el-form-item label="角色组成员">
					<div>
						<i class="el-icon-circle-plus-outline" :style="{ fontSize: '22px' }" @click="dialogVisible = true"></i>
					</div>
					<div class="user-avatar" :style="{borderRadius: '50%',backgroundColor: item.type === '0'?'#A1A1A1':'#ececea'}" :key="item.id" v-for="item in tags">
						<img v-if="item.type === '0'" style="width: 20px;height: 20px;margin: 5px;" :src="`${publicPath}img/department.svg`" />
						<img v-if="item.type === '2'" class="avatar-image" :src="item.avatar || `${publicPath}img/avatar.svg`" />
					</div>
				</el-form-item>
        <el-form-item>
			  	<el-checkbox :disabled="!curPerm.isAppDesign" v-model="group.canEdit">成员管理 </el-checkbox>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogGroupVisible = false">取 消</el-button>
				<el-button size="mini" type="primary" @click="saveGroup('roleGroupForm')">确 定</el-button>
			</div>
		</rvue-dialog>

    <!-- 角色组 部门、成员 -->
		<RvueDepartmentMembers :defaultTags.sync="tags" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :hide="[1]" />
    </div>
</template>

<script lang ='ts'>
import { Component, Vue, Watch, Prop, Provide } from "vue-property-decorator";
import { queryAppDesignerList, addAppRole, delAppRole, updateAppDesigner } from "@/api/tenant";
import { PermissionModule } from "@/store/modules/permission"; 

@Component({
})
export default class Role extends Vue  {
  private dialogGroupVisible = false;
  private dialogVisible = false;
  private groupList = [];
  private group:any = {};
  private tags = [];
  private nameRules:any=[
    {required:true,message:'请输入角色组名称'},
    {min:1,max:100,message:'字符长度不能超过100'}
  ];//[{required: true, min:1, max:100, pattern:/^[0-9,a-z]{1,100}$/, message: '名称长度不能为空并且超过100位'}]
  get curPerm() {
    return PermissionModule.curPerm;
  }

  private get appCode() {
    return this.$route.params.appCode;
  }

  private created() {
    this.getGroup()
    }

  private showDialog(type: string, group?:any) {
    if(type === 'CREATE') {
      this.group = {};
      this.tags = [];
    } else {
      this.group = {
        ...group,
        canEdit: group.operateTypes.indexOf('U') > -1
      }
      this.tags = group.users || [];
    }
    this.dialogGroupVisible = true;
  }

  private bindGetTags(tags: any) {
    //@ts-ignore
    this.tags = tags;
  }

  private getGroup() {
    queryAppDesignerList(this.appCode, "1")
    .then(res => {
      this.groupList = res.data || [];
    })
  }
  private saveGroup(formName:string) {
    //@ts-ignore
    this.$refs[formName].validate((valid:boolean) => {
      if (valid) {
        if(this.tags.length && this.group.name) {
          if(!this.group.code) {
            addAppRole(this.appCode, {
              operateTypes: this.group.canEdit? ['R', 'U']:['R'],
              type: "1",
              name: this.group.name,
              users: this.tags,
            }).then((res) => {
              if (res.data) {
                this.$message.success("新建成功！");
                this.dialogGroupVisible = false;
                this.getGroup();
              }
            });
          } else {
          updateAppDesigner(this.appCode, this.group.code, {
            operateTypes: this.group.canEdit? ['R', 'U']:['R'],
            type: "1",
            name: this.group.name,
            users: this.tags,
          }).then((res) => {
            if (res.data) {
              this.$message.success("更新成功！");
              this.dialogGroupVisible = false;
              this.getGroup();
            }
          });
        }
        }
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  private delGroup(code: any, name: string) {
    this.$prompt("如确定删除,请输入角色组名称", `您确定要删除'${name}'吗？`, {
      center: true,
      type: 'warning'
    }).then(({ value }:any) => {
      if (value === name) {
        delAppRole(this.appCode, code).then((res) => {
          if (res.data) {
            this.$message.success("删除成功！");
            this.getGroup();
          }
        });
      } else {
        this.$message.warning("输入错误！");
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__title{
  margin-left:25px;
}
.role-container {
  background-color: #efeff6;
  height: calc(100vh - 40px);
  overflow: hidden;
  .titleRole{
    margin-left:50px;
  }
  .cont-wrap {
    margin: 50px;
    margin-top:30px;
    padding: 30px;
    @include GlobalAvatar(null,null,3px,#fff);

    .select-list {
      @include JustityAndFlexWrap(flex,null,null,wrap);
      .select-item {
        @include PositionRelative(250px,70px);
        @include JustityAndFlexWrap(flex,null,center,null);
        padding-left: 15px;
        margin: 10px;
        border: 1px solid #eee;

        .name {
          font-size: 16px;
          margin-bottom: 5px;
          width:90%;
          @include ExtraNotDisplayed()
        }

        .email {
          font-size: 12px;
        }

        .close-btn {
          @include PositionAbsoulte(5px,5px,null,null);
          cursor: pointer;
        }
      }

      .select-group-item {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .avatar-wrapper {
          width: 100%;
          height: 25px;
          overflow: hidden;

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
          border-radius: 50%;
          text-align: center;
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
::v-deep.is-checked.is-disabled .el-checkbox__label {
  color: #C0C4CC !important;
}
</style>