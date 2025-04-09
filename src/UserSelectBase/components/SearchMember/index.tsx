import { Input } from 'antd';
import { useEffect, useState } from 'react';
import UsersBox from '../UsersBox';
import './index.less';
const { Search } = Input;

const SearchMember = (props: any) => {
  const { getOrgUserApi, userItemFunc } = props;
  const [val, setVal] = useState('');
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (val) {
      setLoading(true);
      getOrgUserApi({ keyword: val, pageSize: 1000, current: 1 })
        .then((res) => {
          setUserData(res.data || []);
        })
        .finally(() => setLoading(false));
    } else {
      setUserData([]);
      setLoading(false);
    }
  }, [val]);

  return (
    <div className="rgui-search-member">
      <Search
        value={val}
        onChange={(e) => setVal(e.currentTarget.value)}
        placeholder="输入关键词搜索"
        enterButton
        allowClear
      />

      <UsersBox
        empty={userData.length < 1}
        loading={loading}
        style={{ marginTop: '15px', paddingLeft: '10px' }}
      >
        <div className="rgui-search-content-grid">
          {userData.map((item: any) =>
            userItemFunc({ item, className: 'rgui-search-member-user-item' }),
          )}
        </div>
      </UsersBox>
    </div>
  );
};
export default SearchMember;
