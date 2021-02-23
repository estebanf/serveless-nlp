const language = require('@google-cloud/language');
const Firestore = require('@google-cloud/firestore');
const _ = require('lodash');

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
    const entities = _.chain(result.entities)
        .map((obj) => {
            return {
                name: obj.name,
                salience: obj.salience,
                type: obj.type,
                mentions: obj.mentions.length
            }
        })
        .sortBy('salience')
        .reverse()
        .groupBy('type')
        .value()

    const [classification] = await client.classifyText({document});

    const documentStore = new Firestore().collection(COLLECTION_NAME);

    const doc = documentStore.doc(file);
    const docValues = {
        uri: docUri,
        classifications: classification,
    }
    _.each(_.keys(entities), (key) => {
        docValues[key] = entities[key];
    })
    await doc.set(docValues);
}