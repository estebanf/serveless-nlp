const express = require('express');
const Firestore = require('@google-cloud/firestore');

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.get('/api/documents', async (req,res) => {
    const docStore = new Firestore().collection('nlp_documents')
    const docs = await docStore.get();
    const reTurnDocuments = [];
    docs.forEach(item => {
        reTurnDocuments.push({id: item.id, data:item.data()})
    })
    res.send(reTurnDocuments);
})

app.listen(PORT, () => {
    console.log(`Started web frontend service on port ${PORT}`);
});