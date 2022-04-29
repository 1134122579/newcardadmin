import request from "@/utils/request";

// 获取证书订单列表
export function getVipOrderList(data) {
  return request({
    url: "getVipOrderList",
    method: "post",
    data,
  });
}
export function setVipOrderRemark(data) {
  return request({
    url: "setVipOrderRemark",
    method: "post",
    data,
  });
}
export function delVipOrder(data) {
  return request({
    url: "delVipOrder",
    method: "post",
    data,
  });
}
export function getSelectCard(data) {
  return request({
    url: "getSelectCard",
    method: "get",
    data,
  });
}
export function returnVipOrder(data) {
  return request({
    url: "returnVipOrder",
    method: "post",
    data,
  });
}
export function exportVipOrder(data) {
  return request({
    url: "exportVipOrder",
    method: "post",
    data,
  });
}
export function setVipOrderStatus(data) {
  return request({
    url: "setVipOrderStatus",
    method: "post",
    data,
  });
}
export function batchAuditImport(data) {
  return request({
    url: "batchAuditImport",
    method: "post",
    data,
  });
}
