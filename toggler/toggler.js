const AWS = require('aws-sdk')
const { map, pick } = require('ramda')
const { getAllItems, addItem } = require('./clients/dbClient')

const getFeatures = () => {
  return getAllItems('FeeatureToggles')
    .then(map(pick(['name', 'value'])))
    .catch(err => {
      console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2))
    })
}

const createFeature = (feature) => {
  return addItem('FeatureToggles', feature)
    .then(() => {
      console.log('Feature toggle created')
    })
    .catch(err => {
      console.error('Unable to create feature toggle. Error JSON:', JSON.stringify(err, null, 2))
    })
}

module.exports = { getFeatures, createFeature }
