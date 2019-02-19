const AWS = require('aws-sdk')

const buildParams = (sourceAddress, toAddresses, subject, body) => {
  return {
    Destination: {
      ToAddresses: toAddresses
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: sourceAddress
  }
}

const sendEmail = (sourceAddress, toAddresses, subject, body) => {
  const sesClient = new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
  })
  return sesClient
    .sendEmail(buildParams(sourceAddress, toAddresses, subject, body))
    .promise()
}

module.exports = { sendEmail }
