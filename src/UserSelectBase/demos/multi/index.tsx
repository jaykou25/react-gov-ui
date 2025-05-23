import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Multi = () => {
  return (
    <SchemaForm
      submitter
      onFinish={console.log}
      columns={[
        {
          title: '人员多选',
          dataIndex: 'users',
          renderFormItem: () => (
            <UserSelect mode="multiple" style={{ width: '200px' }} />
          ),
        },
      ]}
    />
  );
};

export default Multi;
