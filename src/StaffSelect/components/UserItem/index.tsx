import { BorderOutlined, CheckSquareFilled } from '@ant-design/icons';
import { theme } from 'antd';
import { ReactNode } from 'react';
import './index.less';

const { useToken } = theme;

type UserItemProps = {
  onClick?: () => void;
  checked: boolean;
  userTitleRender: () => string | ReactNode;
  userDescRender: () => string | ReactNode;
  style?: any;
  className?: string;
  extra?: ReactNode;
};

const UserItem = (props: UserItemProps) => {
  const { onClick, checked } = props;
  const { token } = useToken();

  return (
    <div
      className={`rgui-user-item ${props.className || ''}`}
      onClick={onClick}
      style={props.style}
    >
      <div className="rgui-user-item-checkbox">
        {checked ? (
          <CheckSquareFilled
            style={{
              color: token.colorPrimary,
              fontSize: '16px',
            }}
          />
        ) : (
          <BorderOutlined
            style={{
              color: '#999',
              fontSize: '16px',
            }}
          />
        )}
      </div>
      <div className="rgui-user-item-user-main">
        <div>{props.userTitleRender()}</div>
        <div className="rgui-user-item-user-desc">{props.userDescRender()}</div>
      </div>
      {!!props.extra && (
        <div className="rgui-user-item-user-extra">{props.extra}</div>
      )}
    </div>
  );
};

export default UserItem;
