import { SchemaForm } from 'react-admin-kit';
import { SearchSelect } from 'react-gov-ui';
import { mockApi } from '../mock-api';

const ParentComponent = () => {
  return (
    <SchemaForm
      onFinish={console.log}
      submitter
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          renderFormItem: () => <SearchSelect api={mockApi} mode="multiple" />,
        },
      ]}
    />
  );
};

export default ParentComponent;
