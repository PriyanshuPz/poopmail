import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.API_ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

  const databases = new Databases(client);
  const databaseId = '696c6ffc0001edc93922';
  const mailsCollectionId = 'mails';
  const messagesCollectionId = 'messages';

  const now = new Date().toISOString();
  let deletedMails = 0;
  let deletedMessages = 0;

  try {
    log('Checking for expired messages...');
    const expiredMessages = await databases.listDocuments(
      databaseId,
      messagesCollectionId,
      [Query.lessThan('expiresAt', now), Query.limit(100)]
    );

    for (const message of expiredMessages.documents) {
      try {
        await databases.deleteDocument(
          databaseId,
          messagesCollectionId,
          message.$id
        );
        deletedMessages++;
        log(`Deleted message ${message.$id}`);
      } catch (err) {
        error(`Failed to delete message ${message.$id}: ${err.message}`);
      }
    }

    log('Checking for expired mails...');
    const expiredMails = await databases.listDocuments(
      databaseId,
      mailsCollectionId,
      [Query.lessThan('expiresAt', now), Query.limit(100)]
    );

    for (const mail of expiredMails.documents) {
      try {
        await databases.deleteDocument(databaseId, mailsCollectionId, mail.$id);
        deletedMails++;
        log(`Deleted mail ${mail.$id} (${mail.address})`);
      } catch (err) {
        error(`Failed to delete mail ${mail.$id}: ${err.message}`);
      }
    }

    log(
      `Cleanup completed: ${deletedMails} mails and ${deletedMessages} messages deleted`
    );

    return res.json({
      success: true,
      deletedMails,
      deletedMessages,
      timestamp: now,
    });
  } catch (err) {
    error('Cleanup job failed: ' + err.message);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500
    );
  }
};
