import { UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { BusinessSelectBuilder } from 'react-admin-kit';
import Organization from './components/Organization';
import Recent from './components/Recent';
import SearchMember from './components/SearchMember';

import type { ReactNode } from 'react';
import type {
  ApiType,
  BusinessSelectProps,
} from 'react-admin-kit/dist/BusinessSelectBuilder/types';

import UserItem from './components/UserItem';
import './index.less';

export type UserSelectBaseProps = Omit<BusinessSelectProps<'user'>, 'type'> & {
  readonly?: boolean;
  getOrgUsersApi: ApiType['api'];
  getOrgTreeApi: (params: any) => Promise<any[]>;
  getRecentUsersApi: (params: any) => Promise<any[]>;
  addRecentUsersApi: (data: any) => Promise<any>;
  deleteRecentUserApi: (id: any) => Promise<any>;
  clearRecentUsersApi: () => Promise<any>;
  userTitleRender?: (item: any) => string | ReactNode;
  userDescRender?: (item: any) => string | ReactNode;
  selectInputLabelRender?: (obj: any) => string | ReactNode;
  selectOptionLabelRender?: (item: any) => string;
  selectOptionValueRender?: (item: any) => string | number;
};

export type UserSelectProps = Omit<BusinessSelectProps<'user'>, 'type'> & {
  readonly?: boolean;
};

const UserSelectBase = (props: UserSelectBaseProps) => {
  const {
    getOrgUsersApi,
    getOrgTreeApi,
    getRecentUsersApi,
    addRecentUsersApi,
    deleteRecentUserApi,
    clearRecentUsersApi,
    readonly,
    selectOptionLabelRender = (item) => item.nickname,
    selectOptionValueRender = (item) => item.id,
    selectInputLabelRender = (label?: string | number | ReactNode) => label,
    userTitleRender = (item) => item.nickname,
    userDescRender = (item) => item.id,
    placeholder = '请输入关键字搜索',
    ...rest
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  // 选中的数据
  const [selectedVal, setSelectedVal] = useState<
    {
      value: string | number;
      label: string | number;
    }[]
  >([]);

  // 控制 tab 切换
  const [tabKey, setTabKey] = useState<string>('recent');

  // 弹窗确认函数
  const handleOk = () => {
    if (props.mode === 'multiple') {
      if (props.onChange) props.onChange(selectedVal, {});
    } else {
      if (props.onChange) props.onChange(selectedVal[0], {});
    }

    // 添加到常用人
    if (selectedVal.length > 0) {
      addRecentUsersApi(selectedVal.map((i) => i.value));
    }

    setModalOpen(false);
  };

  // 初始化 selectedValue
  useEffect(() => {
    let defaultSelectedVal = props.value || [];
    defaultSelectedVal = Array.isArray(defaultSelectedVal)
      ? defaultSelectedVal
      : [defaultSelectedVal];

    setSelectedVal(defaultSelectedVal);
  }, []);

  // 只读模式
  if (readonly) {
    if (props.mode === 'multiple') {
      return (props.value || [])
        .map((item: any) => selectInputLabelRender(item.label))
        .join(', ');
    } else {
      return selectInputLabelRender(props.value?.label);
    }
  }

  const UserItemWithClick = ({ item, ...rest }: any) => {
    const itemValue = selectOptionValueRender(item);
    const selectedValues = selectedVal.map((i) => i.value);

    const onCheckBoxChange = () => {
      const value = selectOptionValueRender(item);
      const label = selectOptionLabelRender(item);

      if (props.mode === 'multiple') {
        setSelectedVal(
          selectedVal.map((item) => item.value).includes(value)
            ? selectedVal.filter((item) => item.value !== value)
            : [...selectedVal, { label, value }],
        );
      } else {
        setSelectedVal([{ label, value }]);
      }
    };

    return (
      <UserItem
        key={itemValue}
        checked={selectedValues.includes(itemValue)}
        userTitleRender={() => userTitleRender(item)}
        userDescRender={() => userDescRender(item)}
        onClick={onCheckBoxChange}
        {...rest}
      />
    );
  };

  return (
    <div className="rgui-user-select">
      <Space.Compact style={{ width: '100%' }}>
        {BusinessSelectBuilder<'staff'>({
          apis: [
            {
              type: 'staff',
              pagination: true,
              api: getOrgUsersApi,
            },
          ],
        })({
          type: 'staff',
          placeholder,
          ...rest,
          renderLabel: selectOptionLabelRender,
          // 自定义当前选中的 label 内容, 这是 antd 属性
          labelRender: (obj) => selectInputLabelRender(obj.label),
          labelInValue: true,
          suffixIcon: null,
        })}
        <Button
          icon={<UsergroupAddOutlined />}
          onClick={() => setModalOpen(true)}
        ></Button>
      </Space.Compact>

      <Modal
        width={1000}
        maskClosable={false}
        title={'人员选择弹框'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
      >
        <Tabs
          activeKey={tabKey}
          onChange={(val) => {
            setTabKey(val);
          }}
          type="card"
          items={[
            {
              key: 'recent',
              label: '最近',
              children: (
                <Recent
                  getRecentUsersApi={getRecentUsersApi}
                  deleteRecentUserApi={deleteRecentUserApi}
                  clearRecentUsersApi={clearRecentUsersApi}
                  userItemFunc={UserItemWithClick}
                />
              ),
            },
            {
              key: '1',
              label: '组织架构',
              children: (
                <Organization
                  getOrgUserApi={getOrgUsersApi}
                  getOrgTreeApi={getOrgTreeApi}
                  userItemFunc={UserItemWithClick}
                ></Organization>
              ),
            },
            {
              key: '2',
              label: '高级搜索',
              children: (
                <SearchMember
                  getOrgUserApi={getOrgUsersApi}
                  userItemFunc={UserItemWithClick}
                ></SearchMember>
              ),
            },
          ]}
        />

        {/* 选中的tags */}
        <div className="rgui-tags-main">
          {selectedVal.map((item) => {
            return (
              <Tag
                color="blue"
                key={item.value}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  setSelectedVal(
                    selectedVal.filter((i) => i.value !== item.value),
                  );
                }}
              >
                {selectInputLabelRender(item.label)}
              </Tag>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default UserSelectBase;
