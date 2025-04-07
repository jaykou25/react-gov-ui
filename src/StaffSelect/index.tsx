import { UsergroupAddOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Tabs, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
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

export type StaffSelectProps = Omit<BusinessSelectProps<'staff'>, 'type'> & {
  readonly?: boolean;
  getOrgUsersApi: ApiType['api'];
  getOrgTreeApi: (params: any) => Promise<any[]>;
  getRecentUsersApi: (params: any) => Promise<any[]>;
  addRecentUsersApi: (data: any) => Promise<any>;
  userTitleRender?: (item: any) => string | ReactNode;
  userDescRender?: (item: any) => string | ReactNode;
  selectInputLabelRender?: (obj: any) => string | ReactNode;
  selectOptionLabelRender?: (item: any) => string;
  selectOptionValueRender?: (item: any) => string | number;
};

const StaffSelect = (props: StaffSelectProps) => {
  const {
    getOrgUsersApi,
    getOrgTreeApi,
    getRecentUsersApi,
    addRecentUsersApi,
    readonly,
    selectOptionLabelRender = (item) => item.nickname,
    selectOptionValueRender = (item) => item.id,
    userTitleRender = (item) => item.nickname,
    userDescRender = (item) => item.id,
    placeholder = '请输入关键字搜索',
    ...rest
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  // 选中的数据
  const [selectVal, setSelectVal] = useState<
    {
      value: string | number;
      label: string | number;
    }[]
  >([]);
  // 只记录单选项
  const selectValRef = useRef<any>({});
  // 控制 tab 切换
  const [tabKey, setTabKey] = useState<string>('1');

  // 弹窗确认函数
  const handleOk = () => {
    if (props.mode === 'multiple') {
      addRecentUsersApi(selectVal.map((i) => i.value)).then(() => {
        message.success('add');
      });
      if (props.onChange) props.onChange(selectVal, {});
    } else {
      addRecentUsersApi(selectVal.map((i) => i.value)).then(() => {
        message.success('add');
      });
      if (props.onChange) props.onChange(selectVal[0], {});
    }
    setModalOpen(false);
  };

  const shortLabelRender = (label?: string | number | ReactNode): any => {
    if (typeof label === 'object') return label;

    const _label = (label || '').toString();

    return _label.split(' ')[0];
  };

  const getDefaultVal = () => {
    const _val = props.value || [];
    return Array.isArray(_val) ? _val : [_val];
  };

  // 弹窗打开后保持正确的选中状态
  useEffect(() => {
    if (modalOpen) {
      setSelectVal(getDefaultVal());
    }
  }, [modalOpen]);

  // 只读模式
  if (readonly) {
    if (props.mode === 'multiple') {
      return (props.value || [])
        .map((item: any) => shortLabelRender(item.label))
        .join(', ');
    } else {
      return shortLabelRender(props.value?.label);
    }
  }

  const UserItemWithClick = (item: any) => {
    const itemValue = selectOptionValueRender(item);
    const selectedValues = selectVal.map((i) => i.value);

    const onCheckBoxChange = () => {
      const value = selectOptionValueRender(item);
      const label = selectOptionLabelRender(item);

      if (props.mode === 'multiple') {
        setSelectVal(
          selectVal.map((item) => item.value).includes(value)
            ? selectVal.filter((item) => item.value !== value)
            : [...selectVal, { label, value }],
        );
      } else {
        setSelectVal([{ label, value }]);
        selectValRef.current = item;
      }
    };

    return (
      <UserItem
        checked={selectedValues.includes(itemValue)}
        userTitleRender={() => userTitleRender(item)}
        userDescRender={() => userDescRender(item)}
        onClick={onCheckBoxChange}
      />
    );
  };

  return (
    <div className="rgui-staff-select">
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
          labelRender: (obj) => shortLabelRender(obj.label),
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
                  selectVal={selectVal}
                  selectValRef={selectValRef}
                  selectOptionValueRender={selectOptionValueRender}
                  selectOptionLabelRender={selectOptionLabelRender}
                  userTitleRender={userTitleRender}
                  userDescRender={userDescRender}
                  userItemFunc={UserItemWithClick}
                />
              ),
            },
            {
              key: '1',
              label: '组织架构',
              children: (
                <Organization
                  selectVal={selectVal}
                  setSelectVal={setSelectVal}
                  multiple={props.mode === 'multiple'}
                  selectValRef={selectValRef}
                  getOrgUserApi={getOrgUsersApi}
                  getOrgTreeApi={getOrgTreeApi}
                  selectOptionValueRender={selectOptionValueRender}
                  selectOptionLabelRender={selectOptionLabelRender}
                  userTitleRender={userTitleRender}
                  userDescRender={userDescRender}
                ></Organization>
              ),
            },
            {
              key: '2',
              label: '高级搜索',
              children: (
                <SearchMember
                  selectVal={selectVal}
                  setSelectVal={setSelectVal}
                  multiple={props.mode === 'multiple'}
                  selectValRef={selectValRef}
                  getOrgUserApi={getOrgUsersApi}
                  selectOptionValueRender={selectOptionValueRender}
                  selectOptionLabelRender={selectOptionLabelRender}
                  userTitleRender={userTitleRender}
                  userDescRender={userDescRender}
                ></SearchMember>
              ),
            },
          ]}
        />

        {/* 选中的tags */}
        <div className="rgui-tags-main">
          {selectVal.map((item) => {
            return (
              <Tag
                color="blue"
                key={item.value}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  setSelectVal(selectVal.filter((i) => i.value !== item.value));
                }}
              >
                {shortLabelRender(item.label)}
              </Tag>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default StaffSelect;
