import request from "@/utils/request";

// 上传视频
export function addCard(data) {
  return request({
    url: "addCard",
    method: "post",
    data,
  });
}
export function create_vip_card(data) {
  return request({
    url: "addCard",
    method: "post",
    data,
  });
}
export function delete_vip_card(data) {
  return request({
    url: "delete_vip_card",
    method: "post",
    data,
  });
}
// 获取广告列表
export function getAdvertSelect() {
  return request({
    url: "getAdvertSelect",
    method: "get",
  });
}

// 获取视频号列表
export function getVideo(data) {
  return request({
    url: "getVideo",
    method: "post",
    data,
  });
}
export function wx_uploadimg(data) {
  return request({
    url: "wx_uploadimg",
    method: "post",
    data,
  });
}
export function setWxCardStatus(data) {
  return request({
    url: "setWxCardStatus",
    method: "post",
    data,
  });
}
export function editCard(data) {
  return request({
    url: "editCard",
    method: "post",
    data,
  });
}
export function delArticle(data) {
  return request({
    url: "delArticle",
    method: "post",
    data,
  });
}
export function getCardList(data) {
  return request({
    url: "getCardList",
    method: "post",
    data,
  });
}
export function getQiniuToken(params) {
  return request({
    url: "getQiniuToken",
    method: "get",
    params,
  });
}
