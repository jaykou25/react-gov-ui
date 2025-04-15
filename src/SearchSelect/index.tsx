import type { SelectProps } from 'antd';
import { Select } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SearchSelectProps extends Omit<SelectProps, 'options' | 'onChange'> {
  api: (keyword: string) => Promise<any[]>; // 搜索接口，返回 Promise
  value?: any | any[]; // 受控组件的值
  onChange?: (value: any | any[], options: any) => void; // 受控组件的回调
  selectOptionLabelRender?: (item: any) => string; // 转换下拉项 label 的函数
  selectOptionValueRender?: (item: any) => string | number; // 转换下拉项 value 的函数
  selectInputLabelRender?: (
    label: string | number | React.ReactNode | undefined,
  ) => any; // 转换输入框显示的 label 的函数
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
  function valueToOptions() {
    if (value) {
      if (Array.isArray(value)) {
        return value;
      } else {
        return [value];
      }
    }

    return [];
  }

  const [internalValue, setInternalValue] = useState<any | any[]>(undefined); // 内部状态
  const [options, setOptions] = useState<
    { label: string; value: string | number }[]
  >(valueToOptions()); // 转换后的下拉项
  const optionsRef = useRef<any[]>(valueToOptions()); // 用于存储下拉项的引用，避免重复渲染
  const requestIdRef = useRef(0);

  useEffect(() => {
    optionsRef.current = options; // 更新下拉项的引用
  }, [options]);

  const isControlled = value !== undefined; // 判断是否为受控模式
  const $value = isControlled ? value : internalValue;

  // 搜索时调用接口
  const handleSearch = useCallback(
    async (keyword: string) => {
      const currentRequestId = ++requestIdRef.current;

      if (!keyword) {
        // 如果搜索框为空，保留选中的项
        if (Array.isArray($value)) {
          // 多选模式
          setOptions($value);
        } else if ($value) {
          // 单选模式
          setOptions([$value]);
        } else {
          setOptions([]);
        }
        return;
      }

      try {
        const result = (await api(keyword)) || []; // 调用接口
        const transformedOptions = result.map((item) => ({
          label: selectOptionLabelRender(item),
          value: selectOptionValueRender(item),
        }));

        // 如果没有搜索结果，保留选中的项
        if (transformedOptions.length === 0) {
          if (Array.isArray($value)) {
            // 多选模式
            transformedOptions.push(...$value); // 保留选中的项
          } else {
            // 单选模式
            transformedOptions.push($value); // 保留选中的项
          }
        }

        if (currentRequestId === requestIdRef.current) {
          setOptions(transformedOptions);
        }
      } catch (error) {
        console.error('搜索接口调用失败:', error);
      }
    },
    [api, $value, selectOptionLabelRender, selectOptionValueRender],
  );

  // 选中下拉项时的回调
  const handleChange = (selectedValue: any, options) => {
    if (isControlled) {
      onChange?.(selectedValue, options); // 触发父组件的 onChange 回调
    } else {
      setInternalValue(selectedValue); // 更新内部状态
    }
  };

  // $value 为空时，清空下拉项. eg: onClear 的时候
  // $value 变动时, 如果下拉项里没有选中的项，则清空下拉项. eg: 人员弹窗里选了一个其它的人员
  useEffect(() => {
    if (!$value) {
      setOptions([]);
    } else {
      if (Array.isArray($value)) {
        // 判断下拉项里是否有选中的项
        const allExist = $value.every((item) => {
          return optionsRef.current.find((option) => {
            return option.value === item.value;
          });
        });
        if (!allExist) {
          setOptions($value);
        }
      } else {
        // 单选模式
        const isExist = optionsRef.current.find((option) => {
          return option.value === $value.value;
        });
        if (!isExist) {
          setOptions([$value]);
        }
      }
    }
  }, [$value]);

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
      value={$value} // 根据模式选择受控或非受控值
      labelRender={(obj) => selectInputLabelRender(obj.label)} // 输入框显示的 label 渲染
      style={{ width: '100%' }}
      notFoundContent={notFoundContent}
      {...rest} // 透传其他属性
    />
  );
};

export default SearchSelect;
