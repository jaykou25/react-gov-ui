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
          initialValue: { value: 125, label: '高杰' },
          renderFormItem: () => <SearchSelect api={mockApi} />,
        },
      ]}
    />
  );
};

export default ParentComponent;
