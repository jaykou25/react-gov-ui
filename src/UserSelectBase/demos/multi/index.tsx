import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Multi = () => {
  return (
    <SchemaForm
      columns={[
        {
          title: '人员多选',
          dataIndex: 'users',
          initialValue: [{ value: 125, label: '高杰' }],
          renderFormItem: () => (
            <UserSelect mode="multiple" style={{ width: '200px' }} />
          ),
        },
      ]}
    />
  );
};

export default Multi;
