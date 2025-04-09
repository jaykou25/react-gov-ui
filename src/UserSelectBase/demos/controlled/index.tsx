import { useState } from 'react';
import UserSelect from '../components/UserSelect';

const Controlled = () => {
  const [value, setValue] = useState({ value: 125, label: '高杰' });

  return (
    <UserSelect value={value} onChange={setValue} style={{ width: '200px' }} />
  );
};

export default Controlled;
