const language = require('@google-cloud/language');
const Firestore = require('@google-cloud/firestore')

const client = new language.LanguageServiceClient();

const COLLECTION_NAME = process.env.COLLECTION_NAME;

exports.process_document = async (event,context) => {

    //retrieve details of the event
    const file = event.name;
    const bucket = event.bucket; 
    const docUri = `gs://${bucket}/${file}`

    const document = {
        gcsContentUri: docUri,
        type: 'PLAIN_TEXT',
      };

    const [result] = await client.analyzeEntities({document});
    const entities = result.entities;

    const [classification] = await client.classifyText({document});

    const documentStore = new Firestore().collection(COLLECTION_NAME);

    const doc = documentStore.doc(file);
    await doc.set({
        uri: docUri,
        classifications: classification,
        entities: entities
    })
}