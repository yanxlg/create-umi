# create-vv-adp

Creates a vv-adp application/plugin/block/library using the command line.


[![NPM version](https://img.shields.io/badge/npm-v0.0.6-beta.3-blue)](http://npm.gitvv.com/#/detail/create-vv-adp)

## Usage

```bash
$ yarn create vv-adp [appName]
```

## Boilerplates

* `app-pro` - Create project with a customized boilerplate, use together with umi block, support typescript and ssr.
* `ant-design-pro` - Create project with a layout-only ant-design-pro boilerplate, use together with umi block.
* `app ` - Create project with a simple boilerplate, support typescript.
* `block ` - Create a umi block.
* `library ` - Create a library with umi.
* `plugin ` - Create a umi plugin.

## Usage Example

```bash
$ yarn create vv-adp

? Select the boilerplate type (Use arrow keys)
❯ app-pro         - Create project with a customized boilerplate, use together with umi block, support typescript and ssr.
  ant-design-pro  - Create project with a layout-only ant-design-pro boilerplate, use together with umi block.
  app             - Create project with a simple boilerplate, support typescript.
  block           - Create a umi block.
  library         - Create a library with umi.
  plugin          - Create a umi plugin.

? Do you want to use typescript? (y/N)

? What functionality do you want to enable? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ antd
 ◯ ant-design-pro
 ◯ dva
 ◯ scope
 ◯ dll
 ◯ code splitting
 ◯ internationalization

? Which proxy url you want to rewrite？default:none
? Do you want to use ssr render？default:N(y/N)

  create abc/package.json
  create abc/.gitignore
  create abc/.editorconfig
  create abc/.env
  create abc/.eslintrc
  create abc/.prettierignore
  create abc/.prettierrc
  create abc/.umirc.js
  create abc/mock/.gitkeep
  create abc/src/assets/yay.jpg
  create abc/src/global.css
  create abc/src/layouts/index.css
  create abc/src/layouts/index.tsx
  create abc/src/pages/index.css
  create abc/src/pages/index.tsx
  create abc/tsconfig.json
  create abc/typings.d.ts
 📋  Copied to clipboard, just use Ctrl+V
 ✨  File Generate Done
```

## FAQ

### `yarn create vv-adp` command failed

这个问题基本上都是因为没有添加 yarn global module 的路径到 PATH 环境变量引起的。

先执行 `yarn global bin` 拿到路径，然后添加到 PATH 环境变量里。

```bash
$ yarn global bin
/usr/local/bin
```

你也可以尝试用 npm，

```bash
$ npm create vv-adp
```

或者手动安装 create-vv-adp，并执行他，

```bash
$ npm install create-vv-adp -g
$ create-vv-adp
```

## Questions & Suggestions

Please open an issue [here](https://g.gitvv.com/frontend/vv-cli-adp/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## LICENSE

MIT