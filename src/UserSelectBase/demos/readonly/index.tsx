import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Readonly = () => {
  return (
    <SchemaForm
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          initialValue: { value: 125, label: '高杰' },
          renderFormItem: () => (
            <UserSelect readonly style={{ width: '200px' }} />
          ),
        },
      ]}
    />
  );
};

export default Readonly;
