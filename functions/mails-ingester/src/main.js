import { Client, TablesDB, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const appwriteConfig = {
    db: '696c6ffc0001edc93922',
    mails: 'mails',
    messages: 'messages',
  };

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const tablesDB = new TablesDB(client);

  if (req.path === '/ping') {
    return res.text('Pong');
  }

  const auth = req.headers['authorization'];
  const expected = `Bearer ${process.env.INGEST_SECRET}`;

  if (!auth || auth !== expected) {
    return res.json({ ok: false, error: 'unauthorized' }, 401);
  }

  try {
    const body = req.bodyJson;
    if (!body) {
      return res.json({ ok: false, error: 'No body' }, 400);
    }

    const { to, from, subject, text, html } = body;

    if (!to) {
      return res.json({ ok: false, error: 'Missing recipient' }, 400);
    }

    const mailboxes = await tablesDB.listRows({
      databaseId: appwriteConfig.db,
      tableId: appwriteConfig.mails,
      queries: [
        Query.equal('address', to),
        Query.greaterThan('expiresAt', new Date().toISOString()),
        Query.limit(1),
      ],
    });

    if (mailboxes.total === 0) {
      log(`Dropping mail for unknown/expired address: ${to}`);
      return res.json({ ok: true, dropped: true });
    }

    const mailbox = mailboxes.rows[0];

    await tablesDB.createRow({
      databaseId: appwriteConfig.db,
      tableId: appwriteConfig.messages,
      rowId: ID.unique(),
      data: {
        mailId: mailbox.$id,
        to,
        from: from || 'unknown',
        subject: subject || '(No Subject)',
        text: text || '',
        html: html || '',
        createdAt: new Date().toISOString(),
        expiresAt: mailbox.expiresAt,
      },
    });

    return res.json({ ok: true });
  } catch (err) {
    error('failed to record email: ' + err.message);
    return res.json({ ok: false, error: 'internal error' }, 500);
  }
};
