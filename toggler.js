const { allPass, has, ifElse, map, pick, pipe, pipeWith, then } = require('ramda')
const dbClient = require('./clients/dbClient')
const emailClient = require('./clients/emailClient')

const pipeP = pipeWith(then)

const tableName = 'FeatureToggles'
const toggleFields = ['name', 'value']

const getToggle = pick(toggleFields)

const getToggles = pipeP([
  () => dbClient.getAllItems(tableName),
  map(getToggle)
])

const notifyToggleCreated = (sourceAddress, toAddresses) => {
  const subject = 'Feature toggle was created'
  const body = 'Feature toggle was recently created'

  return emailClient.sendEmail(sourceAddress, toAddresses, subject, body)
}


const validToggle = allPass(map(has, toggleFields))
const throwMissingParamError = () => { throw new Error('Missing parameter. Please provide name and value') }

const createToggle = ifElse(
  validToggle,
  pipe(
    getToggle,
    toggle => dbClient.addItem(tableName, toggle)
  ),
  throwMissingParamError
)

module.exports = { getToggles, createToggle, notifyToggleCreated }
