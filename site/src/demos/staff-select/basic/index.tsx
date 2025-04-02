import request from "@/utils/request";
import { StaffSelect } from "react-gov-ui";

const Basic = () => {
  return (
    <div>
      <StaffSelect
        api={({ current, searchValue, orgId, companyId }) =>
          request("/api/sysUser/selectUsers", {
            params: {
              current,
              keyword: searchValue,
              companyId: companyId || window["_companyId"],
              orgId,
            },
          })
        }
      />
    </div>
  );
};

export default Basic;
