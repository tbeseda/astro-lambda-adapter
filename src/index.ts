import type { AstroAdapter, AstroIntegration } from 'astro';

const NAME = 'astro-lambda-adapter';

function getAdapter(): AstroAdapter {
	return {
		name: NAME,
		serverEntrypoint: `${NAME}/server`,
		exports: ['handler'],
	};
}

export default function createIntegration(): AstroIntegration {
	return {
		name: NAME,
		hooks: {
			'astro:config:done': ({ setAdapter }) => {
				setAdapter(getAdapter());
			},
			'astro:build:setup': ({ vite, target }) => {
				if (target === 'server') {
					vite.ssr = { noExternal: true };
				}
			},
		},
	};
}
