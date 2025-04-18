import type { UserSelectProps } from 'react-gov-ui';
import { UserSelectBase } from 'react-gov-ui';

import {
  addRecentUsers,
  clearRecentUsers,
  delRecentUser,
  getOrgTreeList,
  getOrgUser,
  getOrgUsers,
  getRecentUsers,
} from '@/apis';

const UserSelect = (props: UserSelectProps) => {
  return (
    <UserSelectBase
      userDescLeftRender={(item) => item.userInfo.empNo}
      userDescRightRender={(item) => item.userInfo.orgName}
      getUsersApi={({ searchValue }) =>
        getOrgUsers({
          keyword: searchValue,
          current: 1,
          pageSize: 2000,
        })
      }
      getUserDetailApi={getOrgUser}
      getOrgTreeApi={getOrgTreeList}
      getOrgUsersApi={(node) => {
        return getOrgUsers({
          orgId: node.orgid,
          current: 1,
          pageSize: 2000,
        }).then((res) => res.data);
      }}
      searchOrgUsersApi={({ keyword }) =>
        getOrgUsers({ keyword, current: 1, pageSize: 2000 }).then(
          (res) => res.data,
        )
      }
      getRecentUsersApi={getRecentUsers}
      addRecentUsersApi={addRecentUsers}
      deleteRecentUserApi={delRecentUser}
      clearRecentUsersApi={clearRecentUsers}
      {...props}
    />
  );
};

export default UserSelect;
