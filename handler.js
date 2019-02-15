const { pick } = require('ramda')
const { logger } = require('./logger')
const toggler = require('./toggler')

const buildResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
})

const buildInternalServerErrorResponse = (errorMessage) => buildResponse(500, { message: errorMessage })

module.exports.getToggles = async () => {
  try {
    const toggles = await toggler.getToggles()

    return buildResponse(200, toggles)
  } catch(error) {
    logger.error(`[getToggles] The following error was raised: ${error}`)
    return buildInternalServerErrorResponse('An error happened while trying to retrieve toggles')
  }
}

module.exports.createToggle = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const toggleParams = pick(['name', 'value'], body)

    await toggler.createToggle(toggleParams)

    return { statusCode: 201 }
  } catch(error) {
    logger.error(`[createToggle] The following error was raised: ${error}`)
    return buildInternalServerErrorResponse('An error happened while trying to create a toggle')
  }

}

module.exports.notifyToggleCreated = async () => {
  const { SOURCE_ADDRESS, TO_ADDRESS } = process.env
  await toggler.notifyToggleCreated(SOURCE_ADDRESS, [TO_ADDRESS])  // TODO: TO_ADDRESS should be a list
}
