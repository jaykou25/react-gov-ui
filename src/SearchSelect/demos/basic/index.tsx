import { getOrgUsers } from '@/apis';
import { SchemaForm } from 'react-admin-kit';
import { SearchSelect } from 'react-gov-ui';

const ParentComponent = () => {
  return (
    <SchemaForm
      onFinish={console.log}
      submitter
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          renderFormItem: () => (
            <SearchSelect
              api={({ keyword, current, pageSize }) =>
                getOrgUsers({
                  keyword,
                  current,
                  pageSize,
                })
              }
            />
          ),
        },
        {
          title: '人员禁用',
          dataIndex: 'userDisabled',
          renderFormItem: () => (
            <SearchSelect
              disabled
              api={({ keyword, current, pageSize }) =>
                getOrgUsers({
                  keyword,
                  current,
                  pageSize,
                })
              }
            />
          ),
        },
      ]}
    />
  );
};

export default ParentComponent;
