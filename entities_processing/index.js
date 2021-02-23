'use strict';

const fs = require('fs');
const _ = require('lodash');
const { type } = require('os');

let rawdata = fs.readFileSync('C:\\Users\\yo\\development\\nlp-document-processing\\entities_processing\\entities.json');
let doc = JSON.parse(rawdata);
let entities = _.chain(doc.entities)
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

let entityTypes = _.keys(entities)
_.each(entityTypes, (key) => {
    console.log(entities[key])
})
    console.log(groups)