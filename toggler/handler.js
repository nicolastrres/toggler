const { pick } = require('ramda')
const { createFeature, getFeatures } = require('./toggler')
const { notifyFeatureCreated } = require('./email')

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
  await notifyFeatureCreated()
  return ''
}
