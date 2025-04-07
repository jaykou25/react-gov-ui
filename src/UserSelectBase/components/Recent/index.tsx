import { CloseOutlined } from '@ant-design/icons';
import { message, Popconfirm, theme } from 'antd';
import { useEffect, useState } from 'react';
import UsersBox from '../UsersBox';

const { useToken } = theme;

const Recent = (props: any) => {
  const {
    getRecentUsersApi,
    userItemFunc,
    clearRecentUsersApi,
    deleteRecentUserApi,
  } = props;

  const { token } = useToken();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentUsers = () => {
    setLoading(true);
    getRecentUsersApi()
      .then((res: any) => {
        setUsers(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecentUsers();
  }, []);

  const doDelRecentUser = (id: string) => {
    deleteRecentUserApi(id).then(() => {
      message.success('删除成功');
      fetchRecentUsers();
    });
  };

  const doClearRecentUsers = () => {
    clearRecentUsersApi().then(() => {
      message.success('清除成功');
      fetchRecentUsers();
    });
  };

  return (
    <div>
      <div
        style={{
          textAlign: 'end',
          cursor: 'pointer',
          color: token.colorPrimary,
        }}
      >
        <Popconfirm title="确定清空最近用户吗?" onConfirm={doClearRecentUsers}>
          <span>清空所有</span>
        </Popconfirm>
      </div>
      <UsersBox loading={loading} empty={users.length < 1}>
        {users.map((item: any) =>
          userItemFunc({
            item,
            style: { marginBottom: '10px' },
            extra: (
              <Popconfirm
                title="确定删除该最近用户吗?"
                onConfirm={() => doDelRecentUser(item.recentUserInfoId)}
              >
                <CloseOutlined />
              </Popconfirm>
            ),
          }),
        )}
      </UsersBox>
    </div>
  );
};

export default Recent;
