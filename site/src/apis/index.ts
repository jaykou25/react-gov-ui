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
