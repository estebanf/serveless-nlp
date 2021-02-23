const {ExecutionsClient} = require('@google-cloud/workflows');
const client = new ExecutionsClient();

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const langClient = new language.LanguageServiceClient();

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const WORKFLOW_REGION = process.env.WORKFLOW_REGION;
const WORKFLOW_NAME = process.env.WORKFLOW_NAME;

console.log(`GOOGLE_CLOUD_PROJECT ${GOOGLE_CLOUD_PROJECT}`)
console.log(`WORKFLOW_REGION ${WORKFLOW_REGION}`)
console.log(`WORKFLOW_NAME ${WORKFLOW_NAME}`)


// Main function
exports.trigger_workflow_function = async (event,context) => {

    //retrieve details of the event
    const file = event.name;
    const bucket = event.bucket; 
    const eventType = context.eventType;

    const document = {
        gcsContentUri: `gs://${bucket}/${file}`,
        type: 'PLAIN_TEXT',
      };

    const [result] = await client.analyzeEntities({document});
    const entities = result.entities;
    console.log('Entities:');
    entities.forEach(entity => {
      console.log(entity.name);
      console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
      if (entity.metadata && entity.metadata.wikipedia_url) {
        console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
      }
    });
        
    // console.log(`file ${file}`)
    // console.log(`bucket ${bucket}`)
    // console.log(`eventType ${eventType}`)

    // // Let's just work if this is a new file
    // if (eventType == 'google.storage.object.finalize') {
    //     // This is a new file, let's start the workflow
    //     try {
    //         const execResponse = await client.createExecution({
    //             parent: client.workflowPath(GOOGLE_CLOUD_PROJECT,WORKFLOW_REGION, WORKFLOW_NAME),
    //             execution: {
    //                 argument: JSON.stringify({ file , bucket })
    //             }
    //         });
    //         console.log(`Execution response: ${JSON.stringify(execResponse)}`);
    
    //         const execName = execResponse[0].name;
    //         console.log(`Created execution: ${execName}`);
    //         }
    //     catch(e) {
    //         console.error(`Error executing workflow: ${e}`);
    //         throw e;            
    //     }
    // }
    // else{
    //     throw new Error(`Unexpected event type: ${eventType}`)
    // }
}