import { addRecentUsers, getOrgTreeList, getRecentUsers } from '@/apis';
import request from '@/utils/request';
import { SchemaForm } from 'react-admin-kit';
import type { StaffSelectProps } from 'react-gov-ui';
import { StaffSelect as StaffSelectBase } from 'react-gov-ui';

// 先在本地封装一下
const StaffSelect = (props: StaffSelectProps) => {
  const {
    // getOrgTreeApi = () => getOrgUser({}),
    getOrgUsersApi: getOrgUserApi,
    getRecentUsersApi,
    userDescRender = (item) => (
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: '30px', width: '110px', flex: 'none' }}>
          {item.userInfo.empNo}
        </span>
        <span
          title={item.userInfo.orgName}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {item.userInfo.orgName}
        </span>
      </div>
    ),
    ...rest
  } = props;
  return (
    <StaffSelectBase
      userDescRender={userDescRender}
      getOrgUsersApi={({ current, searchValue, companyId, ...rest }) =>
        request('/api/sysUser/selectUsers', {
          params: {
            current,
            keyword: searchValue,
            companyId: companyId || window['_companyId'],
            ...rest,
          },
        })
      }
      getRecentUsersApi={getRecentUsers}
      getOrgTreeApi={getOrgTreeList}
      addRecentUsersApi={addRecentUsers}
      {...rest}
    />
  );
};

const Basic = () => {
  return (
    <SchemaForm
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          renderFormItem: () => <StaffSelect style={{ width: '200px' }} />,
        },
      ]}
    />
  );
};

export default Basic;
