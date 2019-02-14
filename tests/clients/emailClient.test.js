const { expect } = require('chai')
const { spy } = require('sinon')
const AWS = require('aws-sdk-mock')
const path = require('path')

AWS.setSDK(path.resolve(__dirname, '../../node_modules/aws-sdk'))

const { sendEmail } = require('../../clients/emailClient')


const expectedEmailParams = {
    Destination: {
        ToAddresses: [
            'some-email@gmail.com'
        ]
    },
    Message: {
        Body: {
            Html: {
                Charset: 'UTF-8',
                Data: 'some-body'
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'some-subject'
        }
    },
    Source: 'some-email-sender@gmail.com'
}


describe('emailClient', () => {
    const sendEmailSpy = spy()

    before(() => {
        AWS.mock('SES', 'sendEmail', sendEmailSpy)
    })

    it('sends email from source to email addresses with body and subject', () => {
        const sourceAddress = 'some-email-sender@gmail.com'
        const toAddresses = ['some-email@gmail.com']
        const subject = 'some-subject'
        const body = 'some-body'

        sendEmail(sourceAddress, toAddresses, subject, body)

        expect(sendEmailSpy.calledOnceWith(expectedEmailParams)).to.be.equal(true)
    })
})
