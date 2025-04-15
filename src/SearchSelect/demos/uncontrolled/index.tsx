import { useState } from 'react';
import { SearchSelect } from 'react-gov-ui';
import { mockApi } from '../mock-api';

export default function () {
  const [value, setValue] = useState();

  return (
    <div>
      <SearchSelect onChange={setValue} api={mockApi} />
      <div>
        <h3>选中的值：</h3>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}
