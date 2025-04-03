import { getOrgTreeList } from '@/apis';
import request from '@/utils/request';
import { SchemaForm } from 'react-admin-kit';
import type { StaffSelectProps } from 'react-gov-ui';
import { StaffSelect as StaffSelectBase } from 'react-gov-ui';

// 先在本地封装一下
const StaffSelect = (props: StaffSelectProps) => {
  const {
    labelMapper = (item) => `${item.nickname} (${item.userInfo.orgName})`,
    valueMapper = (item) => item.id,
    // getOrgTreeApi = () => getOrgUser({}),
    getOrgUserApi,
    ...rest
  } = props;
  return (
    <StaffSelectBase
      labelMapper={labelMapper}
      valueMapper={valueMapper}
      getOrgUserApi={({ current, searchValue, orgId, companyId }) =>
        request('/api/sysUser/selectUsers', {
          params: {
            current,
            keyword: searchValue,
            companyId: companyId || window['_companyId'],
            orgId,
          },
        })
      }
      getOrgTreeApi={getOrgTreeList}
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
