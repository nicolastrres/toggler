const AWS = require('aws-sdk')
const { map, prop, pick } = require('ramda')

AWS.config.update({
  region: 'us-east-1'
})



const client = new AWS.DynamoDB.DocumentClient()
const tableName = {
    TableName: 'FeatureToggles'
}


const getFeatures = () => {
  return client.scan(tableName).promise()
    .then(prop('Items'))
    .then(map(pick(['name', 'value'])))
    .catch(err => {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
    })
}

const createFeature = (feature) => {
  const params = {
    Item: feature,
    TableName: 'FeatureToggles'
  }

  return client.put(params).promise()
    .then(() => {
      console.log('Feature toggle created', result)
    })
    .catch(err => {
      console.error('Unable to create feature toggle. Error JSON:', JSON.stringify(err, null, 2))
    })
}

module.exports = { getFeatures, createFeature }
