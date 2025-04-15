import { useState } from 'react';
import UserSelect from '../components/UserSelect';

const Controlled = () => {
  const [value, setValue] = useState();

  return (
    <div>
      <UserSelect
        value={value}
        onChange={setValue}
        style={{ width: '200px' }}
      />
      <div>
        <h3>选中的值：</h3>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Controlled;
