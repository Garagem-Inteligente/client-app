module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "vue/multi-word-component-names": "off",
    "vue/no-deprecated-slot-attribute": ["error", {
      ignore: [
        "ion-toolbar",
        "ion-tab-bar",
        "ion-tabs",
        "ion-header",
        "ion-footer",
        "ion-buttons",
      ],
    }],
  },
  ignorePatterns: [
    "dist",
    "dist-ssr",
    "coverage",
    "node_modules",
    "android",
    "ios",
  ],
}
