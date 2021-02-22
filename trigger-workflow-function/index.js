const {ExecutionsClient} = require('@google-cloud/workflows');
const client = new ExecutionsClient();

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const WORKFLOW_REGION = process.env.WORKFLOW_REGION;
const WORKFLOW_NAME = process.env.WORKFLOW_NAME;

// Main function
exports.trigger_workflow_function = async (e,context) => {

    //retrieve details of the event
    const file = e.name;
    const bucket = e.bucket; 
    const eventType = context.eventType;

    // Let's just work if this is a new file
    if (eventType == 'google.storage.object.finalize') {
        // This is a new file, let's start the workflow
        try {
            const execResponse = await.createExecution({
                parent: client.workflowPath(GOOGLE_CLOUD_PROJECT,WORKFLOW_REGION, WORKFLOW_NAME),
                execution: {
                    argument: JSON.stringify({ file , bucket })
                }
            });
            console.log(`Execution response: ${JSON.stringify(execResponse)}`);
    
            const execName = execResponse[0].name;
            console.log(`Created execution: ${execName}`);
            }
        catch(e) {
            console.error(`Error executing workflow: ${e}`);
            throw e;            
        }
    }
    else{
        throw new Error(`Unexpected event type: ${eventType}`)
    }
}