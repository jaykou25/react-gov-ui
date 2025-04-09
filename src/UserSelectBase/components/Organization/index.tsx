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

  const getTreeData = () => {
    setLoading(true);
    getOrgTreeApi()
      .then((res) => {
        setTreeData(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setUserData([]);
    getTreeData();
  }, []);

  const onTreeSelect = async (selectedKeys: any, info: any) => {
    setRightLoading(true);
    const result = await getOrgUsersApi({
      orgId: info.node.orgid,
    });

    setRightLoading(false);

    setUserData(result.data || []);
  };

  return (
    <>
      <div className="rgui-organization">
        <UsersBox loading={loading} empty={false} style={{ height: '350px' }}>
          <Tree
            fieldNames={{ key: 'id' }}
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={[]}
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
