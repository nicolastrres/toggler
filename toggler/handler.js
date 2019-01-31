const { getFeatures } = require('./toggler')


module.exports.getToggles = async (event, context) => {
  const features = await getFeatures()
  return {
    statusCode: 200,
    body: JSON.stringify(features)
  }
}
