<template>
  <div class="app-container applist">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="100px"
        size="mini"
        class="demo-form-inline"
      >
        <el-form-item label="卡片名称:">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入输入名称"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus"
          >
            <!-- 用户状态 1 进行中 2 已结束 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份认证:" prop="is_auth">
          <el-radio-group
            v-model="listQuery.is_auth"
            size="mini"
            @change="selectStatus"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">需要</el-radio-button>
            <el-radio-button label="2">不需要</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否收费:" prop="is_free">
          <el-radio-group
            v-model="listQuery.is_free"
            size="mini"
            @change="selectStatus"
          >
            <el-radio-button label>全部</el-radio-button>

            <el-radio-button label="1">免费</el-radio-button>
            <el-radio-button label="2">付费</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人工审核:" prop="is_shehe">
          <el-radio-group
            v-model="listQuery.is_shehe"
            size="mini"
            @change="selectStatus"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">需要</el-radio-button>
            <el-radio-button label="2">不需要</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="卡片类型:" prop="type">
          <el-radio-group
            v-model="listQuery.type"
            @change="selectStatus"
            size="mini"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">时效卡</el-radio-button>
            <el-radio-button :label="2">包次卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
              class="starh_button"
              @click="handleempty"
              >清空</el-button
            >

            <el-button
              v-waves
              size="mini"
              type="success"
              class="starh_button"
              @click="handleAdd"
              >添加卡片</el-button
            >
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
          label="卡片名称"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="{ row }">
            <el-popover placement="top" width="300" trigger="hover">
              <div>
                <p>
                  名称：<span>{{ row.name }}</span>
                </p>
                <p>
                  卡片ID：<span>{{ row.card_id }}</span>
                </p>
                <p>
                  性别限制：<span v-if="row.sex == 0">不限制</span>
                  <span v-if="row.sex == 1">男</span>
                  <span v-if="row.sex == 2">女</span>
                </p>
                <p>
                  领取年龄：<span
                    >{{ row.min_age }}岁至{{ row.max_age }}岁</span
                  >
                </p>
                <p>
                  生效时间：<span>{{ row.start_time }}</span>
                </p>
                <p>
                  失效时间：<span>{{ row.time_out }}</span>
                </p>
                <p>
                  领取开始时间：<span>{{ row.start_receive_time }}</span>
                </p>
                <p>
                  领取截止时间：<span>{{ row.receive_time }}</span>
                </p>
              </div>
              <span slot="reference" style="color: #13ce66">{{
                row.name
              }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="卡片封面"
          align="center"
          :show-overflow-tooltip="true"
          width="160px"
        >
          <template slot-scope="{ row }">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="领取背景图"
          align="center"
          :show-overflow-tooltip="true"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-image :src="row.img" :preview-src-list="[row.img]"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="开门次数"
          width="110"
          align="center"
          prop="come_in_num"
          sortable
          min-width="60px"
        />
        <el-table-column label="金额" align="center" prop="price" sortable>
          <template slot-scope="{ row }">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="卡片类型"
          align="center"
          prop="type"
          sortable
          width="110"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.type | typeFilter" size="small" effect="dark">{{
              row.type | typeTextFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否收费"
          align="center"
          prop="is_free"
          sortable
          width="110"
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="row.is_free | typeFilter"
              size="small"
              effect="dark"
              >{{ row.is_free | freeFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="人工审核"
          min-width="110"
          align="center"
          prop="is_shehe"
          sortable
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="row.is_shehe | typeFilter"
              size="small"
              effect="dark"
              >{{ row.is_shehe | sheheFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="身份认证"
          width="110"
          align="center"
          prop="is_auth"
          sortable
        >
          <template slot-scope="{ row }">
            <el-tag
              :type="row.is_auth | typeFilter"
              size="small"
              effect="dark"
              >{{ row.is_auth | sheheFilter }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" sortable>
          <template slot-scope="{ row }">
            <el-tag :type="row.status | typeFilter" size="small" effect="dark">
              {{ row.status | statusFilter }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="分享" align="center" width="120">
          <template slot-scope="{ row }">
            <el-popover placement="top" width="220" trigger="click">
              <vue-qr
                :text="
                  'http://api.skyorange.cn/wxh5/deawcard?card_id=' + row.id
                "
                :size="200"
              ></vue-qr>
              <el-button slot="reference" size="mini">扫码分享</el-button>
            </el-popover>
          </template>
        </el-table-column>
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
          label="创建时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="240">
          <template slot-scope="{ row }">
            <el-button
              :type="row.status == 1 ? 'info' : 'success'"
              size="mini"
              @click="handleEditStatus(row.id, row.status)"
            >
              {{ row.status == 1 ? "停用" : "启用" }}</el-button
            >
            <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(row)"
              >删除</el-button
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
      top="2vh"
      width="62%"
    >
      <el-form
        :model="form"
        inline
        ref="fromdata"
        label-width="120px"
        :rules="rules"
        size="mini"
        class="fromdata"
      >
        <el-form-item class="form-title" label="卡片名称:" prop="name">
          <el-input
            v-model.trim="form.name"
            clearable
            placeholder="请输入卡片名称"
            :disabled="is_edit"
          />
        </el-form-item>
        <div>
          <el-form-item label="上传封面:" prop="cover">
            <el-upload
              class="avatar-uploader"
              :action="action"
              accept="png"
              :disabled="is_edit"
              v-loading="iscoverloading"
              :before-upload="beforecoverUpload"
            >
              <img v-if="form.cover" :src="form.cover" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip" style="color: #e6a23c">
                请上传封面！(只能是png格式,卡片提交后无法编辑)，尺寸750*448
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传领取背景:" prop="img">
            <el-upload
              class="avatar-uploader"
              :action="imgaction"
              accept="image/*"
              v-loading="isimgloading"
              :show-file-list="false"
              :on-success="handleImgAvatarSuccess"
            >
              <img v-if="form.img" :src="form.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip" style="color: #e6a23c">
                请上传卡片领取背景！尺寸750*1334 (高度尽量大于1334)
              </div>
            </el-upload>
          </el-form-item>
        </div>

        <div class="sharestyle">
          <el-form-item label="分享标题:" prop="title">
            <el-input
              v-model.trim="form.title"
              clearable
              placeholder="请输入分享标题"
              type="textarea"
              show-word-limit
              maxlength="80"
            />
          </el-form-item>
        </div>
        <div class="sharestyle">
          <el-form-item label="分享简介:" prop="content">
            <el-input
              v-model.trim="form.content"
              clearable
              placeholder="请输入分享简介"
              type="textarea"
              maxlength="80"
              show-word-limit
            />
          </el-form-item>
        </div>
        <!-- <el-form-item label="卡片状态:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="身份认证:" prop="is_auth">
          <el-radio-group
            v-model="form.is_auth"
            size="mini"
            :disabled="form.is_area == 1 || form.sex > 0 || is_edit"
          >
            <el-radio-button label="1">需要</el-radio-button>
            <el-radio-button label="2">不需要</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否收费:" prop="is_free">
          <el-radio-group
            v-model="form.is_free"
            size="mini"
            :disabled="is_edit"
          >
            <el-radio-button label="1">免费</el-radio-button>
            <el-radio-button label="2">付费</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="卡片金额:" v-if="form.is_free == 2" prop="price">
          <el-input-number
            :disabled="is_edit"
            v-model="form.price"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="人工审核:" prop="is_shehe">
          <el-radio-group
            :disabled="is_edit"
            v-model="form.is_shehe"
            size="mini"
          >
            <el-radio-button label="1">需要</el-radio-button>
            <el-radio-button label="2">不需要</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别限制:" prop="sex">
          <el-radio-group
            :disabled="is_edit"
            v-model="form.sex"
            size="mini"
            @change="sexchange"
          >
            <el-radio-button label="0">不限制</el-radio-button>
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域限定:" prop="is_area">
          <el-radio-group
            :disabled="is_edit"
            @change="areachange"
            v-model="form.is_area"
            size="mini"
          >
            <el-radio-button label="1">限定</el-radio-button>
            <el-radio-button label="2">不限定</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="限定条件:"
          v-if="form.is_area == 1"
          prop="area_card"
        >
          <el-select
            v-model="form.area_card"
            multiple
            :disabled="is_edit"
            filterable
            allow-create
            @change="area_cardchange"
            style="width: 162px"
            default-first-option
            placeholder="身份证前6位(可多选)"
          >
            <el-option
              v-for="item in area_cardoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="进门次数:" prop="come_in_num">
          <el-input-number
            v-model="form.come_in_num"
            :min="1"
            :disabled="is_edit"
          ></el-input-number>
          <span> 次/每日</span>
        </el-form-item>
        <el-form-item
          label="间隔时间:"
          v-if="form.come_in_num > 1"
          prop="jg_min"
        >
          <el-input-number
            :disabled="is_edit"
            v-model="form.jg_min"
            :min="1"
          ></el-input-number>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label="卡片类型:" prop="type">
          <el-radio-group v-model="form.type" size="mini" :disabled="is_edit">
            <el-radio-button :label="1">时效卡</el-radio-button>
            <el-radio-button :label="2">包次卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- send_num 发行张数 -->
        <el-form-item
          label="包次卡总次数:"
          prop="limit_num"
          v-if="form.type == 2"
        >
          <el-input-number v-model="form.limit_num" :min="1"></el-input-number>
          <span> 次</span>
        </el-form-item>
        <el-form-item label="发行总张数:" prop="send_num">
          <el-input-number v-model="form.send_num" :min="1"></el-input-number>
          <span> 张</span>
        </el-form-item>
        <div>
          <el-form-item label="最小年龄:" prop="min_age">
            <el-input-number
              v-model="form.min_age"
              :disabled="is_edit"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="最大年龄:" prop="max_age">
            <el-input-number
              v-model="form.max_age"
              :disabled="is_edit"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </div>

        <!-- <el-form-item label="开始时间:" prop="start_time">
          <el-date-picker
            clearable
            v-model="form.start_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择卡片开始时间"
            :disabled="is_edit"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间:" prop="time_out">
          <el-date-picker
            clearable
            v-model="form.time_out"
            type="datetime"
            value-format="timestamp"
            placeholder="选择卡片到期时间"
            :disabled="is_edit"
          >
          </el-date-picker>
        </el-form-item> -->
        <div class="user-hourstyle" style="display: flex">
          <el-form-item label="当日使用时间:" prop="min_use_hour">
            <el-time-select
              placeholder="起始时间"
              v-model="form.min_use_hour"
              @change="min_use_hourchange"
              :picker-options="{
                start: '08:00',
                step: '00:01',
                end: '22:00',
              }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item
            label="-"
            class="max_use_hour"
            label-width="10"
            prop="max_use_hour"
            :required="false"
          >
            <el-time-select
              placeholder="结束时间"
              v-model="form.max_use_hour"
              :picker-options="{
                start: '08:00',
                step: '00:01',
                end: '22:00',
                minTime: form.min_use_hour,
              }"
            >
            </el-time-select>
          </el-form-item>
        </div>
        <el-form-item
          label="卡片生效时间:"
          class="cardtimestyle"
          prop="cardtime"
        >
          <el-date-picker
            v-model="form.cardtime"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="timestamp"
            :unlink-panels="true"
            :disabled="is_edit"
            start-placeholder="卡片生效时间"
            end-placeholder="卡片过期时间"
            :default-time="['00:00:00']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="卡片领取时间:"
          class="cardtimestyle"
          prop="receivetime"
        >
          <el-date-picker
            clearable
            v-model="form.receivetime"
            :picker-options="pickerOptions"
            :unlink-panels="true"
            type="datetimerange"
            value-format="timestamp"
            start-placeholder="领取开始日期"
            end-placeholder="领取结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="卡片规则:"
          class="descstyle"
          prop="desc"
          style="width: 100%"
        >
          <el-input
            v-model="form.desc"
            clearable
            type="textarea"
            :disabled="is_edit"
            :rows="6"
            placeholder=" 请输入卡片规则"
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
  </div>
</template>
<script>
import {
  getCardList,
  addCard,
  editCard,
  create_vip_card,
  wx_uploadimg,
  setWxCardStatus,
  delete_vip_card,
  getQiniuToken,
  getAdvertSelect,
} from "@/api/createdcard";
import vueQr from "vue-qr";
import clipboard from "@/directive/clipboard/index.js";
import waves from "@/directive/waves"; // waves directive 123
// import Tinymce from "@/components/Tinymce/index";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getCardList",
  components: {
    Pagination,
    vueQr,
  },
  directives: {
    waves,
    clipboard,
  },
  filters: {
    //   type  1   时效卡 2 包次卡
    typeTextFilter(status) {
      const statusMap = {
        1: "时效卡",
        2: "包次卡",
      };
      return statusMap[status];
    },
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
    // 状态： 1 自动，2 手动
    statusFilter(status) {
      const statusMap = {
        1: "启用",
        2: "停用",
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
        3: "danger",
      };
      return statusMap[status];
    },
  },

  data() {
    const validateDate = (rule, value, callback) => {
      if (value) {
        let timestamp = new Date().getTime(); // 当前的时间戳
        timestamp = timestamp + 2 * 60 * 60 * 1000;
        if (value < timestamp) {
          callback(new Error("不能选择当前时间2个小时之前的时间"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const curDate = new Date().getTime() - 1 * 24 * 3600 * 1000;
          const day = 10 * 24 * 3600 * 1000;
          return time.getTime() < curDate;
        },
      },
      area_cardoptions: [],
      autosize: { minRows: 10, maxRows: 30 },
      iscoverloading: false,
      isimgloading: false,
      isvideoloading: false,
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
        name: [
          {
            required: true,
            message: "请输入卡包名称",
            trigger: "blur",
          },
        ],
        min_use_hour: [
          {
            required: true,
            message: "请选择开始使用时间",
            trigger: "blur",
          },
        ],
        max_use_hour: [
          {
            required: true,
            message: "请选择结束时间",
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
        jg_min: [
          {
            required: true,
            message: "请输入间隔时间",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择卡片类型",
            trigger: "blur",
          },
        ],
        send_num: [
          {
            required: true,
            message: "请输入发行张数",
            trigger: "blur",
          },
        ],
        limit_num: [
          {
            required: true,
            message: "请输入包次卡总次数",
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
        title: [
          {
            required: true,
            message: "请输入分享标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入分享简介",
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
        img: [
          {
            required: true,
            message: "请上传背景图",
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
        receivetime: [
          {
            required: true,
            trigger: "change",
            message: "选择领取时间",
          },
        ],
        cardtime: [
          {
            required: true,
            trigger: "change",
            message: "选择生效时间",
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
        sex: [
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
      imgaction: process.env.VUE_APP_BASE_API + "/upImage",
      action: process.env.VUE_APP_BASE_API + "/wx_uploadimg",
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
        type: "",
        pageSize: 10,
        is_free: "",
        is_shehe: "",
        is_auth: "",
        title: "",
        status: "",
        querydate: "",
      },
      adverlist: [],
      form: {
        name: "",
        sex: 0,
        is_auth: 1,
        price: "",
        status: 1,
        is_shehe: 2,
        cover: "",
        is_free: 1,
        is_area: 2,
        come_in_num: 1,
        jg_min: 15,
        type: 1,
        send_num: 1,
        limit_num: 1,
        max_age: 100,
        min_age: 0,
        start_time: "",
        time_out: "",
        receive_time: "",
        desc: "",
        receivetime: [],
        cardtime: [],
      }, //导入文件
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
    // this.getAdvertSelect();
  },
  methods: {
    area_cardchange(data) {
      console.log(data);
      let arr = data.filter((item) => {
        return /^\d{6}$/.test(item);
      });
      this.$set(this.form, "area_card", arr);
    },
    sexchange(data) {
      if (data > 0) {
        this.$set(this.form, "is_auth", 1);
      }
    },
    areachange(data) {
      if (data == 1) {
        this.$set(this.form, "is_auth", data);
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
    // 上传前
    beforeimgUpload(file) {
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
            _self.iscoverloading = false;
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
    },
    uploadFile(file) {
      const formdata = new FormData();
      formdata.append("file", file);
      this.postForm(formdata);
    },
    postForm(fomedata) {
      wx_uploadimg(fomedata).then((res) => {
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
    handleImgAvatarSuccess(res, file) {
      this.isimgloading = false;
      console.log(res);
      this.$set(this.form, "img", res.data.imgUrl);
    },
    //提交修改投票信息
    submitEditData() {
      editCard(this.form).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    min_use_hourchange() {
      this.$set(this.form, "max_use_hour", "");
    },
    submitAddData() {
      this.$refs["fromdata"].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          form["price"] = form["is_free"] == 2 ? form["price"] : 0;
          form["time_out"] = form["cardtime"][1] / 1000;
          form["start_time"] = form["cardtime"][0] / 1000;
          form["receive_time"] = form["receivetime"][1] / 1000;
          form["start_receive_time"] = form["receivetime"][0] / 1000;
          console.log(form);
          if (this.is_edit) {
            editCard(form).then((res) => {
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
      form["sex"] = form["sex"] || 0;
      form["area_card"] = form["area_card"]
        ? Array.isArray(form["area_card"])
          ? form["area_card"]
          : JSON.parse(form["area_card"])
        : "";
      form["cardtime"] = [
        new Date(form["start_time"]).getTime(),
        new Date(form["time_out"]).getTime(),
      ];
      form["receivetime"] = [
        new Date(form["start_receive_time"]).getTime(),
        new Date(form["receive_time"]).getTime(),
      ];
      this.form = form;
      this.dialogAddFormVisible = true;
    },
    //发起投票活动
    handleAdd() {
      this.ID = 0;
      this.form = {
        name: "",
        price: "",
        status: 1,
        is_shehe: 2,
        is_auth: 1,
        cover: "",
        is_free: 1,
        is_area: 2,
        jg_min: 15,
        come_in_num: 1,
        type: 1,
        send_num: 1,
        limit_num: 1,
        max_age: 100,
        min_age: 0,
        start_time: "",
        time_out: "",
        receive_time: "",
        desc: "",
        sex: 0,
        receivetime: [],
        cardtime: [],
      }; //导入文件
      this.dialogAddFormVisible = true;
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
      this.$confirm("此操作将修改卡片状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pstatus = status == 1 ? 2 : 1;
          setWxCardStatus({ id: id, status: pstatus }).then((response) => {
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
    handleDel(row) {
      this.$confirm(
        "此操作将会删除卡片下所有关联的会员请谨慎操作, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          console.log(213131, row);
          delete_vip_card({ ...row }).then((response) => {
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
      getCardList(this.listQuery).then((response) => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = list.map((item) => {
          item["receive_time"] = parseTime(item["receive_time"]);
          item["start_time"] = parseTime(item["start_time"]);
          item["time_out"] = parseTime(item["time_out"]);
          item["start_receive_time"] = parseTime(item["start_receive_time"]);
          return item;
        });
        this.total = response.data.pageInfo.total;
      });
    },
    handlestate() {
      this.listQuery.title = this.listQuery.title || "";
      this.getList();
    },
    handleempty() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        is_free: "",
        is_shehe: "",
        is_auth: "",
        title: "",
        status: "",
        querydate: "",
      };
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
.applist .fromdata .el-form-item--mini {
  min-width: 280px;
}
.max_use_hour .el-form-item__label::before {
  content: " " !important;
}
.descstyle .el-form-item__content {
  width: 75%;
}

.applist .fromdata .el-date-editor.el-input,
.applist .el-date-editor.el-input__inner {
  width: 160px;
}
.sharestyle .el-form-item--mini.el-form-item {
  min-width: 100%;
}
.sharestyle .el-form-item--mini.el-form-item .el-form-item__content {
  min-width: 70%;
}
.sharestyle,
.cardtimestyle {
  width: 100%;
}
.cardtimestyle .el-form-item__content .el-input__inner {
  min-width: 340px;
}
.form-title {
  width: 100%;
}
.numstyle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.videostyle {
  width: 320px;
  height: 176px;
}
.demonstration {
  display: inline-block;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
}
.textinput {
  width: 60%;
}
.search {
  margin-left: 30px;
}
.list_time {
  width: 88px;
}
.sarch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  width: 80px;
  height: 80px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 278px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 278px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>

<style lang="scss">
// 广告列
.adverlist {
  width: 100%;
  display: flex;
  padding-left: 0px;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;

  li {
    margin-bottom: 5px;
    width: 30%;
    margin-right: 10px;
    background: #ccc;
    box-sizing: border-box;
    padding: 6px;
    overflow: hidden;
    cursor: pointer;
    .adcver-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 30px;
    }
    img {
      width: 100%;
      height: 80px;
      display: block;
      object-fit: cover;
    }
  }
  .adver-sel {
    background: #13ce66;
  }
}
</style>
