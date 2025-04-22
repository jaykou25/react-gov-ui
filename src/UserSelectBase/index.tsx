import { UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tabs, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import Organization from './components/Organization';
import Recent from './components/Recent';
import SearchMember from './components/SearchMember';

import type { ReactNode } from 'react';
import type { BusinessSelectProps } from 'react-admin-kit/dist/BusinessSelectBuilder/types';

import SearchSelect from 'react-gov-ui/SearchSelect';
import UserItem from './components/UserItem';
import './index.less';

export type UserSelectBaseProps = Omit<BusinessSelectProps<'user'>, 'type'> & {
  readonly?: boolean;
  getUsersApi: (params: {
    keyword: string;
    current: number;
    pageSize: number;
  }) => Promise<any[]>;
  getUserDetailApi: (id: any) => Promise<any>;
  getOrgTreeApi: (params: any) => Promise<any[]>;
  getOrgUsersApi: (params: {
    node: any;
    current: number;
    pageSize: number;
  }) => Promise<any[]>;
  searchOrgUsersApi: (params: {
    keyword: any;
    current: number;
    pageSize: number;
  }) => Promise<any[]>;
  getRecentUsersApi: (params: any) => Promise<any[]>;
  addRecentUsersApi?: (data: any) => Promise<any>;
  deleteRecentUserApi: (id: any) => Promise<any>;
  clearRecentUsersApi: () => Promise<any>;
  userTitleRender?: (item: any) => string | ReactNode;
  userDescRender?: (item: any) => string | ReactNode;
  userDescLeftRender?: (item: any) => string;
  userDescRightRender?: (item: any) => string;
  selectInputLabelRender?: (obj: any) => string | ReactNode;
  selectOptionLabelRender?: (item: any) => string;
  selectOptionValueRender?: (item: any) => string | number;
  tagColor?: string;
  showRecent?: boolean;
};

export type UserSelectProps = Omit<BusinessSelectProps<'user'>, 'type'> & {
  readonly?: boolean;
  tagColor?: string;
  showRecent?: boolean;
};

const UserSelectBase = (props: UserSelectBaseProps) => {
  const {
    getUsersApi,
    getUserDetailApi,
    getOrgTreeApi,
    getOrgUsersApi,
    searchOrgUsersApi,
    getRecentUsersApi,
    addRecentUsersApi,
    deleteRecentUserApi,
    clearRecentUsersApi,
    readonly,
    selectOptionLabelRender = (item) => item.nickname,
    selectOptionValueRender = (item) => item.id,
    selectInputLabelRender = (
      label?: string | number | ReactNode | undefined,
    ) => label,
    userTitleRender = (item) => item.nickname,
    userDescRender,
    userDescLeftRender = (item) => item.id,
    userDescRightRender = (item) => item.nickname,
    placeholder = '请输入关键字搜索',
    tagColor = 'blue',
    showRecent = true,
    ...rest
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  // 选中的数据
  const [selectedVal, setSelectedVal] = useState<
    {
      value: string | number;
      label: string | number;
      extra: string; // 用于 tooltip 显示
    }[]
  >([]);

  // 控制 tab 切换
  const [tabKey, setTabKey] = useState<string>(showRecent ? 'recent' : '1');

  const recentRef = useRef<any>(null);
  const isMountedRef = useRef(false);

  // 弹窗确认函数
  const handleOk = () => {
    if (props.mode === 'multiple') {
      if (props.onChange) props.onChange(selectedVal, {});
    } else {
      if (props.onChange) props.onChange(selectedVal[0], {});
    }

    setModalOpen(false);
  };

  const getUserTooltip = (item: any) => {
    const arr = [userDescLeftRender(item), userDescRightRender(item)].filter(
      (i) => !!i,
    );

    if (arr.length < 1) {
      return undefined;
    }

    return arr.join(' ');
  };

  useEffect(() => {
    const normalizeInitialValue = async () => {
      // 格式化成数组
      let defaultVal = props.value || [];
      defaultVal = Array.isArray(defaultVal) ? defaultVal : [defaultVal];

      // 忽略初始值
      if (isMountedRef.current) {
        // 添加到常用人
        if (defaultVal.length > 0 && addRecentUsersApi) {
          addRecentUsersApi(defaultVal.map((i) => i.value)).then(() => {
            recentRef.current?.fetchRecentUsers();
          });
        }
      }

      const updatedVal = await Promise.all(
        defaultVal.map(async (item: any) => {
          if (!item.extra) {
            try {
              const res = (await getUserDetailApi(item.value)) || {};
              return { ...item, extra: getUserTooltip(res) };
            } catch (error) {
              console.error('Failed to fetch user info:', error);
              return item;
            }
          }
          return item;
        }),
      );
      setSelectedVal(updatedVal);
    };

    if (!props.readonly) {
      normalizeInitialValue();
    }
  }, [props.value, props.readonly]);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // 缓存这个组件
  const UserItemWithClick = useCallback(
    ({ item, ...rest }: any) => {
      const itemValue = selectOptionValueRender(item);
      const selectedValues = selectedVal.map((i) => i.value);

      const onCheckBoxChange = () => {
        const value = selectOptionValueRender(item);
        const label = selectOptionLabelRender(item);
        const extra = getUserTooltip(item);

        let finalValue;
        if (props.mode === 'multiple') {
          finalValue = selectedVal.map((item) => item.value).includes(value)
            ? selectedVal.filter((item) => item.value !== value)
            : [...selectedVal, { label, value, extra }];
        } else {
          finalValue = [{ label, value, extra }];
        }

        setSelectedVal(finalValue);
      };

      return (
        <UserItem
          key={itemValue}
          item={item}
          checked={selectedValues.includes(itemValue)}
          userTitleRender={userTitleRender}
          userDescRender={userDescRender}
          userDescLeftRender={userDescLeftRender}
          userDescRightRender={userDescRightRender}
          onClick={onCheckBoxChange}
          {...rest}
        />
      );
    },
    [selectedVal],
  );

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

  const recentItem = {
    key: 'recent',
    label: '最近',
    children: (
      <Recent
        ref={recentRef}
        getRecentUsersApi={getRecentUsersApi}
        deleteRecentUserApi={deleteRecentUserApi}
        clearRecentUsersApi={clearRecentUsersApi}
        userItemFunc={UserItemWithClick}
      />
    ),
  };

  const orgItem = {
    key: '1',
    label: '组织架构',
    children: (
      <Organization
        getOrgUsersApi={getOrgUsersApi}
        getOrgTreeApi={getOrgTreeApi}
        userItemFunc={UserItemWithClick}
      ></Organization>
    ),
  };

  const searchItem = {
    key: '2',
    label: '高级搜索',
    children: (
      <SearchMember
        searchOrgUsersApi={searchOrgUsersApi}
        userItemFunc={UserItemWithClick}
      ></SearchMember>
    ),
  };
  const items = showRecent
    ? [recentItem, orgItem, searchItem]
    : [orgItem, searchItem];

  return (
    <div className="rgui-user-select">
      <Space.Compact style={{ width: '100%' }}>
        <SearchSelect
          api={getUsersApi}
          selectInputLabelRender={selectInputLabelRender}
          selectOptionLabelRender={selectOptionLabelRender}
          selectOptionValueRender={selectOptionValueRender}
          placeholder={placeholder}
          {...rest}
        />
        <Button
          icon={<UsergroupAddOutlined />}
          onClick={() => setModalOpen(true)}
        ></Button>
      </Space.Compact>

      <Modal
        width={1000}
        maskClosable={false}
        destroyOnClose
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
          items={items}
        />

        {/* 选中的tags */}
        <div className="rgui-tags-main">
          {selectedVal.map((item) => {
            return (
              <Tooltip key={item.value} title={item.extra || item.label}>
                <Tag
                  color={tagColor}
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
              </Tooltip>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default UserSelectBase;
