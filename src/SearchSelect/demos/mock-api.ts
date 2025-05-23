export const mockApi = async ({ keyword }): Promise<any> => {
  // 模拟接口请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const id1 = Date.now();
      const id2 = Date.now() + 1;
      resolve({
        total: 2,
        data: [
          { id: id1, name: `${keyword} - 选项1` },
          { id: id2, name: `${keyword} - 选项2` },
        ],
      });
    }, 500);
  });
};
