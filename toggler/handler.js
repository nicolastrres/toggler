const { pick } = require('ramda')
const { createFeature, getFeatures } = require('./toggler')


module.exports.getToggles = async (event, context) => {
  const features = await getFeatures()

  return {
    statusCode: 200,
    body: JSON.stringify(features)
  }
}


module.exports.createToggle = async (event, context) => {
  const featureParams = pick(['name', 'value'], event)
  await createFeature(featureParams)

  return {
    statusCode: 201
  }
}
