const elasticsearch = require('elasticsearch');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
  });

// https://blog.raananweber.com/2015/11/24/simple-autocomplete-with-elasticsearch-and-node-js/
// https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/

const ES_HOST = process.env.ES_HOST ? process.env.ES_HOST : 'localhost';
const ES_PORT = process.env.ES_PORT ? process.env.ES_PORT : '9200';

const ES_URL = ES_HOST + ':' + ES_PORT;

console.log('ES_URL : ' + ES_URL);

const elasticClient = new elasticsearch.Client({
    host: ES_URL,
    log: 'info'
});

const indexName = "workshop-docker";

function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}

function initIndex() {
    console.log('creating index');
    return elasticClient.indices.create({
        index: indexName
    });
}

function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}

function initMapping() {  
    logger.info('init mapping');
    return elasticClient.indices.putMapping({
        index: indexName,
        type: 'stuff',
        body: {
            properties: {
                stuff: { type: "text" }
            }
        }
    });
}

indexExists().then(function (exists) {
    logger.info('is ' + indexName + ' exists ? ' + exists);
    if (!exists) {
        return initIndex();
    }
}).then(function() {
    return initMapping();
}, function(error) { logger.error(error)});

function addStuff(body) {  
    logger.info('adding stuff : ' + body.data);
    return elasticClient.index({
        index: indexName,
        type: 'stuff',
        body: {
            stuff: body.data
        }
    });
}
exports.addStuff = addStuff;

function getStuffs() {  
    logger.info('getting stuff')
    return elasticClient.search({
        index: indexName
    })
}
exports.getStuffs = getStuffs;
