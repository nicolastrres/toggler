const { expect } = require('chai')
const { stub } = require('sinon')
const dbClient = require('../clients/dbClient')
const emailClient = require('../clients/emailClient')

const toggler = require('../toggler')

describe('toggler', () => {
    describe('#getFeatures', () => {
        before(() => {
            stub(dbClient, 'getAllItems').withArgs('FeatureToggles').resolves([
                { name: 'feature1', value: true, anotherValue: false },
                { name: 'feature2', value: false, anotherThing: 1 }
            ])
        })

        it('gets features attributes from db response', async () => {
            const expectedFeatures = [
                { name: 'feature1', value: true },
                { name: 'feature2', value: false }
            ]

            const actualFeatures = await toggler.getFeatures()

            expect(actualFeatures).to.be.deep.equal(expectedFeatures)
        })
    })

    describe('#createFeature', () => {
        before(() => {
            stub(dbClient, 'addItem')
                .withArgs('FeatureToggles', { name: 'feature1', value: true })
                .resolves({ name: 'feature1', value: true })
        })

        it('creates a new feature only with valid fields', async () => {
            const featureToBeCreated = { name: 'feature1', value: true, anotherValue: false }
            const expectedFeature = { name: 'feature1', value: true }

            const actualFeature = await toggler.createFeature(featureToBeCreated)

            expect(actualFeature).to.be.deep.equal(expectedFeature)
        })

        it('raises an error when required fields are not provided', async () => {
            const featureWithoutValue = { name: 'feature1' }

            expect(() => toggler.createFeature(featureWithoutValue)).to.throw(Error, 'Missing parameter. Please provide name and value')
        })
    })

    describe('#notifyFeatureCreated', () => {
        before(() => {
            stub(emailClient, 'sendEmail')
                .withArgs('sourceAddress', 'toAddress', 'Feature was created', 'Feature was recently created')
                .resolves('email sent')
        })

        it('sends email with subject and body', async () => {
            const actualResponse = await toggler.notifyFeatureCreated('sourceAddress', 'toAddress')
            expect(actualResponse).to.be.equal('email sent')
        })
    })
})
