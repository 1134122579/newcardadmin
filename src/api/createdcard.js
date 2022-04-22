import request from "@/utils/request";

// 上传视频
export function create_qishi_card(data) {
  return request({
    url: "create_qishi_card",
    method: "post",
    data,
  });
}
export function create_vip_card(data) {
  return request({
    url: "create_qishi_card",
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
export function setArticleStatus(data) {
  return request({
    url: "setArticleStatus",
    method: "post",
    data,
  });
}
export function editArticle(data) {
  return request({
    url: "editArticle",
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