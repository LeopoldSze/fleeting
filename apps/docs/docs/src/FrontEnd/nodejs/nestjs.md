## 安装

```bash
# 全局安装脚手架
npm i -g @nestjs/cli

# 新建项目
nest new project-name
```

## 常用命令

```bash
# 生成CURD模板
nest g resource XXX
```

## 接口版本

```typescript
// main.ts

import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  })
  await app.listen(3000);
}
bootstrap();

// 1. controller中配置版本，@controller装饰器参数变为对象
@Controller({
  path:"user",
  version:'1'
})
export class UserController {}

// 2. 或者配置单个接口版本，通过@Version装饰器
export class UserController {
 	@Get()
    @Version('2')
    findAll() {
      return this.userService.findAll();
    }
}
```
