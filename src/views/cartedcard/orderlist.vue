<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="100px"
        size="mini"
        class="demo-form-inline"
      >
        <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            placeholder="请输入姓名/手机号"
            class="filter-item"
            clearable
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="卡片名称:">
          <el-select
            v-model="listQuery.card_id"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in SelectCardlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录编号:">
          <el-input
            v-model="listQuery.order_no"
            placeholder="请输入记录编号"
            class="filter-item"
            clearable
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="listQuery.querydate"
            type="daterange"
            value-format="yyyy-MM-dd"
            :unlink-panels="true"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <div>
          <el-form-item label="支付方式:">
            <el-radio-group
              v-model="listQuery.pay_type"
              size="mini"
              @change="selectStatus"
            >
              <!-- 1 公众号支付  2 余额支付  3  免费赠送  4 优惠券 -->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button label="1">微信支付</el-radio-button>
              <el-radio-button label="3">免费赠送</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态:">
            <el-radio-group
              v-model="listQuery.status"
              size="mini"
              @change="selectStatus"
            >
              <!-- 用户状态 1 领取成功 2 待支付  3 已退款  4 退款失败  5 待审核 6 已审核 -->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button label="1">领取成功</el-radio-button>
              <el-radio-button label="2">待支付</el-radio-button>
              <el-radio-button label="3">已退款</el-radio-button>
              <el-radio-button label="4">退款失败</el-radio-button>
              <el-radio-button label="5">待审核</el-radio-button>
              <el-radio-button label="6">已审核</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" ">
            <el-button
              v-waves
              size="mini"
              type="primary"
              class="starh_button"
              @click="handleFilter"
              >搜索</el-button
            >
            <el-button
              v-waves
              size="mini"
              type="success"
              class="starh_button"
              @click="handleexportVipOrder"
              >导出会员信息</el-button
            >
            <el-button
              v-waves
              size="mini"
              type="warning"
              class="starh_button"
              @click="handleuploadOrder"
              >导入审核信息</el-button
            >
            <!-- <el-button
            v-waves
            size="mini"
            type="success"
            class="starh_button"
            @click="handleAdd"
            >添加卡片</el-button
          > -->
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card style="margin-top: 20px">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="编号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column
          label="记录编号"
          align="center"
          prop="order_no"
          sortable
          min-width="180px"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="头像" align="center" width="80">
          <template slot-scope="{ row }">
            <div>
              <el-avatar size="large" :src="row.headimgurl"></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户名"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="{ row }">
            <el-popover placement="top" width="300" trigger="hover">
              <div>
                <p>
                  卡片名称：<span>{{ row.card_name }}</span>
                </p>
                <p>
                  手机号：<span>{{ row.mobile }}</span>
                </p>
                <p>
                  订单编号：<span>{{ row.order_no }}</span>
                </p>
              </div>
              <span slot="reference" style="color: #13ce66">{{
                row.name
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="卡片名称"
          align="center"
          prop="card_name"
          sortable
          min-width="120px"
        >
        </el-table-column>
        <!-- <el-table-column
          label="卡片封面"
          align="center"
          :show-overflow-tooltip="true"
          width="200px"
        >
          <template slot-scope="{ row }">
            <el-image
              :src="row.headimgurl"
              :preview-src-list="[row.headimgurl]"
            ></el-image>
          </template>
        </el-table-column> -->
        <el-table-column
          label="金额"
          align="center"
          prop="price"
          sortable
          min-width="100px"
        >
        </el-table-column>
        <el-table-column
          label="支付方式"
          align="center"
          prop="status"
          min-width="120"
          sortable
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.pay_type | typeFilter" size="small">{{
              row.pay_type | payFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          min-width="120"
          sortable
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="row.status | typeFilter"
              size="small"
              @click="handleEditStatus(row.id, row.status)"
              >{{ row.status | statusFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="分享" align="center" width="120">
          <template slot-scope="{ row }">
            <el-popover placement="top" width="220" trigger="click">
              <vue-qr
                :text="
                  'http://api.skyorange.cn/wxvip/deawcard?card_id=' + row.id
                "
                :size="200"
              ></vue-qr>
              <el-button slot="reference" size="mini">扫码分享</el-button>
            </el-popover>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="复制" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag
              size="small"
              effect="dark"
              v-clipboard:copy="
                'http://api.skyorange.cn/mpqq/pre.html?id=' + row.id
              "
              v-clipboard:success="clipboardSuccess"
              >复制（查看）</el-tag
            >
          </template>
        </el-table-column> -->
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          label="领取时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="220">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="warning" size="mini" @click="handledelorder(row)"
              >删除</el-button
            >
            <el-button
              type="danger"
              :disabled="row.price <= 0 || row.status != 1"
              size="mini"
              @click="handleDel(row)"
              >退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 修改活动相关 -->
    <el-dialog
      :title="is_edit ? '编辑' : '添加'"
      :visible.sync="dialogAddFormVisible"
      center
      top="5vh"
      width="42%"
    >
      <el-form
        :model="form"
        inline
        ref="fromdata"
        label-width="120px"
        :rules="rules"
        size="mini"
        class="fromdata1"
      >
        <el-form-item
          label="备注:"
          class="descstyle"
          prop="remark"
          style="width: 100%"
        >
          <el-input
            v-model="form.remark"
            clearable
            type="textarea"
            :rows="6"
            placeholder=" 请输入备注"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddData()">
          {{ is_edit ? "立即修改" : "立即提交" }}</el-button
        >
      </div>
    </el-dialog>
    <!-- 上传审核订单 -->
    <el-dialog
      title="上传审核人员"
      :visible.sync="dialoguploadorderVisible"
      center
      top="5vh"
      width="42%"
    >
      <el-form
        :model="uploadform"
        inline
        ref="uploadOrder"
        label-width="120px"
        :rules="rules"
        size="mini"
      >
        <el-form-item label="卡片名称:" prop="card_id">
          <el-select
            v-model="uploadform.card_id"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in SelectCardlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="上传:"
          class="descstyle"
          prop="file"
          style="width: 100%"
        >
          <el-upload
            class="upload-demo"
            drag
            :headers="headers"
            :data="uploadform"
            ref="uploadorderfile"
            :limit="1"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :file-list="uploadorderfileList"
            :action="action"
            :on-success="uploadordersuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialoguploadorderVisible = false">取 消</el-button>
        <el-button type="primary" @click="submituploadorder()">
          立即提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getVipOrderList,
  addCard,
  setVipOrderRemark,
  create_vip_card,
  wx_uploadimg,
  setVipOrderStatus,
  delete_vip_card,
  getQiniuToken,
  batchAuditImport,
  getAdvertSelect,
  returnVipOrder,
  getSelectCard,
  exportVipOrder,
  delVipOrder,
} from "@/api/order";
import vueQr from "vue-qr";
import clipboard from "@/directive/clipboard/index.js";
import waves from "@/directive/waves"; // waves directive 123
// import Tinymce from "@/components/Tinymce/index";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth.js";
export default {
  name: "getVipOrderList",
  components: {
    Pagination,
    vueQr,
  },
  directives: {
    waves,
    clipboard,
  },
  filters: {
    freeFilter(status) {
      const statusMap = {
        1: "免费",
        2: "付费",
      };
      return statusMap[status];
    },
    sheheFilter(status) {
      const statusMap = {
        1: "需要",
        2: "不需要",
      };
      return statusMap[status];
    },
    payFilter(status) {
      // 1 公众号支付  2 余额支付  3  免费赠送  4 优惠券
      const statusMap = {
        1: "微信支付",
        2: "余额支付",
        3: "免费赠送",
        4: "优惠券",
      };
      return statusMap[status];
    },
    // 状态： 1 自动，2 手动
    //  1 领取成功 2 待支付  3 款  4退款失败  5 待审核 6 已审核
    statusFilter(status) {
      const statusMap = {
        1: "领取成功",
        2: "待支付",
        3: "已退款",
        4: "退款失败",
        5: "待审核",
        6: "已审核",
        7: "审核拒绝",
        8: "停用",
      };
      return statusMap[status];
    },
    // 状态： 1 自动，2 手动
    topFilter(status) {
      const statusMap = {
        1: "已置顶",
        2: "未置顶",
      };
      return statusMap[status];
    },
    // 状态颜色
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "info",
        4: "danger",
        5: "warning",
        6: "success",
        7: "info",
        8: "danger",
      };
      return statusMap[status];
    },
  },

  data() {
    return {
      dialoguploadorderVisible: false,
      area_cardoptions: [],
      autosize: { minRows: 10, maxRows: 30 },
      iscoverloading: false,
      isvideoloading: false,
      uploadorderfileList: [],
      headers: "",
      dataObj: {
        token: "",
        key: "",
        domain: "designvideo",
        config: {
          useCdnDomain: true,
        },
      },
      baseUrl: "",
      rules: {
        card_id: [
          {
            required: true,
            message: "请选择卡片名称",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入卡包名称",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur",
          },
        ],
        is_auth: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        is_area: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],
        is_free: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
          },
        ],

        is_shehe: [
          {
            required: true,
            message: "请选择是否审核",
            trigger: "blur",
          },
        ],
        cover: [
          {
            required: true,
            message: "请上传封面",
            trigger: "blur",
          },
        ],
        come_in_num: [
          {
            required: true,
            message: "请输入次数",
            trigger: "blur",
          },
        ],
        max_age: [
          {
            required: true,
            message: "请输入最大年龄",
            trigger: "blur",
          },
        ],
        min_age: [
          {
            required: true,
            message: "请输入最小年龄",
            trigger: "blur",
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入文章简介",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "是否上架",
            trigger: "blur",
          },
        ],
        start_time: [
          {
            required: true,
            trigger: "blur",
            message: "选择开始时间",
          },
        ],
        time_out: [
          {
            required: true,
            trigger: "blur",
            message: "选择结束时间",
          },
        ],
        receive_time: [
          {
            required: true,
            trigger: "blur",
            message: "选择卡片领取截止时间",
          },
        ],
        area_card: [
          {
            required: true,
            trigger: "blur",
            message: "选择限制条件",
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入卡片规则",
            trigger: "blur",
          },
        ],
      },
      // action: process.env.VUE_APP_BASE_API + "/upImage",
      action: process.env.VUE_APP_BASE_API + "/batchAuditImport",
      tableKey: 0,
      list: null,
      total: 0,
      is_edit: false,
      listLoading: false,
      table: true,
      status: "全部",
      disabled: "false",
      listQuery: {
        page: 1,
        pay_type: "",
        pageSize: 10,
        title: "",
        status: "",
        userinfo: "",
        querydate: "",
      },
      adverlist: [],
      uploadform: {
        card_id: "",
      },
      form: {
        name: "",
        is_auth: 1,
        price: "",
        status: 1,
        is_shehe: 1,
        cover: "",
        is_free: 1,
        is_area: 2,
        come_in_num: 1,
        max_age: 100,
        min_age: 0,
        start_time: "",
        time_out: "",
        receive_time: "",
        desc: "",
        remark: "",
      }, //导入文件
      SelectCardlist: [],
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      imageloading: false,
    };
  },
  watch: {
    dialogAddFormVisible(newV, onlv) {
      if (!newV) {
        this.is_edit = false;
      }
    },
  },
  created() {
    this.getList();
    this.getSelectCard();
    let token = getToken();
    this.headers = {
      token,
    };
  },
  methods: {
    getSelectCard() {
      getSelectCard().then((res) => {
        console.log(res);
        this.SelectCardlist = res.data;
      });
    },
    area_cardchange(data) {
      console.log(data);
      let arr = data.filter((item) => {
        console.log(/^\d{6}$/.test(item));
        return /^\d{6}$/.test(item);
      });
      this.$set(this.form, "area_card", arr);
    },
    areachange(data) {
      if (data == 1) {
        this.$set(this.form, "is_shehe", data);
      }
    },
    adverClick(id) {
      if (this.form.advert_ids.includes(id)) {
        this.form.advert_ids = this.form.advert_ids.filter(
          (item) => item != id
        );
      } else {
        this.form.advert_ids.push(id);
      }
    },
    getAdvertSelect() {
      getAdvertSelect().then((response) => {
        this.adverlist = response.data;
      });
    },
    handlenewherf(id) {
      window.open("http://api.skyorange.cn/mpqq?id=" + id);
    },
    // numberchange() {
    //   let that = this;
    //   that.$set(
    //     that.form,
    //     "cover",
    //     that.form.video_url + "?vframe/jpg/offset/" + that.form.zhen_num
    //   );
    // },
    getVidDur(e) {
      // console.log(e);
      let that = this;
      //监听播放时间
      var video = document.getElementById("video");
      //使用事件监听方式捕捉事件
      video.addEventListener(
        "timeupdate",
        function () {
          var timeDisplay;
          var duration;
          //用秒数来显示当前播放进度
          timeDisplay = Math.floor(video.currentTime);
          duration = Math.floor(video.duration);
          that.$set(
            that.form,
            "cover",
            that.form.video_url + "?vframe/jpg/offset/" + timeDisplay
          );
          that.$set(that.form, "zhen_num", timeDisplay);
          console.log("总时长", duration);
          console.log("当前播放的时长", timeDisplay);
        },
        false
      );
    },
    // 审核上传成功
    uploadordersuccess() {
      this.dialoguploadorderVisible = false;
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.getList();
    },
    // 上传前
    beforeUpload(file) {
      const _self = this;
      this.isvideoloading = true;
      return new Promise((resolve, reject) => {
        getQiniuToken()
          .then((response) => {
            console.log(response);
            this.baseUrl = response.data.baseUrl;
            const token = response.data.upToken;
            _self._data.dataObj.token = token;
            _self._data.dataObj.key = new Date().getTime() + file.name;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
            _self.isvideoloading = false;
          });
      });
    },
    beforecoverUpload(file) {
      const _self = this;
      this.iscoverloading = true;
      //   const littleName = file.name.toLowerCase();
      const littleName = new Date().getTime() + ".png";
      const copyFile = new File([file], littleName);
      console.log(copyFile);
      this.uploadFile(copyFile);
      return false;
      return new Promise((resolve, rejebeforeUploadct) => {
        getQiniuToken()
          .then((response) => {
            console.log(response);
            this.baseUrl = response.data.baseUrl;
            const token = response.data.upToken;
            _self._data.dataObj.token = token;
            _self._data.dataObj.key = new Date().getTime() + "" + Math.random();
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
            _self.iscoverloading = false;
          });
      });
    },
    uploadFile(file) {
      const formdata = new FormData();
      formdata.append("file", file);
      this.postForm(formdata);
    },
    postForm(fomedata) {
      wx_uploadimg(fomedata).then((res) => {
        console.log("上传成功", res);
        this.iscoverloading = false;
        this.form.cover = res.data.url;
      });
    },

    //富文本编辑
    TinymceInput(value) {
      this.form.rule = value;
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.imageloading = true;
    },
    handleAvatarcoverSuccess(res, file) {
      console.log(res, file);
      this.iscoverloading = false;
      this.form.cover = res.data.url;
    },
    //提交修改投票信息
    submitEditData() {
      setVipOrderRemark(this.form).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    handleExceed() {
      this.$message({
        message: "一次只能上传一个",
        type: "warning",
      });
    },
    handleChange(file, fileList) {
      console.log(file, fileList);
      this.uploadorderfileList = fileList;
    },
    //上传审核
    submituploadorder() {
      this.$refs["uploadOrder"].validate((valid) => {
        if (valid) {
          if (this.uploadorderfileList.length > 0) {
            this.$refs.uploadorderfile.submit();
          } else {
            this.$message({
              message: "请选择文件",
              type: "error",
            });
          }
          //   batchAuditImport(this.uploadform).then((res) => {
          //     this.$message({
          //       message: "操作成功",
          //       type: "success",
          //     });
          //     this.getList();
          //   });
        } else {
          return false;
        }
      });
    },
    submitAddData() {
      let form = JSON.parse(JSON.stringify(this.form));
      //   if (form.is_area == 1) {
      //     form["area_card"] = form["area_card"].reduce((prev, cur) => {
      //       return prev + "|" + cur;
      //     }, "");
      //   }
      form["price"] = form["price"] || 0;
      form["time_out"] = form["time_out"] / 1000;
      form["start_time"] = form["start_time"] / 1000;
      form["receive_time"] = form["receive_time"] / 1000;
      console.log(form);
      this.$refs["fromdata"].validate((valid) => {
        if (valid) {
          if (this.is_edit) {
            setVipOrderRemark(form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          } else {
            addCard(form).then((res) => {
              this.dialogAddFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            });
          }
        }
      });
    },

    //修改会员信息
    handleEdit(row) {
      this.is_edit = true;
      let form = JSON.parse(JSON.stringify(row));
      console.log(row, form);
      form["area_card"] = form["area_card"]
        ? Array.isArray(form["area_card"])
          ? form["area_card"]
          : JSON.parse(form["area_card"])
        : "";
      form["time_out"] = new Date(form["time_out"]).getTime();
      form["start_time"] = new Date(form["start_time"]).getTime();
      form["receive_time"] = new Date(form["receive_time"]).getTime();
      this.form = form;
      console.log(this.form);
      this.dialogAddFormVisible = true;
    },
    //发起投票活动
    handleAdd() {
      this.ID = 0;
      this.form = {
        name: "",
        price: "",
        status: 1,
        is_shehe: 1,
        is_auth: 1,
        cover: "",
        is_free: 1,
        is_area: 2,
        come_in_num: 1,
        max_age: 100,
        min_age: 0,
        start_time: "",
        time_out: "",
        receive_time: "",
        desc: "",
        remark: "",
      }; //导入文件
      this.dialogAddFormVisible = true;
    },
    // 导入框 /
    handleuploadOrder() {
      this.dialoguploadorderVisible = true;
    },
    // 导出
    handleexportVipOrder() {
      if (!this.listQuery.card_id) {
        this.$message({
          message: "请先选择导出卡片名称",
          type: "error",
          duration: 1500,
        });
        return;
      }
      exportVipOrder(this.listQuery).then((res) => {
        console.log(res);
        const statusMap = {
          1: "领取成功",
          2: "待支付",
          3: "已退款",
          4: "退款失败",
          5: "待审核",
          6: "已审核",
          7: "审核拒绝",
          8: "停用",
        };
        const tHeader = [
          "领取编号",
          "卡片名称",
          "姓名",
          "身份证号",
          "手机号",
          "领取时间",
          "状态",
        ];
        let data = res.data.map((item) => {
          return [
            item["order_no"],
            item["card_name"],
            item["name"],
            item["idcard"],
            item["mobile"],
            item["create_time"],
            statusMap[item["status"]],
          ];
        });
        import("@/vendor/Export2Excel").then((excel) => {
          console.log(tHeader, data);

          excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: "领取记录", //非必填
            autoWidth: true, //非必填
            bookType: "xlsx", //非必填
          });
        });
      });
    },
    selectStatus() {
      this.getList();
    },
    clipboardSuccess() {
      this.$message({
        message: "复制成功,请手机微信打开",
        type: "success",
        duration: 1500,
      });
    },
    // 修改状态状态
    handleEditStatus(id, status) {
      if (status != 5) {
        return;
      }
      this.$confirm("此操作将修改订单状态, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过审核",
        cancelButtonText: "拒绝审核",
        type: "warning",
      })
        .then(() => {
          setVipOrderStatus({ id: id, status: 6 }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch((action) => {
          console.log(action);
          if (action === "cancel") {
            setVipOrderStatus({ id: id, status: 7 }).then((response) => {
              this.getList();
              this.$message({
                type: "success",
                message: "操作成功！",
              });
            });
          } else {
            this.$message({
              type: "info",
              message: "暂不审核",
            });
          }
        });
    },
    //删除活动
    handleDel(row) {
      this.$confirm("此操作将退款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          returnVipOrder({ ...row }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //删除活动
    handledelorder(row) {
      this.$confirm("此操作将删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row.is_del = 1;
          delVipOrder({ ...row }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 筛选项目
    selectProject(e) {
      this.form.projectId = e.project_id;
      this.form.project_name = e.project_name;
      this.getTempOption();
      this.getGroupOption();
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      console.log(123);
      getVipOrderList(this.listQuery).then((response) => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = list.map((item) => {
          item["receive_time"] = parseTime(item["receive_time"]);
          item["start_time"] = parseTime(item["start_time"]);
          item["time_out"] = parseTime(item["time_out"]);
          return item;
        });
        this.total = response.data.pageInfo.total;
      });
    },
    handlestate() {
      this.listQuery.title = this.listQuery.title || "";
      this.getList();
    },
    //筛选过滤
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style>
.el-form-item--mini {
  min-width: 280px;
}
.descstyle .el-form-item__content {
  width: 75%;
}
</style>
