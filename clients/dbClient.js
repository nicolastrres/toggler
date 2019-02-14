const AWS = require('aws-sdk')
const { prop } = require('ramda')

AWS.config.update({
    region: 'us-east-1'
})

const getAllItems = (tableName) => {
    const client = new AWS.DynamoDB.DocumentClient()

    return client.scan({ TableName: tableName }).promise()
        .then(prop('Items'))
}

const addItem = (tableName, item) => {
    const client = new AWS.DynamoDB.DocumentClient()

    return client.put({
        TableName: tableName,
        Item: item
    }).promise()
}

module.exports = { getAllItems, addItem }
