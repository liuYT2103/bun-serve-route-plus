# Bun Serve Route Plus

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Enhanced middleware and route grouping for Bun's native HTTP server routes configuration.

## Features

- 🛠 **Middleware Support**: Add before-request and after-response middleware
- 🗂 **Route Grouping**: Organize routes with common prefixes
- ⚡ **Lightweight**: Zero dependencies, built for Bun's native server
- 🦄 **TypeScript Ready**: Full type definitions included
- ✨ **Clean API**: Simple and intuitive syntax

## Installation

```bash
bun add bun-serve-route-plus
```

## Usage

```typescript
// mini
import { serve } from 'bun';
import { m, beforeRequest } from 'bun-serve-route-plus';
serve({
  port:12580,
  fetch: () => new Response('好像来错地方了'),
  routes: m({
    '/api/abc': () => new Response('Hello, /api/abc'),
    '/vip': () => new Response('Hello, /vip')
  })
})
```

```typescript
// normal
import { serve } from 'bun';
import { cors } from './middleware/cors';
import { authMiddleware } from './middleware/auth';
import { useMiddleware, useGroup, beforeRequest } from 'bun-serve-route-plus';

import UserApi from './router/user';

cors()
beforeRequest.use(authMiddleware)

const app = serve({
  port:12580,
  fetch: () => new Response('好像来错地方了'),
  routes: useMiddleware(
    {
      '/api/abc': () => new Response('Hello, /api/abc')
    },
    useGroup('api/v1',
      useGroup('user', UserApi),
      useGroup('goods', {
        '/vip': () => new Response('Hello, /api/v1/goods/vip')
      })
    )
  )
})
console.log(
  `🐇 Server Is Running At \n\n ${app.url.href}`
)
```

```typescript
// middleware/cors.ts
import { CORS_HEADERS } from "../config";
import { beforeRequest, beforeRespose } from "../class/middleware";
export const cors = (option = CORS_HEADERS) => {
  beforeRequest.use((request) => {
    if(request.method == 'OPTIONS') return new Response('Departed', option);
  })
  beforeRespose.use((response) => {
    if(!response.headers) return response
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    return response
  })
}
```

**Request Middleware:**
```typescript
beforeRequest.use((req) => {
  console.log(`Incoming request: ${req.url}`);
  // Return a Response to short-circuit the request
});

beforeRequest.use(async (req) => {
  const auth = req.headers.get('Authorization');
  if (!auth) return new Response('Unauthorized', { status: 401 });
});
```

**Response Middleware:**
```typescript
beforeRespose.use((res) => {
  res.headers.set('X-Powered-By', 'Bun');
  return res;
});
```

## License

MIT © [LiuYT2103]
