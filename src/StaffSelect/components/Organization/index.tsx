import { DownOutlined } from '@ant-design/icons';
import { Empty, Spin, Tree } from 'antd';
import { useEffect, useState } from 'react';

import UserItem from '../UserItem';
import './index.less';

const Organization = (props: any) => {
  const {
    selectVal,
    setSelectVal,
    multiple,
    selectValRef,
    getOrgUserApi,
    getOrgTreeApi,
    selectOptionValueRender,
    selectOptionLabelRender,
    userTitleRender,
    userDescRender,
  } = props;

  const [userData, setUserData] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  const getTreeData = (id = '') => {
    setLoading(true);
    getOrgTreeApi()
      .then((res) => {
        setTreeData(res);
      })
      .finally(() => setLoading(false));
  };

  // 过滤
  const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  useEffect(() => {
    setUserData([]);
    getTreeData();
  }, []);

  const onTreeSelect = async (selectedKeys, info) => {
    setRightLoading(true);
    const result = await getOrgUserApi({
      orgId: info.node.orgid,
      current: 1,
      pageSize: 20000,
    });

    setRightLoading(false);

    setUserData(result.data || []);
  };

  const onCheckBoxChange = (item) => {
    const label = selectOptionLabelRender(item);
    const value = selectOptionValueRender(item);

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
    <>
      <div className="rgui-organization">
        <div className="left">
          <Spin spinning={loading}>
            <Tree
              fieldNames={{ key: 'id' }}
              height={350}
              style={{ minHeight: '350px' }}
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandedKeys={[]}
              onSelect={onTreeSelect}
              treeData={treeData}
            />
          </Spin>
        </div>
        <div className="right">
          <Spin spinning={rightLoading}>
            {userData.length > 0 ? (
              <div>
                {userData.map((item: any) => {
                  const itemValue = selectOptionValueRender(item);
                  const selectedValues = selectVal.map((i) => i.value);
                  return (
                    <UserItem
                      style={{ marginBottom: '10px' }}
                      key={itemValue}
                      checked={selectedValues.includes(itemValue)}
                      userTitleRender={() => userTitleRender(item)}
                      userDescRender={() => userDescRender(item)}
                      onClick={() => onCheckBoxChange(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Spin>
        </div>
      </div>
    </>
  );
};

export default Organization;
