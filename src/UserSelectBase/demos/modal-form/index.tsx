import { useRef } from 'react';
import { Button, ModalForm } from 'react-admin-kit';
import UserSelect from '../components/UserSelect';

const ModalFormDemo = () => {
  const innerRef = useRef<any>(null);
  return (
    <div>
      <Button onClick={() => innerRef.current.openModal('edit')}>open</Button>
      <ModalForm
        title="人员选择弹框"
        innerRef={innerRef}
        columns={[
          {
            title: 'user',
            dataIndex: 'user',
            renderFormItem: () => <UserSelect mode="multiple" />,
          },
        ]}
      />
    </div>
  );
};

export default ModalFormDemo;
