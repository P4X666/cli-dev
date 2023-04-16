# cli-dev
脚手架搭建
## 核心流程 core

## 命令 commands
- 初始化
- 发布
- 清除缓存
## 模型层 models
- commands 命令
- project 项目
- component 组件
- npm 模块
- git 仓库
## 支撑模块 utils
- git 操作
- 云构建
- 工具方法
- api请求
- git api


## lerna 常用命令
1. 创建模块  
`lerna create <package-name> <path>`
2. 给指定模块添加依赖  
`lerna add <deps> <package-name>` 
3. 版本号复位  
+ 将`package.json`中的`version`复位
+ 删除本地tag `git tag -d tag-name`
+ 删除远程tag `git push origin :refs/tags/tag-name`