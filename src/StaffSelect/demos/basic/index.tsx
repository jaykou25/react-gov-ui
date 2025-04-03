import { getOrgTreeList } from '@/apis';
import request from '@/utils/request';
import { SchemaForm } from 'react-admin-kit';
import { StaffSelect } from 'react-gov-ui';

const Basic = () => {
  return (
    <SchemaForm
      columns={[
        {
          title: 'number',
          dataIndex: 'code',
        },
        {
          title: '人员',
          dataIndex: 'user',
          renderFormItem: () => (
            <StaffSelect
              style={{ width: '200px' }}
              labelMapper={(item) =>
                `${item.nickname} (${item.userInfo.orgName})`
              }
              valueMapper={(item) => item.id}
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
            />
          ),
        },
      ]}
    />
  );
};

export default Basic;
