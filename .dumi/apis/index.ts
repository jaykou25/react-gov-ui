import request from '@/utils/request';

export async function queryCode() {
  return request('/api/verificationCode/getBase64Image');
}

export async function postLogin(data) {
  return request('/api/easyLogin', {
    method: 'post',
    data,
    noToken: true,
  });
}

export async function queryCurrent(): Promise<any> {
  return request('/api/sysUser/getUserInfo');
}

// 组织架构
export function getOrgTreeList(): Promise<any> {
  return request('/api/glOrg/getOrgTreeList');
}

// 人员查询
export function getOrgUser(params): Promise<any> {
  return request('/api/sysUser/selectUsers', { params });
}

// 最近常用用户信息表列表
export function getRecentUsers(params): Promise<any> {
  return request('/api/recentUserInfo/getList', { params });
}

export async function addRecentUsers(data): Promise<any> {
  return request('/api/recentUserInfo/add', {
    method: 'post',
    data,
  });
}

export async function delRecentUser(id: any): Promise<any> {
  return request(`/api/recentUserInfo/delete/${id}`, {
    method: 'post',
  });
}
