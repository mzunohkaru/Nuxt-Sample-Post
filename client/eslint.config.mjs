// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // コンソール出力を許可（開発時のデバッグのため）
      "no-console": "off",

      // コードスタイル関連
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],

      // TypeScript関連
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // Vue/Nuxt関連
      "vue/multi-word-component-names": "off",
      "vue/no-multiple-template-root": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
        },
      ],
      // 廃止されたvue/component-tags-orderをvue/block-orderに置き換え
      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],

      // 一般的なベストプラクティス
      "no-var": "error",
      "prefer-const": "error",
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      "prefer-template": "error",
      "object-shorthand": "error",

      // セキュリティ関連
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },
);
