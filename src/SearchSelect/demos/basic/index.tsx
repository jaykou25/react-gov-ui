import { SchemaForm } from 'react-admin-kit';
import { SearchSelect } from 'react-gov-ui';

const mockApi = async (keyword: string): Promise<any> => {
  // 模拟接口请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const id1 = Date.now();
      const id2 = Date.now() + 1;
      resolve([
        { id: id1, name: `${keyword} - 选项1` },
        { id: id2, name: `${keyword} - 选项2` },
      ]);
    }, 500);
  });
};

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
