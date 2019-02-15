const { expect } = require('chai')
const { stub } = require('sinon')
const { logger } = require('../logger')
const toggler = require('../toggler')
const handler = require('../handler')


describe('handler', () => {
  before(() => {
    stub(logger, 'error')
  })

  after(() => {
    logger.error.restore()
  })

  describe('#getToggles', () => {
    let response

    context('when features are returned with success', () => {
      before(async () => {
        stub(toggler, 'getToggles').resolves([{ name: 'feature1', value: false }])
        response = await handler.getToggles()
      })

      after(() => {
        toggler.getToggles.restore()
      })

      it('contains OK status code', () => {
        expect(response.statusCode).to.be.equal(200)
      })

      it('contains body with feature toggle', () => {
        expect(response.body).to.be.equal('[{"name":"feature1","value":false}]')
      })

    })

    context('when an error is raised', () => {
      before(async () => {
        stub(toggler, 'getToggles').rejects('Some error was raised')
        response = await handler.getToggles()
      })

      after(() => {
        toggler.getToggles.restore()
      })

      it('contains INTERNAL SERVER ERROR status code', () => {
        expect(response.statusCode).to.be.equal(500)
      })

      it('contains body with error message', () => {
        expect(response.body).to.be.equal('{"message":"An error happened while trying to retrieve toggles"}')
      })
    })
  })

  describe('#createToggle', () => {
    let response

    context('when features are created with success', () => {
      before(async () => {
        stub(toggler, 'createToggle').resolves()
        response = await handler.createToggle({body: '{ "name": "some name", "value": "some value" }' })
      })

      after(() => {
        toggler.createToggle.restore()
      })

      it('contains CREATED status code', () => {
        expect(response.statusCode).to.be.equal(201)
      })
    })

    context('when an error is raised', () => {
      before(async () => {
        stub(toggler, 'createToggle').rejects('Some error was raised')
        response = await handler.createToggle({body: '{ "name": "some name", "value": "some value" }' })
      })

      after(() => {
        toggler.createToggle.restore()
      })

      it('contains INTERNAL SERVER ERROR status code', () => {
        expect(response.statusCode).to.be.equal(500)
      })

      it('contains body with error message', () => {
        expect(response.body).to.be.equal('{"message":"An error happened while trying to create a toggle"}')
      })
    })
  })

  describe('#notifyToggleCreated', () => {
    const sourceAddress = 'SOURCE EMAIL ADDRESS'
    const toAddress = 'TO EMAIL ADDRESS'

    before(() => {
      process.env.SOURCE_ADDRESS = sourceAddress
      process.env.TO_ADDRESS = toAddress
    })

    context('when notifications are sent with success', () => {
      before(() => {
        stub(toggler, 'notifyToggleCreated')
        handler.notifyToggleCreated()
      })

      after(() => {
        toggler.notifyToggleCreated.restore()
      })

      it('calls toggler service with email addresses', () => {
        const spyCall = toggler.notifyToggleCreated.getCall(0)

        expect(spyCall.calledWith(sourceAddress, [toAddress])).to.be.equal(true)
      })
    })
  })
})
