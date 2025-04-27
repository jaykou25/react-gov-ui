import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Basic = () => {
  return (
    <SchemaForm
      submitter
      onFinish={console.log}
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          renderFormItem: () => <UserSelect style={{ width: '200px' }} />,
        },
        {
          title: '人员禁用',
          dataIndex: 'userDisabled',
          renderFormItem: () => (
            <UserSelect disabled style={{ width: '200px' }} />
          ),
        },
      ]}
    />
  );
};

export default Basic;
