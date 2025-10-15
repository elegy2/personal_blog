---
layout: ../../layouts/MarkdownPostLayout.astro

title: 专业课介绍 Part2
pubDate: 2025-09-31
description: '介绍部分专业课总览'
author: 'HIDE'
# image:
#     url: "https://docs.astro.build/assets/arc.webp"
#     alt: "The Astro logo on a dark background with a purple gradient arc."
tags: ["学习", "保研", "课程"]
---

# Java
Java 是一种 面向对象、跨平台、安全可靠的通用编程语言

一些传统公司仍要求使用Java进行软件开发

学习Java可以更加深入理解对象的作用


## 🧩 一、Java 的主要特点

🔹 1. 面向对象（Object-Oriented）

一切皆对象（万物皆类）

支持封装（Encapsulation）、继承（Inheritance）、多态（Polymorphism）

有助于构建模块化、可维护、可扩展的系统

🔹 2. 跨平台性（Write Once, Run Anywhere）

Java 程序编译后生成 字节码（.class）

字节码运行在 Java 虚拟机（JVM） 上

JVM 在不同操作系统上有不同实现，使程序能跨平台运行

🔹 3. 多线程支持（Concurrency）

Java 是最早广泛支持多线程的语言之一

提供 Thread 类、Runnable 接口、Executor 框架等工具

## 🚀 二、学习思路与路线图

Java 的学习可以分为 基础 → 进阶 → 实战 → 框架 → 项目 五个阶段。

🧠 阶段一：语言基础（Core Java）

目标：掌握语法、数据类型、面向对象思想

⚙️ 阶段二：Java 进阶

目标：理解底层机制与高级特性

🌐 阶段三：Java Web 与数据库

目标：从语言走向应用开发

⚡ 阶段四：主流框架

目标：掌握企业级开发能力

🧩 阶段五：项目与综合提升

目标：融会贯通、参与实战项目

## 🧭 三、学习建议

先代码后原理：多动手写小项目。

多读官方文档：Java 官方文档（JDK API）是最权威的学习资源。

学会调试：掌握 IDE（IntelliJ IDEA / Eclipse）的调试功能。

持续练习算法：LeetCode 上的 Java 解题能提升逻辑与代码质量。

结合框架理解底层机制：比如 Spring 的依赖注入与反射机制。

## 🧩 四、Java 与 Python 的核心区别
| 对比维度       | Python                              | Java                             |
| ---------- | ----------------------------------- | -------------------------------- |
| **语言类型**   | 动态类型语言（Dynamic Typing）<br>运行时决定变量类型 | 静态类型语言（Static Typing）<br>编译时确定类型 |
| **语法风格**   | 简洁、灵活、代码量少                          | 严谨、规范、结构化强                       |
| **运行方式**   | 解释执行（Python解释器）                     | 编译 + 解释执行（编译为字节码，由 JVM 运行）       |
| **面向对象模型** | 一切皆对象，但语法更宽松                        | 严格的类与对象体系，必须在类中定义方法              |
| **内存管理**   | 自动垃圾回收                              | 自动垃圾回收，但控制粒度更精确                  |
| **并发模型**   | GIL 限制多线程（主要用多进程）                   | 真正支持多线程并发                        |
| **性能**     | 较慢（解释型）                             | 较快（JIT编译 + 静态类型）                 |
| **主要用途**   | 数据分析、AI、脚本、Web                      | 企业后端、安卓开发、大型系统                   |
| **语法灵活性**  | 支持动态添加属性、鸭子类型                       | 类型严格，语法必须完整定义                    |
| **依赖管理**   | pip + venv                          | Maven / Gradle                   |
| **函数定义**   | `def func():`                       | `public static void func() {}`   |
| **缩进与代码块** | 缩进表示代码块                             | 使用 `{}` 表示代码块                    |
| **异常处理**   | 可选捕获                                | 必须处理（checked exception）          |

Python 更像“脚本语言”，自由灵活； Java 更像“工程语言”，严谨稳定。

## 🚀 五、从 Python 过渡到 Java 的学习思路
由于部分同学是先接触python，在此基础上学习java语言，这里提供一些思路便于大家快速的掌握与应用Java。

---
🧠 阶段 1：掌握语法对照（1~2 周）

理解 Python → Java 的语法差异

📘 练习建议：

把一些你写过的 Python 小脚本改写成 Java 版本，比如：

温度转换程序
计算器
文件读取统计行数

---
⚙️ 阶段 2：理解面向对象的“强约束版本”（2~3 周）

Python 虽然也支持 OOP，但 Java 的 OOP 要求更严格。
你需要重点理解：

类与对象（class / new）

构造函数（constructor）

访问修饰符（public、private、protected）

静态成员（static）

继承（extends）与接口（implements）

---
⚡ 阶段 3：掌握集合、泛型与异常（2~3 周）

Java 没有像 Python 那样灵活的 list/dict，需要熟悉它的集合框架：

ArrayList → Python 的 list

HashMap → Python 的 dict

HashSet → Python 的 set

---
🌐 阶段 4：输入输出、包管理与多线程（3~4 周）

*相比于python，java更强调**多线程**的作用，需要大家更深层的理解与应用

---
小结

不要死记语法，多通过“Python → Java”对照学习；

理解类型系统的区别：Java 强类型会让你更重视设计；

用 IDEA：IntelliJ IDEA 是最好的 Java IDE；

熟悉调试与编译流程：javac 编译，java 运行；

在项目中学框架：比如 Spring Boot、MyBatis；

对比式练习：同一个功能，用 Python 和 Java 各写一遍。