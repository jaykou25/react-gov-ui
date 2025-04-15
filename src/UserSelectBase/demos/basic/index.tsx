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
      ]}
    />
  );
};

export default Basic;
