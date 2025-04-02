"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@ant-design/icons");
const antd_1 = require("antd");
const react_1 = require("react");
const react_admin_kit_1 = require("react-admin-kit");
const StaffSelect = (props) => {
    const { api, readonly, placeholder = "请输入关键字搜索", labelInValue } = props, rest = __rest(props, ["api", "readonly", "placeholder", "labelInValue"]);
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    // 选中的数据
    const [selectVal, setSelectVal] = (0, react_1.useState)([]);
    const handleOk = () => {
        if (props.mode === "multiple") {
            if (props.onChange)
                props.onChange(selectVal, {});
        }
        else {
            if (props.onChange)
                props.onChange(selectVal[0], {});
        }
        setModalOpen(false);
    };
    const shortLabelRender = (label) => {
        if (typeof label === "object")
            return label;
        const _label = (label || "").toString();
        return _label.split(" ")[0];
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(antd_1.Space.Compact, { style: { width: "100%" }, children: [(0, react_admin_kit_1.BusinessSelectBuilder)({
                        apis: [
                            {
                                type: "staff",
                                api,
                            },
                        ],
                    })(Object.assign(Object.assign({ type: "staff", placeholder }, rest), { 
                        // 自定义当前选中的 label 内容, 这是 antd 属性
                        labelRender: (obj) => shortLabelRender(obj.label), labelInValue: true, suffixIcon: null })), (0, jsx_runtime_1.jsx)(antd_1.Button, { icon: (0, jsx_runtime_1.jsx)(icons_1.UsergroupAddOutlined, {}), onClick: () => setModalOpen(true) })] }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { width: 1000, maskClosable: false, title: "人员选择弹框", open: modalOpen, onOk: handleOk, onCancel: () => setModalOpen(false), children: "todo" })] }));
};
exports.default = StaffSelect;
