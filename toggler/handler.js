const { pick } = require('ramda')
const { createFeature, getFeatures, notifyFeatureCreated } = require('./toggler')

module.exports.getToggles = async (event, context) => {
  const features = await getFeatures()

  return {
    statusCode: 200,
    body: JSON.stringify(features)
  }
}


module.exports.createToggle = async (event, context) => {
  const body = JSON.parse(event.body)
  const featureParams = pick(['name', 'value'], body)

  console.log(`Creating feature toggle with the following params: ${JSON.stringify(featureParams)}`)
  await createFeature(featureParams)

  return {
    statusCode: 201
  }
}

module.exports.notifyNewFeature = async (event, context) => {
  const { SOURCE_ADDRESS, TO_ADDRESS } = process.env
  await notifyFeatureCreated(SOURCE_ADDRESS, [TO_ADDRESS])  // TODO: TO_ADDRESS should be a list
}
