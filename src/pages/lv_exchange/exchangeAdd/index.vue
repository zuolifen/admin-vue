<template>
  <div class="" id="shopp-manager">
    <div class="i-layout-page-header header_top">
      <div class="i-layout-page-header fl_header">
        <router-link :to="{ path: '/admin/lv_product/product_list' }"
          ><Button icon="ios-arrow-back" size="small" type="text"
            >返回</Button
          ></router-link
        >
        <Divider type="vertical" />
        <span
          class="ivu-page-header-title mr20"
          style="padding: 0"
          v-text="$route.params.id ? '编辑景点' : '添加景点'"
        ></span>
      </div>
    </div>
    <Card :bordered="false" dis-hover class="ivu-mt">
      <Tabs v-model="currentTab" @on-click="onhangeTab">
        <TabPane
          v-for="(item, index) in headTab"
          :key="index"
          :label="item.tit"
          :name="item.name"
        ></TabPane>
        <!-- <TabPane label="基础信息" name="1"></TabPane>
        <TabPane label="规格库存" name="2"></TabPane>
        <TabPane label="景点详情" name="3"></TabPane>
        <TabPane v-show="formValidate.is_virtual ==0" label="物流设置" name="4"></TabPane>
        <TabPane label="营销设置" name="5"></TabPane>
        <TabPane label="其他设置" name="6"></TabPane> -->
      </Tabs>
      <Form
        class="formValidate mt20"
        ref="formValidate"
        :rules="ruleValidate"
        :model="formValidate"
        :label-width="labelWidth"
        :label-position="labelPosition"
        @submit.native.prevent
      >
        <!-- 基础信息-->
        <Row :gutter="24" type="flex" v-show="currentTab === '1'">
      

       
          <Col span="24">
            <FormItem label="景点名称：" prop="lvyou_name">
              <Input
                class="perW20"
                v-model.trim="formValidate.lvyou_name"
                placeholder="请输入景点名称"
              />
            </FormItem>
          </Col>

          <Col span="24">
            <FormItem label="景点描述：">
              <Input
                class="perW20"
                v-model.trim="formValidate.lvyou_info"
                type="textarea"
                placeholder="请输入景点描述"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="签到获得积分：">
              <InputNumber
                v-model="formValidate.integral"
                :min="0"
                :max="999999"
              />
            </FormItem>
          </Col>
           <Col span="24">
            <FormItem label="打卡人数：">
              <InputNumber
                v-model="formValidate.clock_people"
                :min="0"
                :max="999999"
              />
            </FormItem>
          </Col>
        
           <Col span="24">
              <FormItem label="景点图：">
                <div
                  class="pictrueBox"
                  @click="modalPicTap('dan', 'danTable', 0)"
                >
                  <div class="pictrue" v-if="formValidate.image">
                    <img v-lazy="formValidate.image" />
                    <Input
                      v-model="formValidate.image"
                      style="display: none"
                    ></Input>
                  </div>
                  <div class="upLoad acea-row row-center-wrapper" v-else>
                    <Input
                      v-model="formValidate.image"
                      style="display: none"
                    ></Input>
                    <Icon type="ios-camera-outline" size="26" />
                  </div>
                </div>
              </FormItem>
            </Col>
          <Col span="24">
            <FormItem label="景点轮播图：" prop="slider_image">
              <div class="acea-row">
                <div
                  class="pictrue"
                  v-for="(item, index) in formValidate.slider_image"
                  :key="index"
                  draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  @dragover.prevent="handleDragOver($event, item)"
                  @dragenter="handleDragEnter($event, item)"
                  @dragend="handleDragEnd($event, item)"
                >
                  <img v-lazy="item" />
                  <Button
                    shape="circle"
                    icon="md-close"
                    @click.native="handleRemove(index)"
                    class="btndel"
                  ></Button>
                </div>
                <div
                  v-if="formValidate.slider_image.length < 10"
                  class="upLoad acea-row row-center-wrapper"
                  @click="modalPicTap('duo')"
                >
                  <Icon type="ios-camera-outline" size="26" />
                </div>
                <Input
                  v-model="formValidate.slider_image[0]"
                  style="display: none"
                ></Input>
              </div>

              <div class="titTip">
                建议尺寸：800*800，可拖拽改变图片顺序，默认首张图为主图，最多上传10张
              </div>

              <!-- <div class="tips">(最多10张<br />750*750)</div> -->
            </FormItem>
          </Col>
         
        </Row>
        
        <!-- 景点详情-->
        <Row v-show="currentTab === '2'">
          <Col span="16">
            <FormItem label="景点详情：">
              <WangEditor
                style="width: 100%"
                :content="formValidate.description"
                @editorContent="getEditorContent"
              ></WangEditor>
            </FormItem>
          </Col>
          <Col span="6" style="width: 33%">
            <div class="ifam">
              <div class="content" v-html="content"></div>
            </div>
          </Col>
        </Row>

    
     
        <FormItem>
          <Button v-if="currentTab !== '1'" @click="upTab">上一步</Button>
          <Button
            type="primary"
            class="submission"
            v-if="currentTab !== '2' && formValidate.virtual_type == 0"
            @click="downTab"
            >下一步</Button
          >
          <Button
            type="primary"
            class="submission"
            v-if="currentTab !== '2' && formValidate.virtual_type != 0"
            @click="downTab"
            >下一步</Button
          >
          <Button
            type="primary"
            :disabled="openSubimit"
            class="submission"
            @click="handleSubmit('formValidate')"
            v-if="
              ($route.params.id || currentTab === '2') &&
              formValidate.virtual_type == 0
            "
            >保存</Button
          >
          <Button
            type="primary"
            :disabled="openSubimit"
            class="submission"
            @click="handleSubmit('formValidate')"
            v-if="
              ($route.params.id || currentTab === '2') &&
              formValidate.virtual_type != 0
            "
            >保存</Button
          >
        </FormItem>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </Form>
      <Modal
        v-model="modalPic"
        width="1024px"
        scrollable
        footer-hide
        closable
        title="上传景点图"
        :mask-closable="false"
        :z-index="1"
      >
        <uploadPictures
          :isChoice="isChoice"
          @getPic="getPic"
          @getPicD="getPicD"
          :gridBtn="gridBtn"
          :gridPic="gridPic"
          v-if="modalPic"
        ></uploadPictures>
      </Modal>
      <Modal
        v-model="addVirtualModel"
        width="700px"
        closable
        title="添加卡密"
        :mask-closable="false"
        :z-index="1"
        footer-hide
        @on-visible-change="initVirtualData"
      >
        <div class="trip"></div>
        <div class="type-radio">
          <Form :label-width="80">
            <FormItem label="卡密类型：">
              <RadioGroup v-model="disk_type" size="large">
                <Radio :label="1">固定卡密</Radio>
                <Radio :label="2">一次性卡密</Radio>
              </RadioGroup>
              <div v-if="disk_type == 1">
                <div class="stock-disk">
                  <Input
                    v-model="disk_info"
                    size="large"
                    type="textarea"
                    :rows="4"
                    placeholder="填写卡密信息"
                  />
                </div>
                <div class="stock-input">
                  <Input
                    type="number"
                    v-model="stock"
                    size="large"
                    placeholder="填写库存数量"
                  >
                    <span slot="append">件</span>
                  </Input>
                </div>
              </div>
              <div class="scroll-virtual" v-if="disk_type == 2">
                <div
                  class="virtual-data mb10"
                  v-for="(item, index) in virtualList"
                  :key="index"
                >
                  <span class="mr10 virtual-title">卡号{{ index + 1 }}：</span>
                  <Input
                    class="mr10"
                    type="text"
                    v-model.trim="item.key"
                    style="width: 150px"
                    placeholder="请输入卡号(非必填)"
                  ></Input>
                  <span class="mr10 virtual-title">卡密{{ index + 1 }}：</span>
                  <Input
                    class="mr10"
                    type="text"
                    v-model.trim="item.value"
                    style="width: 150px"
                    placeholder="请输入卡密"
                  ></Input>
                  <span class="deteal-btn" @click="removeVirtual(index)"
                    >删除</span
                  >
                </div>
              </div>
              <div class="add-more" v-if="disk_type == 2">
                <Button type="primary" @click="handleAdd" icon="md-add"
                  >新增</Button
                >
                <Upload
                  class="ml10"
                  :action="cardUrl"
                  :data="uploadData"
                  :before-upload="beforeUpload"
                  :headers="header"
                  :on-success="upFile"
                >
                  <Button icon="ios-cloud-upload-outline">导入卡密</Button>
                </Upload>
              </div>
            </FormItem>
          </Form>
        </div>
        <div class="footer">
          <div class="clear" @click="closeVirtual">取消</div>
          <div class="submit" @click="upVirtual">确认</div>
        </div>
      </Modal>
    </Card>
    <freightTemplate
      :template="template"
      v-on:changeTemplate="changeTemplate"
      ref="templates"
    ></freightTemplate>
    <add-attr ref="addattr" @getList="userSearchs"></add-attr>
    <coupon-list
      ref="couponTemplates"
      @nameId="nameId"
      :couponids="formValidate.coupon_ids"
      :updateIds="updateIds"
      :updateName="updateName"
    ></coupon-list>
    <coupon-list
      ref="goodsCoupon"
      many="one"
      :luckDraw="true"
      @getCouponId="goodsCouponId"
    ></coupon-list>
    <!-- 生成淘宝京东表单-->
    <Modal
      v-model="modals"
      @on-cancel="cancel"
      class="Box"
      scrollable
      footer-hide
      closable
      title="复制淘宝、天猫、京东、苏宁、1688"
      :mask-closable="false"
      width="800"
      height="500"
    >
      <tao-bao ref="taobaos" v-if="modals" @on-close="onClose"></tao-bao>
    </Modal>
    <Modal
      v-model="goods_modals"
      title="景点列表"
      footerHide
      class="paymentFooter"
      scrollable
      width="900"
    >
      <goods-list
        v-if="goods_modals"
        ref="goodslist"
        :ischeckbox="true"
        @getProductId="getProductId"
      ></goods-list>
    </Modal>
    <!-- 用户标签 -->
    <Modal
      v-model="labelShow"
      scrollable
      title="请选择用户标签"
      :closable="false"
      width="500"
      :footer-hide="true"
      :mask-closable="false"
    >
      <userLabel
        ref="userLabel"
        @activeData="activeData"
        @close="labelClose"
      ></userLabel>
    </Modal>
  </div>
</template>

<script>
import userLabel from "@/components/labelList";

// import COS from 'cos-js-sdk-v5'
import { mapState } from "vuex";
import vuedraggable from "vuedraggable";
import uploadPictures from "@/components/uploadPictures";
import freightTemplate from "@/components/freightTemplate";
import couponList from "@/components/couponList";
import addAttr from "../exchangeAttr/addAttr";
import VueUeditorWrap from "vue-ueditor-wrap";
import goodsList from "@/components/goodsList/index";
import taoBao from "./taoBao";
import WangEditor from "@/components/wangEditor/index.vue";
import { userLabelAddApi } from "@/api/user";

import {
  productInfoApi,
  productAddApi,
  generateAttrApi,
  productGetRuleApi,
  productGetTemplateApi,
  productGetTempKeysApi,
  checkActivityApi,
  labelListApi,
  productCache,
  cacheDelete,
  uploadType,
  importCard,
  productCreateApi,
} from "@/api/lv_product";
import Setting from "@/setting";
import { getCookies } from "@/libs/util";
import Editor from "wangeditor";
import { uploadByPieces } from "@/utils/upload"; //引入uploadByPieces方法

export default {
  name: "product_productAdd",
  components: {
    VueUeditorWrap,
    uploadPictures,
    freightTemplate,
    addAttr,
    couponList,
    taoBao,
    draggable: vuedraggable,
    goodsList,
    WangEditor,
    userLabel,
  },
  data() {
    return {
      labelShow: false,
      dataLabel: [],
      // dataLabel:[{"id":4,"value":4,"label_cate":0,"label_name":"啊啊啊","label":"啊啊啊","store_id":0,"type":1,"children":[{"id":10,"store_id":0,"label_cate":4,"label_name":"标签1","type":1,"label":"标签1","value":10},{"id":11,"store_id":0,"label_cate":4,"label_name":"标签2","type":1,"label":"标签2","value":11},{"id":12,"store_id":0,"label_cate":4,"label_name":"标签3","type":1,"label":"标签3","value":12}]},{"id":6,"value":6,"label_cate":0,"label_name":"0000","label":"0000","store_id":0,"type":1,"children":[{"id":13,"store_id":0,"label_cate":6,"label_name":"1111111","type":1,"label":"1111111","value":13},{"id":14,"store_id":0,"label_cate":6,"label_name":"2222222","type":1,"label":"2222222","value":14}]},{"id":5,"value":5,"label_cate":0,"label_name":"kk","label":"kk","store_id":0,"type":1,"children":[]}],
      headTab: [
        { tit: "基础信息", name: "1" },
        { tit: "景点详情", name: "2" },
     
      ],
      virtual: [
        { tit: "普通景点", id: 0, tit2: "物流发货" },
        { tit: "卡密/网盘", id: 1, tit2: "自动发货" },
        { tit: "优惠卷", id: 2, tit2: "自动发货" },
        { tit: "虚拟景点", id: 3, tit2: "虚拟发货" },
      ],
      seletVideo: 0, //选择视频类型
      customBtn: false, //自定义留言开关
      content: "",
      contents: "",
      fileUrl: Setting.apiBaseURL + "/file/upload",
      fileUrl2: Setting.apiBaseURL + "/file/video_upload",
      cardUrl: Setting.apiBaseURL + "/file/upload/1",
      upload_type: "", //视频上传类型 1 本地上传 2 3 4 OSS上传
      uploadData: {}, // 上传参数
      header: {},
     
      type: 0,
      modals: false,
      goods_modals: false,
      spinShow: false,
      openSubimit: false,
      virtualData: "",
      virtualList: [
        {
          key: "",
          value: "",
        },
      ],
      grid2: {
        xl: 10,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      },
      grid3: {
        xl: 18,
        lg: 18,
        md: 20,
        sm: 24,
        xs: 24,
      },
      // 批量设置表格data
      oneFormBatch: [
        {
          pic: "",
          price: 0,
          cost: 0,
          ot_price: 0,
          stock: 0,
          bar_code: "",
          weight: 0,
          volume: 0,
        },
      ],
      // 规格数据
      formDynamic: {
        attrsName: "",
        attrsVal: "",
      },
      disk_type: 1, //卡密类型
      tabIndex: 0,
      tabName: "",
      formDynamicNameData: [],
      isBtn: false,
      columns2: [
        {
          title: "图片",
          slot: "pic",
          align: "center",
          minWidth: 80,
        },
        {
          title: "售价",
          slot: "price",
          align: "center",
          minWidth: 95,
        },
        {
          title: "成本价",
          slot: "cost",
          align: "center",
          minWidth: 95,
        },
        {
          title: "原价",
          slot: "ot_price",
          align: "center",
          minWidth: 95,
        },
        {
          title: "库存",
          slot: "stock",
          align: "center",
          minWidth: 95,
        },
        {
          title: "景点编号",
          slot: "bar_code",
          align: "center",
          minWidth: 120,
        },
        {
          title: "重量（KG）",
          slot: "weight",
          align: "center",
          minWidth: 95,
        },
        {
          title: "体积(m³)",
          slot: "volume",
          align: "center",
          minWidth: 95,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          align: "center",
          minWidth: 140,
        },
      ],
      columns3: [
        {
          title: "图片",
          slot: "pic",
          align: "center",
          minWidth: 80,
        },
        {
          title: "售价",
          slot: "price",
          align: "center",
          minWidth: 95,
        },
        {
          title: "成本价",
          slot: "cost",
          align: "center",
          minWidth: 95,
        },
        {
          title: "原价",
          slot: "ot_price",
          align: "center",
          minWidth: 95,
        },
        {
          title: "库存",
          slot: "stock",
          align: "center",
          minWidth: 95,
        },
        {
          title: "景点编号",
          slot: "bar_code",
          align: "center",
          minWidth: 120,
        },
        {
          title: "虚拟景点",
          slot: "fictitious",
          align: "center",
          minWidth: 95,
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          align: "center",
          minWidth: 140,
        },
      ],
      columns: [],
      // columnsInsta8: [
      //     {
      //         title: '会员价',
      //         slot: 'vip_price',
      //         align: 'center',
      //         minWidth: 140
      //     }
      // ],
      // columnsInsta9: [
      //     {
      //         title: '会员价',
      //         slot: 'vip_price',
      //         align: 'center',
      //         minWidth: 140
      //     }
      // ],
      columnsInstall: [],
      columnsInstal2: [],
      gridPic: {
        xl: 6,
        lg: 8,
        md: 12,
        sm: 12,
        xs: 12,
      },
      gridBtn: {
        xl: 4,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      //自定义留言下拉选择
      CustomList: [
        {
          value: "text",
          label: "文本框",
        },
        {
          value: "number",
          label: "数字",
        },
        {
          value: "email",
          label: "邮件",
        },
        {
          value: "data",
          label: "日期",
        },
        {
          value: "time",
          label: "时间",
        },
        {
          value: "id",
          label: "身份证",
        },
        {
          value: "phone",
          label: "手机号",
        },
        {
          value: "img",
          label: "图片",
        },
      ],
      customess: {
        content: [],
      }, //自定义留言内容
      lvyou_name:"",
      formValidate: {
        clock_people:0,  //打卡人数
        integral:0, //签到获得积分
        image:"",
        disk_info: "", //卡密类型
        logistics: ["1"], //选择物流方式
        freight: 2, //运费设置
        postage: 0, //设置运费金额
        recommend: [], //景点推荐
        presale_day: 1, //预售发货时间-结束
        presale: false, //预售景点开关
        video_open: false, //视频按钮是否显示
        vip_product: false, //付费会员专属开关
        custom_form: [], //自定义留言
        lvyou_name: "",  //景点名称
        cate_id: [],
        label_id: [],
        keyword: "",
        unit_name: "",
        lvyou_info: "",
        image: "",
        recommend_image: "",
        slider_image: [],
        description: "",
        ficti: 0,
        give_integral: 0,
        sort: 0,
        is_show: 1,
        is_hot: 0,
        is_benefit: 0,
        is_best: 0,
        is_new: 0,
        is_good: 0,
        is_postage: 0,
        is_sub: [],
        recommend_list: [],
        virtual_type: 0,
        // is_sub: 0,
        id: 0,
        spec_type: 0,
        is_virtual: 0,
        video_link: "",
        // postage: 0,
        temp_id: "",
        attrs: [],
        items: [
          {
            pic: "",
            price: 0,
            cost: 0,
            ot_price: 0,
            stock: 0,
            bar_code: "",
          },
        ],
        activity: ["默认", "秒杀", "砍价", "拼团"],
        couponName: [],
        header: [],
        selectRule: "",
        coupon_ids: [],
        command_word: "",
      },
      ruleList: [],
      templateList: [],
      createBnt: true,
      showIput: false,
      manyFormValidate: [],
      // 单规格表格data
      oneFormValidate: [
        {
          pic: "",
          price: 0,
          cost: 0,
          ot_price: 0,
          stock: 0,
          bar_code: "",
          weight: 0,
          volume: 0,
          brokerage: 0,
          brokerage_two: 0,
          vip_price: 0,
          virtual_list: [],
          coupon_id: 0,
        },
      ],
      images: [],
      imagesTable: "",
      currentTab: "1",
      isChoice: "",
      grid: {
        xl: 8,
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24,
      },
      loading: false,
      modalPic: false,
      addVirtualModel: false,
      template: false,
      uploadList: [],
      treeSelect: [],
      picTit: "",
      tableIndex: 0,
      ruleValidate: {
        lvyou_name: [
          { required: true, message: "请输入景点名称", trigger: "blur" },
        ],
        cate_id: [
          {
            required: true,
            message: "请选择景点分类",
            trigger: "change",
            type: "array",
            min: "1",
          },
        ],
        unit_name: [{ required: true, message: "请输入单位", trigger: "blur" }],
        // image: [{ required: true, message: "请上传景点图", trigger: "change" }],
        slider_image: [
          {
            required: true,
            message: "请上传景点轮播图",
            type: "array",
            trigger: "change",
          },
        ],
        spec_type: [
          { required: true, message: "请选择景点规格", trigger: "change" },
        ],
        is_virtual: [
          { required: true, message: "请选择景点类型", trigger: "change" },
        ],
        selectRule: [
          { required: true, message: "请选择景点规格属性", trigger: "change" },
        ],
        temp_id: [
          {
            required: true,
            message: "请选择运费模板",
            trigger: "change",
            type: "number",
          },
        ],
        presale_time: [
          {
            required: true,
            type: "array",
            message: "请选择活动时间",
            trigger: "change",
          },
        ],
        logistics: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请选择物流方式",
            trigger: "change",
          },
          {
            type: "array",
            max: 2,
            message: "请选择物流方式",
            trigger: "change",
          },
        ],
        give_integral: [{ type: "integer", message: "请输入整数" }],
      },
      manyBrokerage: 0,
      manyBrokerageTwo: 0,
      manyVipPrice: 0,
      upload: {
        videoIng: false, // 是否显示进度条；
      },
      videoIng: false, // 是否显示进度条；
      progress: 0, // 进度条默认0
      stock: 0,
      disk_info: "",
      videoLink: "",
      attrs: [],
      activity: { 默认: "red", 秒杀: "blue", 砍价: "green", 拼团: "yellow" },
      couponName: [],
      updateIds: [],
      updateName: [],
      couponIds: "",
      couponNames: [],
      rakeBack: [
        {
          title: "一级返佣",
          slot: "brokerage",
          align: "center",
          width: 95,
        },
        {
          title: "二级返佣",
          slot: "brokerage_two",
          align: "center",
          width: 95,
        },
      ],
      member: [
        {
          title: "会员价",
          slot: "vip_price",
          align: "center",
          width: 95,
        },
      ],
      columnsInstalM: [],
      moveIndex: "",
      // aa: [],
      // openSubimit: false
    };
  },
  computed: {
    ...mapState("media", ["isMobile"]),
    labelWidth() {
      return this.isMobile ? undefined : 120;
    },
    labelPosition() {
      return this.isMobile ? "top" : "right";
    },
    labelBottom() {
      return this.isMobile ? undefined : 15;
    },
  },
  created() {
    this.columns = this.columns2.slice(0, 8);
    this.getToken();

   if (this.$route.params.id !== "0" && this.$route.params.id) {
      this.getInfo();
    } else if (this.$route.params.id === "0") {
      productCache()
        .then((res) => {
          let data = res.data.info;
          if (!Array.isArray(data)) {
            let cate_id = data.cate_id.map(Number);
            let label_id = data.label_id.map(Number);
            this.attrs = data.items || [];
            let ids = [];
            // let names = [];
            if (data.coupons) {
              data.coupons.map((item) => {
                ids.push(item.id);
                // names.push(item.title);
              });
              this.couponName = data.coupons;
            }

            this.formValidate = data;
            // this.couponName = data.coupons;
            // that.couponName = names;
            this.dataLabel = data.label_id;

            this.formValidate.coupon_ids = ids;
            this.updateIds = ids;
            this.updateName = data.coupons;
            this.formValidate.cate_id = cate_id;
            // this.formValidate.label_id = label_id;
            this.oneFormValidate = data.attrs;
            this.formValidate.logistics = data.logistics || ["1"];
            this.formValidate.header = [];
            this.generate(0);
            this.manyFormValidate = data.attrs;
            this.spec_type = data.spec_type;
            this.formValidate.is_virtual = data.is_virtual;
            this.formValidate.custom_form = data.custom_form || [];
            if (this.formValidate.custom_form.length != 0) {
              this.customBtn = true;
            }
            this.virtualbtn(data.virtual_type, 1);
 
            this.spinShow = false;
          }
        })
        .catch((err) => {
          this.$Message.error(err.msg);
        });
    }
  },
  mounted() {
    
    if (this.$route.query.type) {
      this.modals = true;
      this.type = this.$route.query.type;
    } else {
      this.type = 0;
    }
    // this.productGetRule();
    // this.productGetTemplate();
    // this.userLabel();
    this.uploadType();

  },
  methods: {
    activeData(dataLabel) {
      this.labelShow = false;
      this.dataLabel = dataLabel;
    },
    // 标签弹窗关闭
    labelClose() {
      this.labelShow = false;
    },
    closeLabel(label) {
      let index = this.dataLabel.indexOf(
        this.dataLabel.filter((d) => d.id == label.id)[0]
      );
      this.dataLabel.splice(index, 1);
    },
    openLabel(row) {
      this.labelShow = true;
      this.$refs.userLabel.userLabel(
        JSON.parse(JSON.stringify(this.dataLabel))
      );
    },
    videoSaveToUrl(file) {
      uploadByPieces({
        file: file, // 视频实体
        pieceSize: 3, // 分片大小
        success: (data) => {
          this.formValidate.video_link = data.file_path;
          this.progress = 100;
        },
        error: (e) => {
          this.$Message.error(e.msg);
        },
        uploading: (chunk, allChunk) => {
          this.videoIng = true;
          let st = Math.floor((chunk / allChunk) * 100);
          this.progress = st;
        },
      });
      return false;
    },
    processButtonClick() {},
    virtualbtn(index, type) {
      if (type != 1) {
        this.formValidate.is_sub = [];
        let id = this.$route.params.id;
        if (id) {
          checkActivityApi(id)
            .then((res) => {})
            .catch((res) => {
              this.formValidate.spec_type = this.spec_type;
              this.$Message.error(res.msg);
            });
        }
      }
      switch (index) {
        case 0:
          this.formValidate.virtual_type = 0;
          this.formValidate.is_virtual = 0;
          this.headTab = [
            { tit: "基础信息", name: "1" },
            { tit: "规格库存", name: "2" },
            { tit: "景点详情", name: "3" },
            { tit: "物流设置", name: "4" },
            { tit: "营销设置", name: "5" },
            { tit: "其他设置", name: "6" },
          ];
          break;
        case 1:
          this.formValidate.virtual_type = 1;
          this.formValidate.postage = 0;
          this.headTab = [
            { tit: "基础信息", name: "1" },
            { tit: "规格库存", name: "2" },
            { tit: "景点详情", name: "3" },
            // { tit: "物流设置", name: "4" },
            { tit: "营销设置", name: "4" },
            { tit: "其他设置", name: "5" },
          ];
          break;
        case 2:
          this.formValidate.virtual_type = 2;
          this.formValidate.is_virtual = 1;
          this.headTab = [
            { tit: "基础信息", name: "1" },
            { tit: "规格库存", name: "2" },
            { tit: "景点详情", name: "3" },
            // { tit: "物流设置", name: "4" },
            { tit: "营销设置", name: "4" },
            { tit: "其他设置", name: "5" },
          ];
          break;
        case 3:
          this.formValidate.virtual_type = 3;
          this.formValidate.is_virtual = 1;
          this.headTab = [
            { tit: "基础信息", name: "1" },
            { tit: "规格库存", name: "2" },
            { tit: "景点详情", name: "3" },
            // { tit: "物流设置", name: "4" },
            { tit: "营销设置", name: "4" },
            { tit: "其他设置", name: "5" },
          ];
          break;
        case 1:
          this.formValidate.virtual_type = 1;
          this.formValidate.is_virtual = 1;
          // this.formValidate.virtual_type  =1;
          this.headTab = [
            { tit: "基础信息", name: "1" },
            { tit: "规格库存", name: "2" },
            { tit: "景点详情", name: "3" },
            { tit: "营销设置", name: "4" },
            { tit: "其他设置", name: "5" },
          ];
      }
    },
   
    logisticsBtn(e) {
      this.formValidate.logistics = e;
    },
    addLabel() {
      this.$modalForm(userLabelAddApi(0)).then(() => this.userLabel());
    },
    customMessBtn(e) {
      if (!e) {
        this.formValidate.custom_form = [];
      }
    },
    addcustom() {
      if (this.formValidate.custom_form.length > 9) {
        this.$Message.warning("最多添加10条");
      } else {
        this.formValidate.custom_form.push({
          title: "",
          label: "text",
          value: "",
          status: false,
        });
      }
    },
    delcustom(index) {
      this.formValidate.custom_form.splice(index, 1);
    },
    // 预售具体日期
    onchangeTime(e) {
      this.formValidate.presale_time = e;
    },
    recommendBtn(e) {},
    getEditorContent(data) {
      this.content = data;
    },
    cancel() {
      this.$router.push({ path: "/admin/lv_product/product_list" });
    },
    // 上传头部token
    getToken() {
      this.header["Authori-zation"] = "Bearer " + getCookies("token");
    },
    beforeUpload(e) {
      this.video = e.raw;
      // this.uploadData = {};
      // let promise = new Promise((resolve) => {
      //   this.$nextTick(function () {
      //     resolve(true);
      //   });
      // });
      // return promise;
    },
    upFile(res) {
      importCard({ file: res.data.src }).then((res) => {
        this.virtualList = this.virtualList.concat(res.data);
      });
    },
    //获取视频上传类型
    uploadType() {
      uploadType().then((res) => {
        this.upload_type = res.data.upload_type;
      });
    },
    infoData(data) {
      this.formValidate = data;
    },
    //关闭淘宝弹窗并生成数据；
    onClose(data) {
      this.modals = false;
      this.infoData(data);
    },

    checkMove(evt) {
      this.moveIndex = evt.draggedContext.index;
    },
    end() {
      this.moveIndex = "";
    },
    checkAllGroupChange(data) {
      this.checkAllGroup(data);
    },
    checkAllGroup(data) {
      if (this.formValidate.spec_type === 0) {
        if (data.indexOf(0) > -1) {
          this.columnsInstall = this.columns2.slice(0, 4).concat(this.member);
        } else if (data.indexOf(1) > -1) {
          this.columnsInstall = this.columns2.slice(0, 4).concat(this.rakeBack);
        } else {
          this.columnsInstall = this.columns2.slice(0, 4);
        }
        if (data.length === 2) {
          this.columnsInstall = this.columns2
            .slice(0, 4)
            .concat(this.rakeBack)
            .concat(this.member);
        }
      } else {
        if (data.indexOf(0) > -1) {
          this.columnsInstal2 = this.columnsInstalM
            .slice(0, 4)
            .concat(this.member);
        } else if (data.indexOf(1) > -1) {
          this.columnsInstal2 = this.columnsInstalM
            .slice(0, 4)
            .concat(this.rakeBack);
        } else {
          this.columnsInstal2 = this.columnsInstalM.slice(0, 4);
        }
        if (data.length === 2) {
          this.columnsInstal2 = this.columnsInstalM
            .slice(0, 4)
            .concat(this.rakeBack)
            .concat(this.member);
        }
      }
    },
    // 添加优惠券
    addCoupon() {
      this.$refs.couponTemplates.isTemplate = true;
      this.$refs.couponTemplates.tableList();
    },
    see(data, name, index) {
      this.tabName = name;
      this.tabIndex = index;

      if (this.formValidate.virtual_type === 1) {
        if (data.virtual_list.length) {
          this.disk_type = 2;
          this.virtualList = data.virtual_list;
        } else if (data.disk_info.length) {
          this.disk_type = 1;
          this.disk_info = data.disk_info;
          this.stock = data.stock;
        }
        this.addVirtualModel = true;
      } else {
        this.$refs.goodsCoupon.isTemplate = true;
        this.$refs.goodsCoupon.tableList(3);
      }
    },
    addGoodsCoupon(index, name) {
      this.tabIndex = index;
      this.tabName = name;
      this.$refs.goodsCoupon.isTemplate = true;
      this.$refs.goodsCoupon.tableList(3);
    },
    addVirtual(index, name) {
      this.tabIndex = index;
      this.tabName = name;
      this.addVirtualModel = true;
    },
    upVirtual() {
      if (this.disk_type == 2) {
        for (let i = 0; i < this.virtualList.length; i++) {
          const element = this.virtualList[i];
          if (!element.value) {
            this.$Message.error("请输入所有卡密");
            return;
          }
        }
        this.$set(
          this[this.tabName][this.tabIndex],
          "virtual_list",
          this.virtualList
        );
        this.$set(
          this[this.tabName][this.tabIndex],
          "stock",
          this.virtualList.length
        );
        this.virtualList = [
          {
            key: "",
            value: "",
          },
        ];
        this.$set(this[this.tabName][this.tabIndex], "disk_info", "");
      } else {
        if (!this.disk_info.length) {
          return this.$Message.error("请填写卡密信息");
        }
        if (!this.stock) {
          return this.$Message.error("请填写库存数量");
        }
        this.$set(
          this[this.tabName][this.tabIndex],
          "stock",
          Number(this.stock)
        );
        this.$set(
          this[this.tabName][this.tabIndex],
          "stock",
          Number(this.stock)
        );
        this.$set(
          this[this.tabName][this.tabIndex],
          "disk_info",
          this.disk_info
        );
        this.$set(this[this.tabName][this.tabIndex], "virtual_list", []);
      }
      this.addVirtualModel = false;
      this.closeVirtual();
    },
    closeVirtual() {
      this.addVirtualModel = false;
      this.virtualList = [
        {
          key: "",
          value: "",
        },
      ];
      this.disk_info = "";
      this.stock = 0;
    },
    //对象数组去重；
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    nameId(id, names) {
      this.formValidate.coupon_ids = id;
      this.couponName = this.unique(names);
    },
    goodsCouponId(data) {
      // this[this.tabName][this.tabIndex].coupon_id = data.id;
      // this[this.tabName][this.tabIndex].coupon_name = data.title;
      this.$set(this[this.tabName][this.tabIndex], "coupon_id", data.id);
      this.$set(this[this.tabName][this.tabIndex], "coupon_name", data.title);
      this.$refs.goodsCoupon.isTemplate = false;
    },
    handleClose(name) {
      let index = this.couponName.indexOf(name);
      this.couponName.splice(index, 1);
      let couponIds = this.formValidate.coupon_ids;
      couponIds.splice(index, 1);
      this.updateIds = couponIds;
      this.updateName = this.couponName;
    },
    // 运费模板
    getList() {
      this.productGetTemplate();
    },
    // 添加运费模板
    addTemp() {
      this.$refs.templates.isTemplate = true;
    },
    // 删除视频；
    delVideo() {
      let that = this;
      that.$set(that.formValidate, "video_link", "");
      that.$set(that, "progress", 0);
      that.videoIng = false;
      that.upload.videoIng = false;
    },
    zh_uploadFile() {
      if (this.seletVideo == 1) {
        this.formValidate.video_link = this.videoLink;
      } else {
        this.$refs.refid.click();
      }
    },
    zh_uploadFile_change(evfile) {
      let that = this;
      let suffix = evfile.target.files[0].name.substr(
        evfile.target.files[0].name.indexOf(".")
      );
      if (suffix.indexOf(".mp4") === -1) {
        return that.$Message.error("只能上传MP4文件");
      }
      productGetTempKeysApi()
        .then((res) => {
          that.$videoCloud
            .videoUpload({
              type: res.data.type,
              evfile: evfile,
              res: res,
              uploading(status, progress) {
                that.upload.videoIng = status;
                if (res.status == 200) {
                  that.progress = 100;
                }
              },
            })
            .then((res) => {
              that.formValidate.video_link = res.url;
              that.$Message.success("视频上传成功");
              that.upload.videoIng = false;
            })
            .catch((res) => {
              that.$Message.error(res);
            });
        })
        .catch((res) => {
          that.$Message.error(res.msg);
        });
    },
    // 上一页；
    upTab() {
      this.currentTab = (Number(this.currentTab) - 1).toString();
    },
    // 下一页；
    downTab() {
      this.currentTab = (Number(this.currentTab) + 1).toString();
    },
    // 属性弹窗回调函数；
    userSearchs() {
      this.productGetRule();
    },
    // 添加规则；
    addRule() {
      this.$refs.addattr.modal = true;
    },
    // 批量设置分佣；
    brokerageSetUp() {
      let that = this;
      if (that.formValidate.is_sub.indexOf(1) > -1) {
        if (that.manyBrokerage <= 0 || that.manyBrokerageTwo <= 0) {
          return that.$Message.error("请填写返佣金额后进行批量添加");
        }
      } else if (that.formValidate.is_sub.indexOf(0) > -1) {
        if (that.manyVipPrice <= 0) {
          return that.$Message.error("请填写会员价后进行批量添加");
        }
      }
      if (this.formValidate.is_sub.length === 2) {
        if (
          that.manyBrokerage <= 0 ||
          that.manyBrokerageTwo <= 0 ||
          that.manyVipPrice <= 0
        ) {
          return that.$Message.error("请填写完金额后进行批量添加");
        }
      }
      for (let val of that.manyFormValidate) {
        this.$set(val, "brokerage", that.manyBrokerage);
        this.$set(val, "brokerage_two", that.manyBrokerageTwo);
        this.$set(val, "vip_price", that.manyVipPrice);
      }
      // let that = this;
      // if (that.manyBrokerage <= 0 || that.manyBrokerageTwo <= 0) {
      //     return that.$Message.error('请填写返佣金额在进行批量添加');
      // } else {
      //     for (let val of that.manyFormValidate) {
      //         this.$set(val, 'brokerage', that.manyBrokerage);
      //         this.$set(val, 'brokerage_two', that.manyBrokerageTwo);
      //     }
      // }
    },
    // 批量设置会员价
    vipPriceSetUp() {
      let that = this;
      if (that.manyVipPrice <= 0) {
        return that.$Message.error("请填写会员价在进行批量添加");
      } else {
        for (let val of that.manyFormValidate) {
          this.$set(val, "vip_price", that.manyVipPrice);
        }
      }
    },
    handleAdd() {
      this.virtualList.push({
        key: "",
        value: "",
      });
    },
    initVirtualData(status) {
      if (!status) {
        this.virtualList = [
          {
            key: "",
            value: "",
          },
        ];
      }
    },
    removeVirtual(index) {
      this.virtualList.splice(index, 1);
    },
    batchDel() {
      this.oneFormBatch = [
        {
          pic: "",
          price: 0,
          cost: 0,
          ot_price: 0,
          stock: 0,
          bar_code: "",
          weight: 0,
          volume: 0,
        },
      ];
    },
    confirm() {
      let that = this;
      that.createBnt = true;
      if (that.formValidate.selectRule.trim().length <= 0) {
        return that.$Message.error("请选择属性");
      }
      that.ruleList.forEach(function (item, index) {
        if (item.rule_name === that.formValidate.selectRule) {
          that.attrs = item.rule_value;
        }
      });
    },
    // 获取景点属性模板；
    productGetRule() {
      productGetRuleApi().then((res) => {
        this.ruleList = res.data;
      });
    },
    // 获取运费模板；
    productGetTemplate() {
      productGetTemplateApi().then((res) => {
        this.templateList = res.data;
      });
    },
    // 删除表格中的属性
    delAttrTable(index) {
      let id = this.$route.params.id;
      if (id) {
        checkActivityApi(id)
          .then((res) => {
            this.manyFormValidate.splice(index, 1);
            this.$Message.success(res.msg);
          })
          .catch((res) => {
            this.$Message.error(res.msg);
          });
      } else {
        this.manyFormValidate.splice(index, 1);
      }
    },
    // 批量添加
    batchAdd() {
      // if (!this.oneFormBatch[0].pic || !this.oneFormBatch[0].price || !this.oneFormBatch[0].cost || !this.oneFormBatch[0].ot_price ||
      //     !this.oneFormBatch[0].stock || !this.oneFormBatch[0].bar_code) return this.$Message.warning('请填写完整的批量设置内容！');
      // if (!this.oneFormBatch[0].pic) {
      //     return this.$Message.warning('请选择有效图片');
      // }
      for (let val of this.manyFormValidate) {
        if (this.oneFormBatch[0].pic) {
          this.$set(val, "pic", this.oneFormBatch[0].pic);
        }
        if (this.oneFormBatch[0].price > 0) {
          this.$set(val, "price", this.oneFormBatch[0].price);
        }
        if (this.oneFormBatch[0].cost > 0) {
          this.$set(val, "cost", this.oneFormBatch[0].cost);
        }
        if (this.oneFormBatch[0].ot_price > 0) {
          this.$set(val, "ot_price", this.oneFormBatch[0].ot_price);
        }
        if (this.oneFormBatch[0].stock > 0) {
          this.$set(val, "stock", this.oneFormBatch[0].stock);
        }
        if (this.oneFormBatch[0].bar_code !== "") {
          this.$set(val, "bar_code", this.oneFormBatch[0].bar_code);
        }
        if (this.oneFormBatch[0].weight > 0) {
          this.$set(val, "weight", this.oneFormBatch[0].weight);
        }
        if (this.oneFormBatch[0].volume > 0) {
          this.$set(val, "volume", this.oneFormBatch[0].volume);
        }
        // this.$set(val, 'price', this.oneFormBatch[0].price);
        // this.$set(val, 'cost', this.oneFormBatch[0].cost);
        // this.$set(val, 'ot_price', this.oneFormBatch[0].ot_price);
        // this.$set(val, 'stock', this.oneFormBatch[0].stock);
        // this.$set(val, 'bar_code', this.oneFormBatch[0].bar_code);
        // this.$set(val, 'weight', this.oneFormBatch[0].weight);
        // this.$set(val, 'volume', this.oneFormBatch[0].volume);
      }
    },
    // 添加按钮
    addBtn() {
      this.clearAttr();
      this.createBnt = false;
      this.showIput = true;
    },
    // 立即生成
    generate(type) {
      generateAttrApi(
        {
          attrs: this.attrs,
          is_virtual: [1, 2].includes(this.formValidate.virtual_type) ? 1 : 0,
          virtual_type: this.formValidate.virtual_type,
        },
        this.formValidate.id,
        type
      )
        .then((res) => {
          let info = res.data.info,
            header1 = JSON.parse(JSON.stringify(info.header));
          if (
            this.$route.params.id !== "0" &&
            (this.$route.query.type != -1 || type)
          ) {
            this.manyFormValidate = info.value;
          }
          let header = info.header;
          if ([1, 2].includes(this.formValidate.virtual_type)) {
            // let aaa = header.splice(7, 2, {
            //   title: "虚拟景点",
            //   slot: "fictitious",
            //   align: "center",
            //   minWidth: 95,
            // });
            this.columnsInstalM = header;
            this.formValidate.header = header;
          } else {
            this.formValidate.header = header1;
            this.columnsInstalM = info.header;
          }
          this.checkAllGroup(this.formValidate.is_sub);
          if (!this.$route.params.id && this.formValidate.spec_type === 1) {
            this.manyFormValidate.map((item) => {
              item.pic = this.formValidate.image;
            });
            this.oneFormBatch[0].pic = this.formValidate.image;
          } else if (this.$route.params.id) {
            this.manyFormValidate.map((item) => {
              if (!item.pic) {
                item.pic = this.formValidate.image;
              }
            });
            this.oneFormBatch[0].pic = this.formValidate.image;
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 取消
    offAttrName() {
      this.showIput = false;
      this.createBnt = true;
    },
    clearAttr() {
      this.formDynamic.attrsName = "";
      this.formDynamic.attrsVal = "";
    },
    // 删除规格
    handleRemoveRole(index) {
      this.attrs.splice(index, 1);
      this.manyFormValidate.splice(index, 1);
    },
    // 删除属性
    handleRemove2(item, index) {
      item.splice(index, 1);
    },
    // 添加规则名称
    createAttrName() {
      if (this.formDynamic.attrsName && this.formDynamic.attrsVal) {
        let data = {
          value: this.formDynamic.attrsName,
          detail: [this.formDynamic.attrsVal],
        };
        this.attrs.push(data);
        var hash = {};
        this.attrs = this.attrs.reduce(function (item, next) {
          /* eslint-disable */
          hash[next.value] ? "" : (hash[next.value] = true && item.push(next));
          return item;
        }, []);
        this.clearAttr();
        this.showIput = false;
        this.createBnt = true;
      } else {
        this.$Message.warning("请添加完整的规格！");
      }
    },
    // 添加属性
    createAttr(num, idx) {
      if (num) {
        this.attrs[idx].detail.push(num);
        var hash = {};
        this.attrs[idx].detail = this.attrs[idx].detail.reduce(function (
          item,
          next
        ) {
          /* eslint-disable */
          hash[next] ? "" : (hash[next] = true && item.push(next));
          return item;
        },
        []);
      } else {
        this.$Message.warning("请添加属性");
      }
    },
    // 景点分类；
    goodsCategory() {
      
    },
    // 用户标签
    // userLabel() {
    //   labelListApi()
    //     .then((res) => {
    //       console.log(res)
    //       this.dataLabel = res.data.list;
    //     })
    //     .catch((res) => {
    //       this.$Message.error(res.msg);
    //     });
    // },
    //视视上传类型
    changeVideo(e) {
      this.formValidate.video_link = "";
      this.videoLink = "";
    },
    // 改变规格
    changeSpec() {
      this.formValidate.is_sub = [];
      let id = this.$route.params.id;
      if (id) {
        checkActivityApi(id)
          .then((res) => {})
          .catch((res) => {
            this.formValidate.spec_type = this.spec_type;
            this.$Message.error(res.msg);
          });
      }
    },
    // 详情
    getInfo() {
      let that = this;
      that.spinShow = true;
      productInfoApi(that.$route.params.id)
        .then(async (res) => {
          let data =await res.data.productInfo;
          that.infoData(data);
          that.spinShow = false;
        })
        .catch((res) => {
          this.spinShow = false;
          this.$Message.error(res.msg);
        });
    },
    // tab切换
    onhangeTab(name) {
      this.currentTab = name;
    },
    handleRemove(i) {
      this.images.splice(i, 1);
      this.formValidate.slider_image.splice(i, 1);
      this.oneFormValidate[0].pic = this.formValidate.slider_image[0];
    },
    // 关闭图片上传模态框
    changeCancel(msg) {
      this.modalPic = false;
    },
    // 点击景点图
    modalPicTap(tit, picTit, index) {
      this.modalPic = true;
      this.isChoice = tit === "dan" ? "单选" : "多选";
      this.picTit = picTit;
      this.tableIndex = index;
    },
    // 获取单张图片信息
    getPic(pc) {
      switch (this.picTit) {
        case "danFrom":
          this.formValidate.image = pc.att_dir;
          if (!this.$route.params.id) {
            if (this.formValidate.spec_type === 0) {
              this.oneFormValidate[0].pic = pc.att_dir;
            } else {
              this.manyFormValidate.map((item) => {
                item.pic = pc.att_dir;
              });
              this.oneFormBatch[0].pic = pc.att_dir;
            }
          }
          break;
        case "danTable":
          this.formValidate.image = pc.att_dir;
          break;
        case "duopi":
          this.oneFormBatch[this.tableIndex].pic = pc.att_dir;
          break;
        case "recommend_image":
          this.formValidate.recommend_image = pc.att_dir;
          break;
        default:
          this.manyFormValidate[this.tableIndex].pic = pc.att_dir;
      }
      this.modalPic = false;
    },
    // 获取多张图信息
    getPicD(pc) {
      this.images = pc;
      this.images.map((item) => {
        this.formValidate.slider_image.push(item.att_dir);
        this.formValidate.slider_image = this.formValidate.slider_image.splice(
          0,
          10
        );
      });
      this.oneFormValidate[0].pic = this.formValidate.slider_image[0];
      this.modalPic = false;
    },
    // 提交
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formValidate.type = this.type;
         
          let item = this.formValidate.attrs;
          
          let activeIds = [];
          this.dataLabel.forEach((item) => {
            activeIds.push(item.id);
          });
          this.formValidate.label_id = activeIds;
          this.openSubimit = true;
          this.formValidate.description = this.formatRichText(this.formValidate.description);
          productAddApi(this.formValidate)
            .then(async (res) => {
              this.openSubimit = false;
              this.$Message.success(res.msg);
              if (this.$route.params.id === "0") {
                cacheDelete().catch((err) => {
                  this.$Message.error(err.msg);
                });
              }
              setTimeout(() => {
                this.openSubimit = false;
                this.$router.push({ path: "/admin/lv_product/product_list" });
              }, 500);
            })
            .catch((res) => {
              setTimeout((e) => {
                this.openSubimit = false;
              }, 1000);
              this.$Message.error(res.msg);
            });
        } else {
          if (!this.formValidate.lvyou_name) {
            return this.$Message.warning("景点信息-景点名称不能为空");
          } else if (!this.formValidate.cate_id.length) {
            return this.$Message.warning("景点信息-景点分类不能为空");
          } else if (!this.formValidate.unit_name) {
            return this.$Message.warning("景点信息-景点单位不能为空");
          } else if (!this.formValidate.slider_image.length) {
            return this.$Message.warning("景点信息-景点轮播图不能为空");
          } else {
            !this.formValidate.temp_id &&
            this.formValidate.freight == 3
          }
          
        }
      });
    },
    changeTemplate(msg) {
      this.template = msg;
    },
    // 表单验证
    validate(prop, status, error) {
      if (status === false) {
        this.$Message.warning(error);
      }
    },
    // 移动
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move";
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = "move";
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.formValidate.slider_image];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      this.formValidate.slider_image = newItems;
    },
    formatRichText(html) {
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match
          .replace(/style="[^"]+"/gi, "")
          .replace(/style='[^']+'/gi, "");
        match = match
          .replace(/width="[^"]+"/gi, "")
          .replace(/width='[^']+'/gi, "");
        match = match
          .replace(/height="[^"]+"/gi, "")
          .replace(/height='[^']+'/gi, "");
        return match;
      });
      newContent = newContent.replace(
        /style="[^"]+"/gi,
        function (match, capture) {
          match = match
            .replace(/width:[^;]+;/gi, "max-width:100%;")
            .replace(/width:[^;]+;/gi, "max-width:100%;");
          return match;
        }
      );
      newContent = newContent.replace(/<br[^>]*\/>/gi, "");
      newContent = newContent.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
      );
      return newContent;
    },
    // 景点id
    getProductId(row) {
      this.goods_modals = false;
      let arr = this.formValidate.recommend_list.concat(row);
      this.formValidate.recommend_list = this.uniques(arr);
    },
    changeGoods() {
      this.goods_modals = true;
      this.$refs.goodslist.getList();
      this.$refs.goodslist.goodsCategory();
    },
    uniques(songs) {
      let result = {};
      let finalResult = [];
      for (let i = 0; i < songs.length; i++) {
        result[songs[i].product_id] = songs[i];
      }
      for (let item in result) {
        finalResult.push(result[item]);
      }
      return finalResult;
    },
    handleRemoveRecommend(i) {
      this.formValidate.recommend_list.splice(i, 1);
    },
  },
};
</script>
<style scoped lang="stylus">
.list-group {
  margin-left: -8px;
}

.borderStyle {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
}

.drag {
  cursor: move;
}

.move-icon {
  width: 30px;
  cursor: move;
  margin-right: 10px;
}

.move-icon .icondrag2 {
  font-size: 26px;
  color: #d8d8d8;
}

.maxW /deep/.ivu-select-dropdown {
  max-width: 600px;
}

#shopp-manager .ivu-table-wrapper {
  border-left: 1px solid #dcdee2;
  border-top: 1px solid #dcdee2;
}

.noLeft {
  >>> .ivu-form-item-content {
    margin-left: 0 !important;
  }
}

#shopp-manager .ivu-form-item {
  position: relative;
}

#shopp-manager .ivu-form-item .tips {
  position: absolute;
  color: #999;
  top: 29px;
  left: -77px;
  font-size: 12px;
}

.iview-video-style {
  width: 40%;
  height: 180px;
  border-radius: 10px;
  background-color: #707070;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.iview-video-style .iconv {
  color: #fff;
  line-height: 180px;
  width: 50px;
  height: 50px;
  display: inherit;
  font-size: 26px;
  position: absolute;
  top: -74px;
  left: 50%;
  margin-left: -25px;
}

.iview-video-style .mark {
  position: absolute;
  width: 100%;
  height: 30px;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

.submission {
  margin-left: 10px;
}

.color-list .tip {
  color: #c9c9c9;
}

.color-list .color-item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  color: #fff;
  margin-right: 10px;
}

.color-list .color-item.blue {
  background-color: #1E9FFF;
}

.color-list .color-item.yellow {
  background-color: rgb(254, 185, 0);
}

.color-list .color-item.green {
  background-color: #009688;
}

.color-list .color-item.red {
  background-color: #ed4014;
}

.columnsBox {
  margin-right: 10px;
}

.priceBox {
  width: 100%;
}

.rulesBox {
  display: flex;
  flex-wrap: wrap;
}

.pictrueBox {
  display: inline-block;
}

.pictrueTab {
  width: 40px !important;
  height: 40px !important;
}

.pictrue {
  width: 60px;
  height: 60px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  margin-right: 15px;
  display: inline-block;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  .btndel {
    position: absolute;
    z-index: 1;
    width: 20px !important;
    height: 20px !important;
    left: 46px;
    top: -4px;
  }
}

.upLoad {
  width: 58px;
  height: 58px;
  line-height: 58px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

.curs {
  cursor: pointer;
}

.inpWith {
  width: 60%;
}

.labeltop {
  >>> .ivu-form-item-label {
    float: none !important;
    display: inline-block !important;
    margin-left: 120px !important;
    width: auto !important;
  }
}

.video-icon {
  background-image: url('https://cdn.oss.9gt.net/prov1.1/1/icons.png'); // cdn.oss.9gt.net/prov1.1/1/icons.png);
  background-color: #fff;
  background-position: -9999px;
  background-repeat: no-repeat;
}

.see {
  color: #2d8cf0;
  cursor: pointer;
}

.trip {
  color: #bbb;
  margin-bottom: 10px;
}

.virtual-data {
  display: flex;
  align-items: center;
}

.add-more {
  margin-top: 20px;
  display: flex;
}

.virtual-title {
  width: 50px;
}

.scroll-virtual {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 10px;
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;

  .clear, .submit {
    padding: 10px 20px;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
  }

  .clear {
    background-color: #ccc;
    margin-right: 20px;
  }

  .submit {
    background-color: #2d8cf0;
  }
}

.picBox {
  display: flex;
}

.btndel {
  position: absolute;
  z-index: 9;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}

.ifam {
  width: 344px;
  height: 644px;
  background: url('../../../assets/images/phonebg.png') no-repeat center top;
  background-size: 344px 644px;
  padding: 40px 20px;
  padding-top: 50px;
  margin: 0 auto;

  .content {
    height: 560px;
    overflow: hidden;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
  }

  .content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
<style scoped lang="stylus">
/deep/.ivu-date-picker {
  width: 300px;
}

.virtual_boder {
  border: 1px solid #1890FF;
}

.virtual_boder2 {
  border: 1px solid #E7E7E7;
}

.virtual_san {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-bottom: 26px solid #1890FF;
  border-left: 26px solid transparent;
}

.virtual_dui {
  position: absolute;
  bottom: -2px;
  right: 2px;
  color: #FFFFFF;
  font-family: system-ui;
}

.virtual {
  width: 120px;
  height: 60px;
  background: #FFFFFF;
  border-radius: 3px;
  // border: 1px solid #E7E7E7;
  float: left;
  text-align: center;
  padding-top: 8px;
  position: relative;
  cursor: pointer;
  line-height: 23px;

  .virtual_top {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }

  .virtual_bottom {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }
}

.virtual:nth-child(2n) {
  margin: 0 12px;
}

.addfont {
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  color: #1890FF;
  margin-left: 14px;
  cursor: pointer;
}

.titTip {
  display: inline-bolck;
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  margin-top: 14px;
}

.videbox {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px dashed #DDDDDD;
  line-height: 50px;
  text-align: center;
  color: #898989;
  font-size: 30px;
  font-weight: 400;
  cursor: pointer;
}

.addCustom_content {
  margin-top: 20px;

  .custom_box {
    margin-bottom: 10px;
  }
}

.addCustomBox {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 400;
  color: #1890FF;

  .btn {
    cursor: pointer;
    width: max-content;
  }
}

.type-radio {
  margin-buttom: 10px;
}

.deteal-btn {
  color: #5179ea;
}

.stock-disk {
  margin: 10px 0;
}

.line {
  border-bottom: 1px dashed #eee;
  margin-bottom: 20px;
}

.labelInput {
  border: 1px solid #dcdee2;
  width: 20%;
  padding: 0 5px;
  border-radius: 5px;
  min-height: 30px;
  cursor: pointer;

  .span {
    color: #c5c8ce;
  }

  .iconxiayi {
    font-size: 12px;
  }
}

#shopp-manager /deep/.ivu-form-item-content {
  line-height: 33px !important;
}

#selectvideo /deep/.ivu-form-item-content {
  line-height: 0px !important;
}

.progress {
  margin-top: 10px;
}
</style>