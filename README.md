# `astro-lambda-adapter`

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
