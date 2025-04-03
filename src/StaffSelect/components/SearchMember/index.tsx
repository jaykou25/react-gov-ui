import { BorderOutlined, CheckSquareFilled } from '@ant-design/icons';
import { Empty, Input, theme } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
const { Search } = Input;
const { useToken } = theme;

const SearchMember = (props) => {
  const {
    selectVal,
    setSelectVal,
    multiple,
    selectValRef,
    valueRender,
    labelRender,
    getOrgUserApi,
  } = props;
  const [val, setVal] = useState('');
  const [userData, setUserData] = useState<any>([]);
  const { token } = useToken();

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

  const onCheckBoxchange = (item) => {
    const value = valueRender(item);
    const label = labelRender(item);

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
        <div className="rightContent">
          {userData.map((item) => {
            const value = valueRender(item);
            return (
              <div
                className="rightItem"
                key={value}
                onClick={() => {
                  onCheckBoxchange(item);
                }}
              >
                {selectVal.map((i) => i.value).includes(value) ? (
                  <CheckSquareFilled
                    style={{
                      color: token.colorPrimary,
                      fontSize: '16px',
                    }}
                  />
                ) : (
                  <BorderOutlined
                    style={{
                      color: '#999',
                      fontSize: '16px',
                    }}
                  />
                )}
                <span style={{ marginLeft: '7px' }}>{labelRender(item)}</span>
              </div>
            );
          })}
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
