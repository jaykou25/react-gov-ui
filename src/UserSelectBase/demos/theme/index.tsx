import { ConfigProvider } from 'antd';
import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const Theme = () => {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#d4302f' },
      }}
    >
      <SchemaForm
        columns={[
          {
            title: '人员',
            dataIndex: 'user',
            initialValue: { value: 125, label: '高杰' },
            renderFormItem: () => (
              <UserSelect tagColor="red" style={{ width: '200px' }} />
            ),
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default Theme;
