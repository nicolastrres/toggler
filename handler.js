const { pick } = require('ramda')
const toggler = require('./toggler')

module.exports.getToggles = async () => {
  const toggles = await toggler.getToggles()

  return {
    statusCode: 200,
    body: JSON.stringify(toggles)
  }
}


module.exports.createToggle = async (event) => {
  const body = JSON.parse(event.body)
  const toggleParams = pick(['name', 'value'], body)

  await toggler.createToggles(toggleParams)

  return {
    statusCode: 201
  }
}

module.exports.notifyToggleCreated = async () => {
  const { SOURCE_ADDRESS, TO_ADDRESS } = process.env
  await toggler.notifyToggleCreated(SOURCE_ADDRESS, [TO_ADDRESS])  // TODO: TO_ADDRESS should be a list
}
