import { UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tabs, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BusinessSelectBuilder } from 'react-admin-kit';
import Organization from './components/Organization';
import SearchMember from './components/SearchMember';

import type { SelectProps } from 'antd';
import type { ReactNode } from 'react';
import type { ApiType } from 'react-admin-kit/dist/BusinessSelectBuilder/types';

import './index.less';

type IProps = SelectProps & {
  readonly?: boolean;
  getOrgUserApi: ApiType['api'];
  getOrgTreeApi: (params: any) => Promise<any[]>;
  labelMapper?: (item: any) => string;
  valueMapper?: (item: any) => string;
};

const StaffSelect = (props: IProps) => {
  const {
    getOrgUserApi,
    getOrgTreeApi,
    readonly,
    labelMapper,
    valueMapper,
    placeholder = '请输入关键字搜索',
    labelInValue,
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
      if (props.onChange) props.onChange(selectVal, {});
    } else {
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

  const tabItems = [
    {
      key: '1',
      label: '组织架构',
      children: (
        <Organization
          selectVal={selectVal}
          setSelectVal={setSelectVal}
          multiple={props.mode === 'multiple'}
          labelRender={labelMapper}
          valueRender={valueMapper}
          shortLabelRender={shortLabelRender}
          selectValRef={selectValRef}
          getOrgUserApi={getOrgUserApi}
          getOrgTreeApi={getOrgTreeApi}
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
          labelRender={labelMapper}
          valueRender={valueMapper}
          selectValRef={selectValRef}
          getOrgUserApi={getOrgUserApi}
        ></SearchMember>
      ),
    },
  ];

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

  return (
    <div className="_staff-select">
      <Space.Compact style={{ width: '100%' }}>
        {BusinessSelectBuilder<'staff'>({
          apis: [
            {
              type: 'staff',
              api: getOrgUserApi,
            },
          ],
        })({
          type: 'staff',
          placeholder,
          ...rest,
          renderLabel: labelMapper,
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
          items={tabItems}
        />

        {/* 选中的tags */}
        <div className="orgTags">
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
