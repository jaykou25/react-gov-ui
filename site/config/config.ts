import { defineConfig } from "umi";
const proxy = require("./proxy.ts");
import path from "path";

export default defineConfig({
  mako: {},
  npmClient: "pnpm",
  proxy,
  alias: {
    "react-gov-ui": path.resolve(__dirname, "../../src"),
  },
});
