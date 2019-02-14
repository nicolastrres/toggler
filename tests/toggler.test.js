const { expect } = require('chai')
const { stub } = require('sinon')
const dbClient = require('../clients/dbClient')
const emailClient = require('../clients/emailClient')

const toggler = require('../toggler')

describe('toggler', () => {
  describe('#getToggles', () => {
    before(() => {
      stub(dbClient, 'getAllItems').withArgs('FeatureToggles').resolves([
        { name: 'toggle1', value: true, anotherValue: false },
        { name: 'toggle2', value: false, anotherThing: 1 }
      ])
    })

    after(() => {
      dbClient.getAllItems.restore()
    })


    it('gets toggles attributes from db response', async () => {
      const expectedToggles = [
        { name: 'toggle1', value: true },
        { name: 'toggle2', value: false }
      ]

      const actualToggles = await toggler.getToggles()

      expect(actualToggles).to.be.deep.equal(expectedToggles)
    })
  })

  describe('#createToggle', () => {
    before(() => {
      stub(dbClient, 'addItem')
        .withArgs('FeatureToggles', { name: 'toggle1', value: true })
        .resolves({ name: 'toggle1', value: true })
    })

    after(() => {
      dbClient.addItem.restore()
    })

    it('creates a new toggle only with valid fields', async () => {
      const toggleToBeCreated = { name: 'toggle1', value: true, anotherValue: false }
      const expectedToggle = { name: 'toggle1', value: true }

      const actualToggle = await toggler.createToggle(toggleToBeCreated)

      expect(actualToggle).to.be.deep.equal(expectedToggle)
    })

    it('raises an error when required fields are not provided', async () => {
      const toggleWithoutValue = { name: 'toggle1' }

      expect(() => toggler.createToggle(toggleWithoutValue)).to.throw(Error, 'Missing parameter. Please provide name and value')
    })
  })

  describe('#notifyToggleCreated', () => {
    before(() => {
      stub(emailClient, 'sendEmail')
        .withArgs('sourceAddress', 'toAddress', 'Feature toggle was created', 'Feature toggle was recently created')
        .resolves('email sent')
    })

    after(() => {
      emailClient.sendEmail.restore()
    })

    it('sends email with subject and body', async () => {
      const actualResponse = await toggler.notifyToggleCreated('sourceAddress', 'toAddress')
      expect(actualResponse).to.be.equal('email sent')
    })
  })
})
