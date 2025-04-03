import { Empty, Input } from 'antd';
import { useEffect, useState } from 'react';
import UserItem from '../UserItem';
import './index.less';
const { Search } = Input;

const SearchMember = (props) => {
  const {
    selectVal,
    setSelectVal,
    multiple,
    selectValRef,
    getOrgUserApi,
    selectOptionValueRender,
    selectOptionLabelRender,
    userTitleRender,
    userDescRender,
  } = props;
  const [val, setVal] = useState('');
  const [userData, setUserData] = useState<any>([]);

  useEffect(() => {
    if (val) {
      console.log('getOrgUserApi', getOrgUserApi);
      getOrgUserApi({ keyword: val, pageSize: 1000, current: 1 }).then(
        (res) => {
          setUserData(res.data || []);
        },
      );
    } else {
      setUserData([]);
    }
  }, [val]);

  const onCheckBoxChange = (item) => {
    const value = selectOptionValueRender(item);
    const label = selectOptionLabelRender(item);

    if (multiple) {
      setSelectVal(
        selectVal.map((item) => item.value).includes(value)
          ? selectVal.filter((item) => item.value !== value)
          : [...selectVal, { label, value }],
      );
    } else {
      setSelectVal([{ label, value }]);
      selectValRef.current = item;
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

      {userData.length > 0 ? (
        <div className="rgui-search-content-main">
          <div className="rgui-search-content-grid">
            {userData.map((item: any) => {
              const itemValue = selectOptionValueRender(item);
              const selectedValues = selectVal.map((i) => i.value);
              return (
                <div key={itemValue} className="rgui-search-member-user-item">
                  <UserItem
                    checked={selectedValues.includes(itemValue)}
                    userTitleRender={() => userTitleRender(item)}
                    userDescRender={() => userDescRender(item)}
                    onClick={() => onCheckBoxChange(item)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rightContent" style={{ justifyContent: 'center' }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
};
export default SearchMember;
