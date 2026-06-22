---
layout: ../../layouts/MarkdownPostLayout.astro

title: 'TypeScript高级类型系统与实战技巧'
pubDate: 2026-06-12
description: '深入探讨TypeScript的类型系统和高级用法'
author: 'Elegy'
tags: ["前端开发", "TypeScript", "类型系统", "技术"]
---

# TypeScript高级类型系统与实战技巧

TypeScript为JavaScript带来了强大的类型系统。掌握高级类型能让你写出更安全、更易维护的代码。

## 🎯 泛型（Generics）

### 基础泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");

// 泛型接口
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 123 };
const stringBox: Box<string> = { value: "hello" };
```

### 泛型约束

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");      // ✅ 字符串有length
logLength([1, 2, 3]);    // ✅ 数组有length
// logLength(123);       // ❌ 数字没有length
```

## 🔧 实用工具类型

### 1. Partial - 所有属性变为可选

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 部分更新用户
function updateUser(id: number, updates: Partial<User>) {
  // updates的所有属性都是可选的
}

updateUser(1, { name: "Alice" }); // ✅
```

### 2. Required - 所有属性变为必选

```typescript
interface Config {
  host?: string;
  port?: number;
}

const config: Required<Config> = {
  host: "localhost",  // 必须提供
  port: 3000          // 必须提供
};
```

### 3. Pick - 选择特定属性

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

// 只需要标题和作者
type ArticlePreview = Pick<Article, 'title' | 'author'>;

const preview: ArticlePreview = {
  title: "TypeScript Guide",
  author: "Elegy"
};
```

### 4. Omit - 排除特定属性

```typescript
// 创建用户时不需要id和createdAt
type CreateUserDTO = Omit<User, 'id' | 'createdAt'>;

const newUser: CreateUserDTO = {
  name: "Bob",
  email: "bob@example.com"
};
```

## 🎨 联合类型与交叉类型

### 联合类型（Union）

```typescript
type Status = "pending" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "pending":
      console.log("Loading...");
      break;
    case "success":
      console.log("Done!");
      break;
    case "error":
      console.log("Failed!");
      break;
  }
}
```

### 交叉类型（Intersection）

```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

type Person = HasName & HasAge;

const person: Person = {
  name: "Alice",
  age: 25
};
```

## 🔍 类型守卫

### typeof类型守卫

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript知道这里value是string
    return value.toUpperCase();
  } else {
    // 这里value是number
    return value.toFixed(2);
  }
}
```

### instanceof类型守卫

```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### 自定义类型守卫

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

// 类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}
```

## 🎯 映射类型

### 创建只读类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Point {
  x: number;
  y: number;
}

const readonlyPoint: Readonly<Point> = { x: 10, y: 20 };
// readonlyPoint.x = 5; // ❌ 错误：只读属性
```

### 可选类型

```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

## 🚀 条件类型

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// 实用示例：提取Promise的返回类型
type Awaited<T> = T extends Promise<infer R> ? R : T;

type Result = Awaited<Promise<number>>;  // number
```

## 📦 模块化与命名空间

```typescript
// user.types.ts
export interface User {
  id: number;
  name: string;
}

export type UserRole = "admin" | "user" | "guest";

// userService.ts
import { User, UserRole } from './user.types';

export class UserService {
  getUser(id: number): User {
    // 实现
  }
}
```

## 🎓 最佳实践

1. **优先使用接口而非类型别名**（对于对象形状）
2. **使用严格模式**（tsconfig.json中启用strict）
3. **避免使用any**（使用unknown代替）
4. **善用类型推断**（不要过度注解）
5. **使用枚举表示固定值集合**

```typescript
// ✅ 好的做法
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401
}

// ❌ 避免
const status: any = 200;
```

## 🔗 总结

TypeScript的类型系统非常强大：
- 泛型提供了灵活的类型复用
- 实用工具类型简化常见操作
- 类型守卫确保运行时安全
- 条件类型实现高级类型逻辑

掌握这些高级特性，你就能充分发挥TypeScript的威力！
