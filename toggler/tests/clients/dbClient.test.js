const { expect } = require('chai')
const { addItem, getAllItems } = require('../../clients/dbClient')
const { spy } = require('sinon')
const path = require('path')

const AWS = require('aws-sdk-mock')
AWS.setSDK(path.resolve(__dirname, '../../node_modules/aws-sdk'))


describe('dbClient', () => {
  let putSpy

  before(() => {
    putSpy = spy()
    AWS.mock('DynamoDB.DocumentClient', 'scan', { Items: 'someItems' })
    AWS.mock('DynamoDB.DocumentClient', 'put', putSpy)
  })

  it('gets all items', async () => {
    const expectedItems = 'someItems'

    const items = await getAllItems('someTable')

    expect(items).to.be.equal(expectedItems)
  })

  it('adds an item', () => {
    addItem('someTable', 'someItem')

    expect(putSpy.calledOnceWith({
      Item: 'someItem',
      TableName: 'someTable'
    })).to.be.equal(true)

  })
})
