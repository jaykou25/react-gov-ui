import { useState } from 'react';
import { SearchSelect } from 'react-gov-ui';

const mockApi = async (keyword: string): Promise<any> => {
  // 模拟接口请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: `${keyword} - 选项1` },
        { id: 2, name: `${keyword} - 选项2` },
      ]);
    }, 500);
  });
};

const ParentComponent = () => {
  const [value, setValue] = useState<any | any[]>([]);

  return <SearchSelect api={mockApi} value={value} onChange={setValue} />;
};

export default ParentComponent;
