import { UsergroupAddOutlined } from "@ant-design/icons";
import { Space, Button, Modal } from "antd";

import type { SelectProps } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import { BusinessSelectBuilder } from "react-admin-kit";

type IProps = SelectProps & { readonly?: boolean; api: any };

const StaffSelect = (props: IProps) => {
  const {
    api,
    readonly,
    placeholder = "请输入关键字搜索",
    labelInValue,
    ...rest
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  // 选中的数据
  const [selectVal, setSelectVal] = useState<
    {
      value: string | number;
      label: string | number;
    }[]
  >([]);

  const handleOk = () => {
    if (props.mode === "multiple") {
      if (props.onChange) props.onChange(selectVal, {});
    } else {
      if (props.onChange) props.onChange(selectVal[0], {});
    }
    setModalOpen(false);
  };

  const shortLabelRender = (label?: string | number | ReactNode): any => {
    if (typeof label === "object") return label;

    const _label = (label || "").toString();

    return _label.split(" ")[0];
  };

  return (
    <>
      <Space.Compact style={{ width: "100%" }}>
        {BusinessSelectBuilder<"staff">({
          apis: [
            {
              type: "staff",
              api,
            },
          ],
        })({
          type: "staff",
          placeholder,
          ...rest,
          // 自定义当前选中的 label 内容, 这是 antd 属性
          labelRender: (obj) => shortLabelRender(obj.label),
          labelInValue: true,
          suffixIcon: null,
        })}
        <Button
          icon={<UsergroupAddOutlined />}
          onClick={() => setModalOpen(true)}
        ></Button>
      </Space.Compact>

      <Modal
        width={1000}
        maskClosable={false}
        title={"人员选择弹框"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
      >
        todo
      </Modal>
    </>
  );
};

export default StaffSelect;
