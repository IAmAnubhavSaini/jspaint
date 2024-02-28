module.exports = {
    env: {
        browser: true, commonjs: true, es2021: true, jasmine: true, jquery: true,
    },
    extends: "airbnb-base",
    overrides: [
        {
            env: {
                node: true,
            },
            files: [ ".eslintrc.{js,cjs}", "**/*.spec.js" ],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        indent: [ "error", 4 ],
        "linebreak-style": [ "error", "unix" ],
        "line-comment-position": [
            "error",
            {
                position: "above",
            },
        ],
        quotes: [ "error", "double" ],
        semi: [ "error", "always" ],

        "no-cond-assign": [ "error", "always" ],

        "array-element-newline": [
            "error",
            {
                multiline: true,
            },
        ],
        "no-console": "off",
        "array-bracket-newline": [
            "error",
            {
                multiline: true,
            },
        ],
        "array-bracket-spacing": [ "error", "always" ],
        "object-curly-newline": [
            "error",
            {
                ObjectExpression: "always",
                ObjectPattern: {
                    multiline: true,
                },
                ImportDeclaration: "never",
            },
        ],
        "object-curly-spacing": [ "error", "always" ],
        "dot-location": [ "error", "property" ],
        "max-len": [
            "error",
            {
                code: 120,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                tabWidth: 4,
                ignoreUrls: true,
            },
        ],
        "operator-linebreak": [ "error", "after" ],
    },
};
