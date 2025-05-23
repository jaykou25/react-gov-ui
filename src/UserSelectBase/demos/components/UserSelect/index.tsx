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
  glUser,
  organizaTreeAllNoDept,
} from '@/apis';

const UserSelect = (props: UserSelectProps) => {
  return (
    <UserSelectBase
      selectOptionLabelRender={(item) =>
        `${item.nickname} (${item.userInfo.orgName})`
      }
      selectInputLabelRender={(label) => label.split(' ')[0]}
      userDescLeftRender={(item) => item.userInfo?.empNo}
      userDescRightRender={(item) => item.userInfo?.orgName}
      getUsersApi={({ keyword, current, pageSize }) =>
        getOrgUsers({
          keyword,
          current,
          pageSize,
        })
      }
      getUserDetailApi={getOrgUser}
      getOrgTreeApi={getOrgTreeList}
      getOrgUsersApi={({ node, current, pageSize }) => {
        return getOrgUsers({
          orgId: node.orgid,
          current: current,
          pageSize,
        });
      }}
      searchOrgUsersApi={({ keyword, current, pageSize }) =>
        getOrgUsers({ keyword, current, pageSize })
      }
      getRecentUsersApi={getRecentUsers}
      addRecentUsersApi={addRecentUsers}
      deleteRecentUserApi={delRecentUser}
      clearRecentUsersApi={clearRecentUsers}
      {...props}
    />
  );
};

// 用于三会决策
const UserSelect2 = (props: UserSelectProps & { deptId?: string | number }) => {
  return (
    <UserSelectBase
      userTitleRender={(item) => item.name}
      userDescLeftRender={(item) => item.empNo}
      userDescRightRender={(item) => item.orgName}
      selectOptionLabelRender={(item) => `${item.name} (${item.orgName})`}
      selectOptionValueRender={(item) => item.empId}
      selectInputLabelRender={(label) => label?.split(' ')[0]}
      getUsersApi={(keyword) => glUser({ name: keyword, orgId: props.deptId })}
      getUserDetailApi={getOrgUser}
      getOrgTreeApi={() =>
        organizaTreeAllNoDept({ parentId: props.deptId || '' })
      }
      getOrgUsersApi={(node) => glUser({ orgId: node.key })}
      searchOrgUsersApi={({ keyword }) =>
        glUser({ name: keyword, orgId: props.deptId })
      }
      getRecentUsersApi={getRecentUsers}
      addRecentUsersApi={addRecentUsers}
      deleteRecentUserApi={delRecentUser}
      clearRecentUsersApi={clearRecentUsers}
      tagColor="red"
      valueKey="empId"
      {...props}
    />
  );
};
export default UserSelect;
