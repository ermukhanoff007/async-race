import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
];
