<template>
  <div data-page="user-center">
    <div
      class="mui-off-canvas-wrap mui-slide-in edit-dynamic"
      ref="editDynamic"
    >
      <!-- 主页面容器 -->
      <div class="mui-inner-wrap">
        <!-- 菜单容器 -->
        <aside class="mui-off-canvas-left">
          <div class="canvas-left">
            <!-- 菜单具体展示内容 -->
            <user-dynamic :acceptUser="acceptUser" > </user-dynamic>
          </div>
        </aside>
        <!-- 主页面内容容器 -->
        <div class="mui-content mui-scroll-wrapper">
          <div
            class="mui-off-canvas-backdrop"
            @click="closeOffCanvas"
            v-show="isMaskShow"
          ></div>
          <div class="mui-scroll prepper">
            <!-- 主界面具体展示内容 -->
            <div class="page-content">
              <div class="banner">
                <div class="bannerWrapper">
                  <div
                    class="bg"
                    :style="
                      userInfo.headBgImg !== '' &&
                      userInfo.headBgImg !== undefined
                        ? 'background-image:url(' +
                          userInfo.headBgImg +
                          ');transform: scale(1.1);background-size: cover;background-repeat: no-repeat;background-position: center;background-attachment: fixed;filter: blur(1px) contrast(0.95)'
                        : ''
                    "
                    style=" "
                  ></div>
                  <div class="circle-head-viewer">
                    <img
                      :src="
                        userInfo.headImg ||
                          `${require('@/imgs/userCenter/touxiangDefault.png')}`
                      "
                    />
                  </div>
                  <div class="adaim">{{ userInfo.nickName || `匿名用户` }}</div>
                  <div class="desc-person">{{ userInfo.descPerson }}</div>
                  <!-- <div>
                        <div class="switch-btn dynamic" @click="editDynamic($event)"><i class="iconfont icon-discover" style="margin-right: 5px;"></i>动态</div>
                        <div class="switch-btn modification" @click="editModification($event)">
                          <i class="iconfont  icon-gerenxinxi1" style="margin-right: 5px;"></i>认证</div>
                    </div>                             -->
                </div>
              </div>
              <div class="waveWrapper">
                <!--css3实现波纹-->
                <div class="waveWrapperInner bgTop">
                  <div
                    class="wave waveTop"
                    :style="
                      'background-image: url(' +
                        require('../../../src/imgs/userCenter/wave-top.png') +
                        ')'
                    "
                  ></div>
                </div>
                <div class="waveWrapperInner bgMiddle">
                  <div
                    class="wave waveMiddle"
                    :style="
                      'background-image: url(' +
                        require('../../../src/imgs/userCenter/wave-mid.png') +
                        ')'
                    "
                  ></div>
                </div>
                <!-- 左侧功能项 -->
                <div class="tool-left">
                  <ul>
                    <li
                      class="tool-item"
                      v-for="(icon, index) in usertools"
                      :key="index"
                      :class="index === toolIndex ? 'tool-item-active' : ''"
                      @click="hitTools($event, index)"
                    >
                      <i class="ico-tool iconfont" :class="icon"></i>
                    </li>
                  </ul>
                </div>
                <user-waveContnet
                  :isShowMenuModal="isShowMenuModal"
                  @showFriendsListMenus="showFriendsListMenus"
                  @openChatcallBack="openChatcallBack"
                  @changeChatList="changeChatList"
                  @getCommunicatorList="getCommunicatorList"
                  v-model="isOpenChat"
                ></user-waveContnet>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 点击弹出认证窗口 -->
      <user-authentication
        v-model="isStartAuthentication"
        :file_url="file_url"
        :defaultIdPhoto="authImage"
      ></user-authentication>
      <!-- 上传照片组件 -->
      <!-- 底部弹出菜单上传照片 -->
      <div
        ref="sheet_upload"
        class="mui-popover mui-popover-bottom mui-popover-action prpo-bg"
      >
        <!-- 可选择菜单 -->
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <i class="iconfont icon-paizhao" style="font-size: 24px;"></i>
            <div href="#" @click="takePhoto">拍照</div>
          </li>
          <li class="mui-table-view-cell" style="position:relative;">
            <!-- <i class="iconfont icon-xiangce"></i> -->
            <input
              type="file"
              ubt="upImg"
              @change="takeNow($event)"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              class="tk-photo"
            />
            <div href="#">取现有的</div>
          </li>
        </ul>
        <!-- 取消菜单 -->
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <div href="#sheet1" @click="closepopver"><b>取消</b></div>
          </li>
        </ul>
      </div>
    </div>
    <user-friendsListMenu
      v-model="isShowMenuModal"
      :communicators="communicators"
      @openFriendsDynamic="openFriendsDynamic"
    >
    </user-friendsListMenu>
    <user-friendsChat
      v-model="isOpenChat"
      :title="friendTitle"
      :chatList="chatList"
      @changeChatList="changeChatList"
    ></user-friendsChat>
  </div>
</template>
<script>
import userDynamic from './user-dynamic';
import userAuthentication from './user-authentication';
import waveContnet from './common/waveContnet';
import friendsChat from './common/friendsChat';
import friendsListMenu from './common/friendsListMenu';
import takeH5Photos from '../../js/utils/takeH5Photos';
/**
 *  2018/11/26 TODO:开始去完成分享功能，
 *  因语音播放的功能暂时io支持不足够，所以暂时搁浅
 *  1.完成分享 
 *  2.完成点赞 OK
 *  3.完成自动转发到足迹 =============//消息列表 doing 2018/11/28 仿QQ看点实现足迹
 *  update：分享到足迹
 *  <先去实现足迹列表>
 *  // 预期完成日： 2018/12/12 16天
 */
export default {
  name: 'userCenter',
  components: {
    'user-dynamic': userDynamic,
    'user-authentication': userAuthentication,
    'user-waveContnet': waveContnet,
    'user-friendsListMenu': friendsListMenu,
    'user-friendsChat': friendsChat
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    next(vm => {
      if (app.globalService.isLogin()) {
        const user = app.globalService.getLoginUserInfo()
        vm.userInfo.headImg = user.headImg;
        vm.userInfo.headBgImg = user.headBgImg;
        vm.userInfo.nickName = user.nickName;
        if (user.Mobile) {
          vm.userInfo.Mobile = user.Mobile;
        }
        if (user.descPerson) {
          vm.userInfo.descPerson = user.descPerson;
        }
      } else
        if (
          from.name === 'userSiteInfo' &&
          Object.keys(vm.$route.params).length > 0 &&
          vm.$route.params.user
        ) {
          const user = vm.$route.params.user;
          vm.userInfo.headImg = user.headImg;
          vm.userInfo.headBgImg = user.headBgImg;
          vm.userInfo.nickName = user.nickName;
          vm.userInfo.descPerson = user.descPerson;
        }
    });
  },
  // 从用户中心离开的所有操作都必须先判断是否已经登录
  beforeRouteLeave (to, from, next) {
    if (app.globalService.isLogin()) {
      next();
    } else if (to.name === 'home' || to.name === 'myCustomerGathers') {
      next();
    } else {
      mui.toast('请先登录');
    }
  },
  data () {
    return {
      acceptUser: {
        nickName: null,
        descPerson: null,
        headBgImg: null,
        headImg: null,
        acceptUserId: app.globalService.getLoginUserInfo()._id
      },
      userInfo: {
        nickName: null,
        headImg: require('@/imgs/userCenter/touxiangDefault.png'),
        headBgImg: '',
        descPerson: '这个人真懒，什么都没留下~',
        Mobile: ''
      },
      // 先去完成用户登录后直接可以看见部分资料的代码
      usertools: Array.from(require('@/js/data/usertools.json')),
      money: 0,
      authImage: '',
      isShowMenuModal: false,
      isMaskShow: false,
      isStartAuthentication: false,
      toolIndex: 0,
      dataBase64: '',
      takeH5Photos: null,
      isOpenChat: false,
      friendTitle: '',
      chatList: {},
      communicators: ''// 所有好友
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.takeH5Photos = new takeH5Photos({ isSendToServer: false });
    });
  },
  methods: {
    takeNow (e) {
      let reader = null
      if (e.target.files && e.target.files[0]) {
        reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        this.file_url = e.target.files[0];
        console.log(this.file_url)
      }
      reader.onload = evt => {
        this.authImage = evt.target.result;
        this.closepopver()
      }
    },
    getCommunicatorList (communicators) {
      this.communicators = communicators
    },
    changeChatList (chatList) {
      this.chatList = chatList
    },
    openChatcallBack (status) {
      this.isOpenChat = status
    },
    showFriendsListMenus (isShow) {
      this.isShowMenuModal = isShow
    },
    closepopver () {
      mui(this.$refs['sheet_upload']).popover('hide');
    },
    hitTools (e, toolIndex) {
      this.toolIndex = toolIndex;
      switch (toolIndex) {
        case 0:
          // this.takePhoto();
          this.editDynamic(e)
          break;
        case 1:
          this.collection();
          break;
        case 2:
          this.userInfoSite();
          break;
        case 3:
          this.editModification(e)
          // this.multiplayerRoom();
          break;
        case 4:
          this.addActivity();
          break;
        default:
          break;
      }
    },
    // 添加活动
    addActivity () {
      this.$router.push({ name: 'userActivity' });
    },
    // 多人房间
    multiplayerRoom () { },
    // 用户资料设置
    userInfoSite () {
      this.$router.push({
        name: 'userSiteInfo',
        params: { userInfo: this.userInfo }
      });
    },
    // 关注数
    collection () {
      this.$router.push({ name: 'userCollection' });
    },
    //打开手机摄像头
    takePhoto () {
      this.takeH5Photos.createTask((t) => {
        // 拍照上传后回调函数
        alert(JSON.stringify(t))
      });
      this.takeH5Photos.openCamera((file_url, image) => {
        this.authImage = image
      });
    },
    closeOffCanvas () {
      this.isMaskShow = false;
    },
    // 展示好友的动态 
    // 不可编辑！！ 只可点赞分享等操作
    openFriendsDynamic (acceptUser) {
      if (acceptUser) {
        this.acceptUser = Object.assign({}, acceptUser)
        this.acceptUser.acceptUserId = this.acceptUser._id
        setTimeout(() => {
          this.isMaskShow = true;
          mui(this.$refs['editDynamic'])
            .offCanvas()
            .show();
        }, 500)
      }
    },
    editDynamic (e) {
      this.isMaskShow = true;
      this.acceptUser = Object.assign(this.acceptUser, this.userInfo)
      this.acceptUser.acceptUserId = app.globalService.getLoginUserInfo()._id
      mui(this.$refs['editDynamic'])
        .offCanvas()
        .show();
    },
    editModification (e) {
      this.isStartAuthentication = true;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../../src/less/_mixins.less");

[data-page="user-center"] {
  overflow: hidden;
  .tk-photo {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .canvas-left {
    box-shadow: 0 0px 10px rgba(0, 0, 0, 0.3),
      -2px 0px 2px rgba(0, 0, 0, 0.4) inset;
  }
  .mui-off-canvas-left {
    background: #fff;
    width: 90%;
  }
  .prepper {
    height: 100%;
  }
  .wave {
    position: absolute;
    left: 0;
    width: 100%;
    height: 40px;
    top: -40px;
    background-position: -500px 0px;
  }
  .wave-scroll {
    left: 0;
    border-top-left-radius: 5px;
  }
  /*css3波纹*/
  .waveWrapperInner {
    z-index: 15;
    opacity: 0.9;
  }
  .waveTop {
    background-size: cover;
  }
  .waveMiddle {
    background-size: cover;
  }
  .banner {
    width: 100%;
    height: 185px;
    .bannerWrapper {
      position: relative;
      height: 100%;
      .bg {
        height: 100%;
        padding-top: 20px;
        transition: all ease 0.3s;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1),
            rgba(163, 143, 175, 0.5)
          )
          no-repeat center;
        filter: blur(10px) brightness(80%) opacity(0.8);
      }
      .switch-btn {
        width: calc(~"50% - 30px");
        position: relative;
        color: rgba(255, 255, 255, 1);
        text-decoration: none;
        background-color: #007aff;
        font-family: "Yanone Kaffeesatz";
        font-weight: 700;
        display: block;
        padding: 4px;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        -webkit-box-shadow: 0px 9px 0px #0062cc, 0px 9px 25px rgba(0, 0, 0, 0.7);
        -moz-box-shadow: 0px 9px 0px #0062cc, 0px 9px 25px rgba(0, 0, 0, 0.7);
        box-shadow: 0px 9px 0px #0062cc, 0px 9px 25px rgba(0, 0, 0, 0.7);
        text-align: center;
        -webkit-transition: all 0.1s ease;
        -moz-transition: all 0.1s ease;
        -ms-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        display: inline-block;
        margin-top: 2px;
        &.dynamic {
          float: left;
          margin-left: 20px;
        }
        &.modification {
          float: right;
          margin-right: 20px;
        }
        &:active {
          -webkit-box-shadow: 0px 3px 0px #007aff,
            0px 3px 6px rgba(0, 0, 0, 0.9);
          -moz-box-shadow: 0px 3px 0px #007aff, 0px 3px 6px rgba(0, 0, 0, 0.9);
          box-shadow: 0px 3px 0px #007aff, 0px 3px 6px rgba(0, 0, 0, 0.9);
          position: relative;
          top: 6px;
        }
      }
    }
    .desc-person {
      margin-top: 10px;
      color: #fff;
      position: absolute;
      width: 100%;
      text-align: center;
      top: 100px;
    }
    .adaim {
      color: #fff;
      position: absolute;
      width: 100%;
      text-align: center;
      top: 85px;
      display: block;
    }
    .circle-head-viewer {
      position: absolute;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      margin: 0 auto;
      border: 2px solid #f3f3f3;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) inset;
      overflow: hidden;
      position: absolute;
      top: 35px;
      left: 0;
      right: 0;
      &:before {
        position: absolute;
        top: -19px;
        left: 13px;
        content: "";
        width: 30px;
        height: 31px;
        background: url(../../imgs/userCenter/ava_deco1.png) no-repeat;
        background-size: cover;
      }
      &:after {
        position: absolute;
        bottom: -10px;
        left: 4px;
        content: "";
        width: 32px;
        height: 15px;
        background: url(../../imgs/userCenter/ava_deco2.png) no-repeat;
      }

      & > img {
        position: relative;
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .waveWrapper {
    height: calc(~"100% - 185px");
    position: relative;
    background-color: #fff;
    .tool-left {
      padding-right: 10px;
      width: 50px;
      display: inline-block;
      height: 100%;
      height: 100%;
      vertical-align: top;
      & > ul {
        height: 100%;
      }
      .tool-item {
        height: 20%;
        .justify-content(center);
        .flexbox();
        .align-items(center);
        .hairline(bottom, #eee);
        box-shadow: 1px 0px 1px rgba(0, 0, 0, 0.1) inset;
        position: relative;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        &.tool-item-active {
          background-color: #007aff;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          box-shadow: 1px 7px 15px rgba(0, 0, 0, 0.4);
          transition: all 0.5s ease;
          .hairline-remove(bottom);
          .ico-tool {
            color: #fff;
          }
        }
        .ico-tool {
          display: block;
          font-size: 24px;
          color: #999;
          display: block;
        }
      }
    }
  }
  .prpo-bg {
    z-index: 2001;
    background-color: rgba(51, 51, 51, 0.63);
  }
  .mui-table-view {
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.8);
  }
}
</style>