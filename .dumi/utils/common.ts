// 针对history路由, hash放在最后
export const fullPath = () => {
  const { pathname, search, hash } = window.location;
  return pathname + search + hash;
};
