1. 在 `__mocks__` 目录下 mock 包
2. jest.mock

### jest.mock

- babel-jest 会有一个转化把 describe 外部的 mock 提到最上方
- require 实际上用的是 jestRequire

**在同一个 require 里**