# `astro-lambda-adapter`

The primary objective here is to map a `APIGatewayProxyEventV2` received in a Lambda to an Astro/Node.js `Request` and then Astro's `Response` to `APIGatewayProxyResult`.

See [./src/server.ts](./src/server.ts).

## Astro SSR AWS Lambda Adapter

> ⚠️ Still really early days on this one. Request `body` still unsupported. No deploys with complex Astro apps. Generally untested. Feedback and PRs welcome.

```sh
npm i astro-lambda-adapter
```

```js
// ./astro.config.js
import { defineConfig } from 'astro/config';
import awsAdapter from 'astro-lambda-adapter';

export default defineConfig({
	adapter: awsAdapter(),
	outDir: './myLambda/dist',
});
```

```js
// ./myLambda/index.mjs
import { handler as ssrHandler } from './dist/server/entry.mjs';

export async function handler(event) {
	console.log(`🚀 ${event.requestContext.http.method}: ${event.rawPath}`);
	return await ssrHandler(event);
}
```

```astro
---
// ./src/pages/index.astro
const RANDOM = Math.floor(Math.random() * 100) + 1;
---
<html lang="en">
	<head>
		<title>Astro on Lambda</title>
	</head>
	<body>
		<h1>Astro on Lambda</h1>
		<p>Random: <code>{RANDOM}</code></p>
	</body>
</html>
```

> 📜 This integration doesn't modify how Astro uses Vite to build and bundle your app. You may find it beneficial to [configure Vite via Astro](https://docs.astro.build/en/reference/configuration-reference/#vite) to optimize the build for Lambda.
