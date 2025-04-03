import JSEncrypt from 'jsencrypt';
import { privateKey, publicKey } from '../../config/key';

// 加密
export function encrypt(txt: string = '') {
  const encryptor = new JSEncrypt({});
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) || ''; // 对需要加密的数据进行加密
}

// 解密
export function decrypt2(txt: string) {
  const encryptor = new JSEncrypt({});
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(txt);
}
