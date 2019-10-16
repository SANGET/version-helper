# 应用版本信息小助手

用于根据 package.json 的 version 和 git commit 组合生成版本号信息，并且提供用于渲染和检查是否需要有新版本更新的 React 组件。

版本号构成：x.y.z+buildVersion

1. 根目录的 package.json 的 version 字段构建主版本号 x.y.z
2. 根据 git commit 记录生成构建号 +buildVersion

## 开始使用

```shell
yarn add version-helper -D
```

在 `package.json` 添加以下 `script`

```js
vh gen
```

使用 --outdir 参数将版本信息文件输出到 dir 中，默认为 src

```js
vh gen --outdir src/xxx
```

将在项目根目录的 src 文件夹下生成 version.json 文件，版本信息文件模版

```json
{
  "packageVersion": "1.1.0",
  "buildVersion": "24",
  "version": "1.1.0+24",
  "buildDate": "2019-10-16+11:41:22",
  "gitHash": "09501e19ec47eabe046169c30c0abc1f5e3e070c"
}
```

## 应用内使用

```js
import { VersionDisplayer } from 'version-helper';
import VersionInfo from 'src/version.json';

// 渲染该数据
<VersionDisplayer versionInfo={VersionInfo} />
```
