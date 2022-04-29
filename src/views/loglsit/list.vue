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
        <!-- <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            placeholder="请输入姓名/手机号"
            class="filter-item"
            clearable
            size="mini"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item> -->
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
        <el-form-item label="类型:">
          <el-radio-group
            v-model="listQuery.type"
            size="mini"
            @change="selectStatus"
          >
            <!-- 1 添加 2 修改 3 删除 -->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">添加</el-radio-button>
            <el-radio-button label="2">修改</el-radio-button>
            <el-radio-button label="3">删除</el-radio-button>
            <el-radio-button label="4">导出</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            size="mini"
            type="primary"
            class="starh_button"
            @click="handleFilter"
            >搜索</el-button
          >
        </el-form-item>
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
          label="操作"
          align="center"
          prop="title"
          sortable
          min-width="180px"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="账号"
          align="center"
          prop="op"
          sortable
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          label="操作类型"
          align="center"
          prop="type"
          sortable
          width="120"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.type | typeFilter" size="small" effect="dark">{{
              row.type | statusFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" min-width="220">
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
        </el-table-column> -->
      </el-table>
    </el-card>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getLog } from "@/api/log";
import waves from "@/directive/waves"; // waves directive 123
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth.js";
export default {
  name: "getLog",
  components: {
    Pagination,
  },
  directives: {
    waves,
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
    // 1 添加 2 修改 3 删除
    statusFilter(status) {
      const statusMap = {
        1: "添加",
        2: "修改",
        3: "删除",
        4: "导出",
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
        querydate: "",
      },
      adverlist: [],
      uploadform: {
        card_id: "",
      },
      //导入文件
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
  },
  methods: {
    handlenewherf(id) {
      window.open("http://api.skyorange.cn/mpqq?id=" + id);
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

    // 获取地点列表
    getList() {
      this.listLoading = true;
      console.log(123);
      getLog(this.listQuery).then((response) => {
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
