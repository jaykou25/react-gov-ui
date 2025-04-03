import { LockTwoTone, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { FormInstance, message, theme } from 'antd';
import { history } from 'dumi';
import { useRef, useState } from 'react';
import { Button, SchemaForm } from 'react-admin-kit';

import { isLogin, setToken } from '@/utils/auth';

import { postLogin, queryCurrent } from '@/apis';
import { encrypt } from '@/utils/jsencrypt';
import FormCode from './components/form-code';
import LoginMessage from './components/login-message';
import './index.less';

const { useToken } = theme;

const Login = () => {
  const [status, setStatus] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useToken();

  const formRef = useRef<FormInstance>(null);
  const codeRef = useRef<any>(null);

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      password: encrypt(values.password),
    };
    setSubmitting(true);

    postLogin(payload)
      .then((res: any) => {
        setStatus(0);

        setToken(res);

        // 当前用户信息
        queryCurrent().then((currentUser) => {
          // 存在window上的全局数据, 有的class组件不能用useModel
          window['_isAdmin'] = (currentUser.roleList || []).some(
            (role) => role.tag === 'admin',
          );

          window['_companyId'] = currentUser.userInfo?.companyId;

          window['_orgId'] = currentUser.userInfo?.orgId;

          window['_userId'] = currentUser.userInfo?.userId;
        });

        message.success('登录成功');
      })
      .catch((e) => {
        codeRef.current?.resetCode();

        // 登录失败清除验证码
        formRef?.current?.setFieldsValue({ code: '' });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="loginContainer">
      <section className="top">
        <div className="header">
          <div
            className="flex-row align-center"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (!isLogin()) {
                // message.info('请先登录')
                return;
              }

              history.push('/');
            }}
          >
            <span className="title">React Gov UI</span>
          </div>
        </div>
        <div className="desc">{`欢迎登录 - 针对一些需要 token 的接口`}</div>
      </section>

      <section className="main">
        <LoginMessage status={status} submitting={submitting} />
        <SchemaForm
          grid
          isKeyPressSubmit
          colProps={{ span: 24 }}
          formRef={formRef}
          size="large"
          onFinish={handleSubmit}
          columns={[
            {
              dataIndex: 'username',
              fieldProps: {
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                autoFocus: true,
                placeholder: '用户名',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    // message: '请输入用户名!',
                  },
                ],
              },
            },
            {
              dataIndex: 'password',
              valueType: 'password',
              fieldProps: {
                prefix: (
                  <LockTwoTone
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                placeholder: '密码',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    // message: '请输入密码!',
                  },
                ],
              },
            },
            {
              dataIndex: 'code',
              colProps: { span: 16 },
              fieldProps: {
                prefix: (
                  <ProfileOutlined
                    style={{
                      color: token.colorPrimary,
                      fontSize: token.fontSize,
                    }}
                  />
                ),
                placeholder: '验证码',
              },
              formItemProps: {
                rules: [
                  {
                    required: true,
                    // message: '请输入验证码!',
                  },
                ],
              },
            },
            {
              dataIndex: 'verifyCode',
              colProps: { span: 8 },
              renderFormItem: () => <FormCode ref={codeRef} />,
            },
          ]}
        />
        <Button
          loading={submitting}
          size="large"
          block
          type="primary"
          onClick={() => {
            formRef.current?.submit();
          }}
        >
          提交
        </Button>
      </section>
    </div>
  );
};

export default Login;
