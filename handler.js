const { pick } = require('ramda')
const { createFeature, getFeatures, notifyFeatureCreated } = require('./toggler')

module.exports.getToggles = async () => {
    const features = await getFeatures()

    return {
        statusCode: 200,
        body: JSON.stringify(features)
    }
}


module.exports.createToggle = async (event) => {
    const body = JSON.parse(event.body)
    const featureParams = pick(['name', 'value'], body)

    await createFeature(featureParams)

    return {
        statusCode: 201
    }
}

module.exports.notifyNewFeature = async () => {
    const { SOURCE_ADDRESS, TO_ADDRESS } = process.env
    await notifyFeatureCreated(SOURCE_ADDRESS, [TO_ADDRESS])  // TODO: TO_ADDRESS should be a list
}
