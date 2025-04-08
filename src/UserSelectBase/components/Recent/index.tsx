import { CloseOutlined } from '@ant-design/icons';
import { message, Popconfirm, theme } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import UsersBox from '../UsersBox';

const { useToken } = theme;

// 定义 ref 方法的类型
interface RecentRef {
  fetchRecentUsers: () => void;
}

const Recent = forwardRef<RecentRef, any>((props, ref) => {
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

  // 使用 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    fetchRecentUsers,
  }));

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
                <CloseOutlined style={{ marginRight: '5px' }} />
              </Popconfirm>
            ),
          }),
        )}
      </UsersBox>
    </div>
  );
});

export default Recent;
