import { useRef } from 'react';
import { Button, ModalForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const ModalFormDemo = () => {
  const innerRef = useRef<any>(null);
  return (
    <div>
      <Button
        onClick={() =>
          innerRef.current.openModal('edit', {
            user: { label: 'hi', value: '120' },
          })
        }
      >
        open
      </Button>
      <ModalForm
        title="人员选择弹框"
        innerRef={innerRef}
        onFinish={console.log}
        columns={[
          {
            title: 'user',
            dataIndex: 'user',
            renderFormItem: () => <UserSelect />,
          },
        ]}
      />
    </div>
  );
};

export default ModalFormDemo;
