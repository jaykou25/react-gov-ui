import { Input, Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import UsersBox from '../UsersBox';
import './index.less';
const { Search } = Input;

const SearchMember = (props: any) => {
  const { searchOrgUsersApi, userItemFunc } = props;
  const [val, setVal] = useState('');
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const requestIdRef = useRef(0);

  const handleSearch = (params: any = {}) => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    searchOrgUsersApi({ keyword: val, current, pageSize, ...params })
      .then((res) => {
        if (currentRequestId === requestIdRef.current) {
          setUserData(res.data || []);
          setTotal(res.total || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (val) {
      handleSearch({ current: 1 });
    } else {
      ++requestIdRef.current;
      setUserData([]);
      setLoading(false);
    }
  }, [val]);

  const onPageChange = (page: number, pageSize: number) => {
    // 获取 UsersBox 的容器元素
    const container = document.querySelector(
      '.rgui-search-member .rgui-users-box',
    );
    if (container) {
      container.scrollTop = 0;
    }

    setCurrent(page);
    setPageSize(pageSize);
    if (val) {
      handleSearch();
    }
  };

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
        <Pagination
          style={{ padding: '15px 0' }}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          hideOnSinglePage
          showSizeChanger={false}
        />
      </UsersBox>
    </div>
  );
};
export default SearchMember;
