import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [current, setCurrent] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);
  const hasMore = total > userData.length;

  const selectedNodeRef = useRef<any>(null);

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

    // 获取 UsersBox 的容器元素
    const container = document.querySelector('#rguiOrgUserBox');
    if (container) {
      container.scrollTop = 0;
    }

    setSelectedKeys(keys);

    setRightLoading(true);
    selectedNodeRef.current = info.node;
    setCurrent(1);

    const result = await getOrgUsersApi({
      node: info.node,
      current: 1,
      pageSize,
    });

    setRightLoading(false);

    setUserData(result.data || []);
    setTotal(result.total || 0);
  };

  const fetchMoreData = () => {
    console.log('fetchMoreData', { current: current + 1 });

    getOrgUsersApi({
      node: selectedNodeRef.current,
      current: current + 1,
      pageSize,
    }).then((res) => {
      setUserData((prev: any) => [...prev, ...(res.data || [])]);
      setTotal(res.total || 0);
      setCurrent(current + 1);
    });
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
          id="rguiOrgUserBox"
          loading={rightLoading}
          empty={userData.length < 1}
          style={{ height: '350px' }}
        >
          <InfiniteScroll
            scrollableTarget="rguiOrgUserBox"
            dataLength={userData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div style={{ textAlign: 'center', color: '#acacac' }}>
                加载中...
              </div>
            }
          >
            {userData.map((item: any) =>
              userItemFunc({ item, style: { marginBottom: '10px' } }),
            )}
          </InfiniteScroll>
        </UsersBox>
      </div>
    </>
  );
};

export default Organization;
