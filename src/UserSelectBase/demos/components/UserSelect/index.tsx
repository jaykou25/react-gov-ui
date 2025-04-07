import type { UserSelectProps } from 'react-gov-ui';
import { UserSelectBase } from 'react-gov-ui';

import {
  addRecentUsers,
  clearRecentUsers,
  delRecentUser,
  getOrgTreeList,
  getRecentUsers,
} from '@/apis';
import request from '@/utils/request';

const UserSelect = (props: UserSelectProps) => {
  return (
    <UserSelectBase
      userDescRender={(item) => (
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
      )}
      getOrgUsersApi={({ searchValue, ...rest }) =>
        request('/api/sysUser/selectUsers', {
          params: {
            keyword: searchValue,

            ...rest,
          },
        })
      }
      getRecentUsersApi={getRecentUsers}
      getOrgTreeApi={getOrgTreeList}
      addRecentUsersApi={addRecentUsers}
      deleteRecentUserApi={delRecentUser}
      clearRecentUsersApi={clearRecentUsers}
      {...props}
    />
  );
};

export default UserSelect;
