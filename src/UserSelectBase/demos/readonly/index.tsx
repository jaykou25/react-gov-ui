import { Input } from 'antd';
import { useState } from 'react';
import { SchemaForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const CommonDoc = (props: any) => {
  const [val, setVal] = useState<any>();
  return (
    <div>
      <Input value={val} onChange={(e) => setVal(e.currentTarget.value)} />
      {props.baseForm()}
    </div>
  );
};

const BaseForm = () => {
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
        {
          title: 'age',
          dataIndex: 'age',
        },
      ]}
    />
  );
};

const Readonly = () => {
  const [val, setVal] = useState<any>();
  return (
    <div>
      <CommonDoc baseForm={() => <BaseForm />} />
    </div>
  );
};

export default Readonly;
