import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UsersBox from '../UsersBox';
import './index.less';
const { Search } = Input;

const SearchMember = (props: any) => {
  const { searchOrgUsersApi, userItemFunc } = props;
  const [val, setVal] = useState('');
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);
  const hasMore = total > userData.length;
  const requestIdRef = useRef(0);
  const isComposingRef = useRef(false);

  const handleSearch = () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    searchOrgUsersApi({ keyword: val, current: 1, pageSize })
      .then((res) => {
        if (currentRequestId === requestIdRef.current) {
          setUserData(res.data || []);
          setTotal(res.total || 0);
          setCurrent(1);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isComposingRef.current) return;

    if (val) {
      handleSearch();
    } else {
      ++requestIdRef.current;
      setUserData([]);
      setLoading(false);
    }
  }, [val]);

  const fetchMoreData = () => {
    const currentRequestId = ++requestIdRef.current;

    searchOrgUsersApi({ keyword: val, current: current + 1, pageSize }).then(
      (res) => {
        if (currentRequestId === requestIdRef.current) {
          setUserData((prev: any) => [...prev, ...(res.data || [])]);
          setTotal(res.total || 0);
          setCurrent(current + 1);
        }
      },
    );
  };

  return (
    <div className="rgui-search-member">
      <Search
        value={val}
        // 对于拼音输入法(IME)的各种事件触发顺序: onCompositionStart -> onChange -> onCompositionEnd
        onChange={(e) => {
          setVal(e.currentTarget.value);
        }}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
          handleSearch();
        }}
        placeholder="输入关键词搜索"
        enterButton
        allowClear
      />

      <UsersBox
        id="rguiSearchMemberUserBox"
        empty={userData.length < 1}
        loading={loading}
        style={{ marginTop: '15px', paddingLeft: '10px' }}
      >
        <InfiniteScroll
          scrollableTarget="rguiSearchMemberUserBox"
          dataLength={userData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div style={{ textAlign: 'center', color: '#acacac' }}>
              加载中...
            </div>
          }
        >
          <div className="rgui-search-content-grid">
            {userData.map((item: any) =>
              userItemFunc({ item, className: 'rgui-search-member-user-item' }),
            )}
          </div>
        </InfiniteScroll>
      </UsersBox>
    </div>
  );
};
export default SearchMember;
