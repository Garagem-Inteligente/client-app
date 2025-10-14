module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "max-len": ["error", {
      "code": 80,
      "ignorePattern": "^\\s*<.*>$", // Ignore HTML lines
      "ignoreStrings": true, // Ignore long strings
      "ignoreTemplateLiterals": true, // Ignore template literals
    }],
  },
  overrides: [
    {
      files: ["src/templates/**/*.ts"],
      rules: {
        "max-len": "off", // Disable max-len for email templates
      },
    },
  ],
};
