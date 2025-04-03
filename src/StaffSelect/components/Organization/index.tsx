import {
  BorderOutlined,
  CheckSquareFilled,
  DownOutlined,
} from '@ant-design/icons';
import { Empty, Spin, theme, Tree } from 'antd';
import { useEffect, useState } from 'react';

import './index.less';

const { useToken } = theme;

const Organization = (props: any) => {
  const {
    selectVal,
    setSelectVal,
    multiple,
    labelRender,
    valueRender,
    shortLabelRender,
    selectValRef,
    getOrgUserApi,
    getOrgTreeApi,
  } = props;

  const [userData, setUserData] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  const { token } = useToken();

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

  const onCheckBoxchange = (item) => {
    const label = labelRender(item);
    const value = valueRender(item);

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
      <div className="organization">
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
                  const _val = valueRender(item);
                  const _label = labelRender(item);
                  return (
                    <div
                      className="rightItem"
                      key={_val}
                      onClick={() => {
                        onCheckBoxchange(item);
                      }}
                    >
                      {selectVal.map((i) => i.value).includes(_val) ? (
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
                      <span style={{ marginLeft: '7px' }}>
                        {shortLabelRender(_label)}
                      </span>
                    </div>
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
