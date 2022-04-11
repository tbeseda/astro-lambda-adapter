import type { SSRManifest } from 'astro';
import type { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { NodeApp } from 'astro/app/node';
import { polyfill } from '@astrojs/webapi';

polyfill(globalThis, {
	exclude: 'window document',
});

interface Args {
	host?: string;
}

export function createExports(manifest: SSRManifest) {
	const app = new NodeApp(manifest);

	return {
		async handler(event: APIGatewayProxyEventV2, args: Args = {}): Promise<APIGatewayProxyResult> {
			const { body, cookies, headers: h, rawPath, rawQueryString, requestContext } = event;

			let hostString = '';
			if (args.host) {
				hostString = args.host;
			} else if (h.host) {
				hostString = `${h['x-forwarded-protocol'] || 'https'}://${h.host}`;
			}
			const host = new URL(hostString);
			const fullUrl = new URL(
				`${rawPath}${rawQueryString.length > 0 ? `?${rawQueryString}` : ''}`,
				host
			);

			const headers = new Headers(h as any);
			if (cookies) headers.append('cookie', cookies.join('; '));

			const request = new Request(fullUrl.toString(), {
				method: requestContext.http.method,
				headers,
				// TODO: correctly handle body
				body: body && Object.keys(body).length ? body : null,
			});

			try {
				const rendered = await app.render(request);
				const body = await rendered.text();
				return {
					statusCode: rendered.status,
					headers: Object.fromEntries(rendered.headers.entries()),
					body,
				};
			} catch (error: unknown) {
				throw error;
			}
		},
	};
}
