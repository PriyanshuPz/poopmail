import * as PostalMime from 'postal-mime';

interface Env {
	INGEST_SECRET: string;
	APPWRITE_INGEST_URL: string;
}

export default {
	async email(message, env, ctx) {
		try {
			const to = message.to;
			const from = message.from;

			if (!to.toLowerCase().endsWith('@mail.tsbin.tech')) {
				console.log('Ignoring non-temp domain mail:', to);
				return;
			}

			const parser = new PostalMime.default();
			const rawEmail = new Response(message.raw);
			const email = await parser.parse(await rawEmail.arrayBuffer());

			const subject = email.subject;
			const text = email.text;
			const html = email.html;

			const payload = {
				to,
				from,
				subject,
				text,
				html,
			};

			const res = await fetch(env.APPWRITE_INGEST_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${env.INGEST_SECRET}`,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				console.error('Failed to forward mail:', await res.text());
			}
		} catch (err) {
			console.error('Worker email error:', err);
		}
	},
} satisfies ExportedHandler<Env>;
