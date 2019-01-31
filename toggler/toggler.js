const AWS = require('aws-sdk')
const { map, prop, pick } = require('ramda')

AWS.config.update({
  region: 'us-east-1'
})

const client = new AWS.DynamoDB.DocumentClient()
const params = {
    TableName: 'FeatureToggles'
}


const getFeatures = () => {
  return client.scan(params).promise()
    .then(prop('Items'))
    .then(map(pick(['name', 'value'])))
    .catch(err => {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
    })
}

module.exports = { getFeatures }
