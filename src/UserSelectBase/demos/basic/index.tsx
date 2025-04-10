import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Basic = () => {
  return (
    <SchemaForm
      columns={[
        {
          title: '人员',
          dataIndex: 'user',
          initialValue: { value: 125, label: '高杰' },
          renderFormItem: () => (
            <UserSelect style={{ width: '200px' }} showRecent={false} />
          ),
        },
      ]}
    />
  );
};

export default Basic;
