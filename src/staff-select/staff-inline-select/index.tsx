import { BusinessSelectBuilder } from "react-admin-kit";
import type { ApiType } from "react-admin-kit/dist/BusinessSelectBuilder/types";

const StaffInlineSelect = ({ api }: { api: ApiType["api"] }): any => {
  const BusinessSelect = BusinessSelectBuilder<"staff">({
    apis: [
      {
        api: api,
        type: "staff",
      },
    ],
  });

  return <BusinessSelect type="staff" />;
};

export default StaffInlineSelect;
