const { allPass, has, ifElse, map, pick, pipe, pipeWith, then } = require('ramda')
const dbClient = require('./clients/dbClient')
const emailClient = require('./clients/emailClient')

const pipeP = pipeWith(then)

const tableName = 'FeatureToggles'
const featureFields = ['name', 'value']

const getFeature = pick(featureFields)

const getFeatures = pipeP([
  () => dbClient.getAllItems(tableName),
  map(getFeature)
])

const notifyFeatureCreated = (sourceAddress, toAddresses) => {
  const subject = 'Feature was created'
  const body = 'Feature was recently created'

  return emailClient.sendEmail(sourceAddress, toAddresses, subject, body)
}


const validFeature = allPass(map(has, featureFields))
const throwMissingParamError = () => { throw new Error('Missing parameter. Please provide name and value') }

const createFeature = ifElse(
  validFeature,
  pipe(
    getFeature,
    feature => dbClient.addItem(tableName, feature)
  ),
  throwMissingParamError
)



module.exports = { getFeatures, createFeature, notifyFeatureCreated }
