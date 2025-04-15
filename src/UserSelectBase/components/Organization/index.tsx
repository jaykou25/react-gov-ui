import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

import UsersBox from '../UsersBox';
import './index.less';

const Organization = (props: any) => {
  const { getOrgUsersApi, getOrgTreeApi, userItemFunc } = props;

  const [userData, setUserData] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);

  const getTreeData = () => {
    setLoading(true);
    getOrgTreeApi()
      .then((res) => {
        setTreeData(res);

        // 设置展开一级的节点
        setExpandedKeys((res || []).map((item: any) => item.id));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setUserData([]);
    getTreeData();
  }, []);

  const onTreeSelect = async (keys: any, info: any) => {
    // 如果点击已选中的节点，直接返回，不执行取消选中
    if (info.selected === false) {
      return;
    }

    setSelectedKeys(keys);

    setRightLoading(true);
    const result = await getOrgUsersApi(info.node);

    setRightLoading(false);

    setUserData(result || []);
  };

  return (
    <>
      <div className="rgui-organization">
        <UsersBox loading={loading} empty={false} style={{ height: '350px' }}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            fieldNames={{ key: 'id' }}
            showLine
            switcherIcon={<DownOutlined />}
            selectedKeys={selectedKeys}
            onSelect={onTreeSelect}
            treeData={treeData}
          />
        </UsersBox>
        <UsersBox
          loading={rightLoading}
          empty={userData.length < 1}
          style={{ height: '350px' }}
        >
          {userData.map((item: any) =>
            userItemFunc({ item, style: { marginBottom: '10px' } }),
          )}
        </UsersBox>
      </div>
    </>
  );
};

export default Organization;
