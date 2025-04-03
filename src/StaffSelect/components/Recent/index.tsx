import { useEffect, useState } from 'react';
import UserItem from '../UserItem';
import UsersBox from '../UsersBox';

const Recent = (props: any) => {
  const {
    getRecentUsersApi,
    selectOptionValueRender,
    selectVal,
    userTitleRender,
    userDescRender,
  } = props;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRecentUsersApi()
      .then((res: any) => {
        setUsers(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <span>清空所有</span>
      <UsersBox loading={loading} empty={users.length < 1}>
        <div>
          {users.map((item) => {
            const itemValue = selectOptionValueRender(item);
            const selectedValues = selectVal.map((i) => i.value);
            return (
              <UserItem
                key={itemValue}
                checked={selectedValues.includes(itemValue)}
                userTitleRender={() => userTitleRender(item)}
                userDescRender={() => userDescRender(item)}
              />
            );
          })}
        </div>
      </UsersBox>
    </div>
  );
};

export default Recent;
