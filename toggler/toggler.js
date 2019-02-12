const AWS = require('aws-sdk')
const { map, pick } = require('ramda')
const { getAllItems, addItem } = require('./clients/dbClient')

const tableName = 'FeatureToggles'

const getFeatures = () => {
  return getAllItems(tableName)
    .then(map(pick(['name', 'value'])))
    .catch(err => {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
    })
}

const createFeature = (feature) => {
  return addItem(tableName, feature)
    .then(() => {
      console.log('Feature toggle created')
    })
    .catch(err => {
      console.error('Unable to create feature toggle. Error JSON:', JSON.stringify(err, null, 2))
    })
}

module.exports = { getFeatures, createFeature }
