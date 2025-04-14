import { useState } from 'react';
import { SearchSelect } from 'react-gov-ui';

const mockApi = async (keyword: string): Promise<any> => {
  // 模拟接口请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const id1 = Date.now();
      const id2 = Date.now() + 1;
      resolve([
        { id: id1, name: `${keyword} - 选项1` },
        { id: id2, name: `${keyword} - 选项2` },
      ]);
    }, 200);
  });
};

const ParentComponent = () => {
  const [value, setValue] = useState<any | any[]>([]);

  return (
    <SearchSelect
      api={mockApi}
      value={value}
      onChange={setValue}
      mode="multiple" // 支持多选
    />
  );
};

export default ParentComponent;
