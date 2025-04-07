import { BorderOutlined, CheckSquareFilled } from '@ant-design/icons';
import { theme } from 'antd';
import { ReactNode } from 'react';
import './index.less';

const { useToken } = theme;

type UserItemProps = {
  onClick?: () => void;
  item: any;
  checked: boolean;
  userTitleRender: (item: any) => string | ReactNode;
  userDescRender: (item: any) => string | ReactNode;
  userDescLeftRender: (item: any) => string;
  userDescRightRender: (item: any) => string;
  style?: any;
  className?: string;
  extra?: ReactNode;
};

const UserItem = (props: UserItemProps) => {
  const { onClick, checked, item } = props;
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
        <div>{props.userTitleRender(item)}</div>
        <div className="rgui-user-item-user-desc">
          {props.userDescRender ? (
            props.userDescRender(item)
          ) : (
            <div style={{ display: 'flex' }}>
              <span
                style={{ marginRight: '30px', width: '110px', flex: 'none' }}
              >
                {props.userDescLeftRender(item)}
              </span>
              <span
                title={item.userInfo.orgName}
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.userDescRightRender(item)}
              </span>
            </div>
          )}
        </div>
      </div>
      {!!props.extra && (
        <div className="rgui-user-item-user-extra">{props.extra}</div>
      )}
    </div>
  );
};

export default UserItem;
