import * as PostalMime from 'postal-mime';

interface Env {
	APPWRITE_ENDPOINT: string; // e.g. https://cloud.appwrite.io/v1
	APPWRITE_PROJECT: string;
	APPWRITE_API_KEY: string;

	APPWRITE_DB: string; // 696c6ffc0001edc93922
	APPWRITE_MAILS: string; // mails
	APPWRITE_MESSAGES: string; // messages
}

export default {
	async email(message, env, ctx) {
		try {
			const to = message.to.toLowerCase();
			const from = message.from;

			if (!to || !to.endsWith('@mail.tsbin.tech')) {
				console.log('Ignoring non-temp domain mail:', to);
				return;
			}

			const parser = new PostalMime.default();
			const rawEmail = new Response(message.raw);
			const buffer = await rawEmail.arrayBuffer();

			const email = await parser.parse(buffer);

			const subject = email.subject || '(No Subject)';
			const text = email.text || '';
			const html = email.html || '';

			const headers = {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': env.APPWRITE_PROJECT,
				'X-Appwrite-Key': env.APPWRITE_API_KEY,
			};

			const qs = buildQueries([
				{
					method: 'equal',
					attribute: 'address',
					values: [to],
				},
				{
					method: 'greaterThan',
					attribute: 'expiresAt',
					values: [new Date().toISOString()],
				},
				{
					method: 'limit',
					values: [1],
				},
			]);

			const url = `${env.APPWRITE_ENDPOINT}/v1/tablesdb/${env.APPWRITE_DB}/tables/${env.APPWRITE_MAILS}/rows?${qs}`;

			const lookup = await fetch(url, {
				headers,
			});

			if (!lookup.ok) {
				console.error('Mailbox lookup failed:', await lookup.text());
				return;
			}

			const data: any = await lookup.json();

			if (!data.rows || data.rows.length === 0) {
				console.log('Dropping mail for unknown/expired address:', to);
				return;
			}

			const mailbox = data.rows[0];

			const create = await fetch(`${env.APPWRITE_ENDPOINT}/v1/tablesdb/${env.APPWRITE_DB}/tables/${env.APPWRITE_MESSAGES}/rows`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					rowId: 'unique()',
					data: {
						mailId: mailbox.$id,
						to,
						from: from || 'unknown',
						subject,
						text,
						html,

						expiresAt: mailbox.expiresAt,
					},
				}),
			});

			if (!create.ok) {
				console.error('Failed to store message:', await create.text());
			}
		} catch (err) {
			console.error('Worker email error:', err);
		}
	},
} satisfies ExportedHandler<Env>;

function buildQueries(params: any[]) {
	return params.map((q, i) => `queries[${i}]=${encodeURIComponent(JSON.stringify(q))}`).join('&');
}
