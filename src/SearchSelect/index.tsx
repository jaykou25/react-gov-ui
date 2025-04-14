import type { SelectProps } from 'antd';
import { Select } from 'antd';
import React, { useCallback, useState } from 'react';

interface SearchSelectProps extends Omit<SelectProps, 'options' | 'onChange'> {
  api: (keyword: string) => Promise<any[]>; // 搜索接口，返回 Promise
  value: any | any[]; // 受控组件的值
  onChange: (value: any | any[], options: any) => void; // 受控组件的回调
  selectOptionLabelRender?: (item: any) => string; // 转换下拉项 label 的函数
  selectOptionValueRender?: (item: any) => string | number; // 转换下拉项 value 的函数
  selectInputLabelRender?: (
    label: string | number | React.ReactNode | undefined,
  ) => string | number; // 转换输入框显示的 label 的函数
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  api,
  value,
  onChange,
  selectOptionLabelRender = (item) => item.name || item.nickname, // 默认 label 渲染
  selectOptionValueRender = (item) => item.id, // 默认 value 渲染
  selectInputLabelRender = (label) => label, // 默认输入框 label 渲染
  mode,
  placeholder = '请输入搜索关键字',
  notFoundContent = '请输入搜索关键字',
  ...rest
}) => {
  const [options, setOptions] = useState<
    { label: string; value: string | number }[]
  >([]); // 转换后的下拉项

  // 搜索时调用接口
  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        // 如果搜索框为空，保留选中的项
        if (Array.isArray(value)) {
          // 多选模式
          setOptions(value);
        } else if (value) {
          // 单选模式
          setOptions([value]);
        } else {
          setOptions([]);
        }
        return;
      }

      try {
        const result = await api(keyword); // 调用接口
        const transformedOptions = result.map((item) => ({
          label: selectOptionLabelRender(item),
          value: selectOptionValueRender(item),
        }));
        setOptions(transformedOptions);
      } catch (error) {
        console.error('搜索接口调用失败:', error);
      }
    },
    [api, value, selectOptionLabelRender, selectOptionValueRender],
  );

  // 选中下拉项时的回调
  const handleChange = (selectedValue: any, options) => {
    onChange(selectedValue, options); // 触发父组件的 onChange 回调
  };

  return (
    <Select
      showSearch
      mode={mode}
      placeholder={placeholder}
      filterOption={false} // 禁用默认的过滤行为
      onSearch={handleSearch} // 搜索时触发
      onChange={handleChange} // 选中时触发
      options={options} // 下拉项
      allowClear
      labelInValue
      value={value} // 受控组件的值
      labelRender={(obj) => selectInputLabelRender(obj.label)} // 输入框显示的 label 渲染
      style={{ width: '100%' }}
      notFoundContent={notFoundContent}
      {...rest} // 透传其他属性
    />
  );
};

export default SearchSelect;
