import type { UserSelectProps } from 'react-gov-ui';
import { UserSelectBase } from 'react-gov-ui';

import {
  addRecentUsers,
  clearRecentUsers,
  delRecentUser,
  getOrgTreeList,
  getOrgUser,
  getRecentUsers,
} from '@/apis';
import request from '@/utils/request';

const UserSelect = (props: UserSelectProps) => {
  return (
    <UserSelectBase
      userDescLeftRender={(item) => item.userInfo.empNo}
      userDescRightRender={(item) => item.userInfo.orgName}
      getOrgUsersApi={({ searchValue, ...rest }) =>
        request('/api/sysUser/selectUsers', {
          params: {
            keyword: searchValue,
            ...rest,
          },
        })
      }
      getOrgUserApi={getOrgUser}
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
