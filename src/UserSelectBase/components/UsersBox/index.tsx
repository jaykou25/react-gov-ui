import { Empty, Spin } from 'antd';
import './index.less';

type UsersBoxProps = {
  loading?: boolean;
  empty?: boolean;
  className?: string;
  style?: any;
  children: any;
  id?: string;
};

const UsersBox = (props: UsersBoxProps) => {
  return (
    <div
      id={props.id}
      className={`rgui-users-box ${props.className || ''}`}
      style={props.style}
    >
      <Spin spinning={props.loading}>
        {props.empty ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          props.children
        )}
      </Spin>
    </div>
  );
};

export default UsersBox;
