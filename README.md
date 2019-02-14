# Toggler [![Build Status](https://travis-ci.org/nicolastrres/toggler.svg?branch=master)](https://travis-ci.org/nicolastrres/toggler)

Simple feature toggle service using:

## Features:
* Create and retrieve feature toggles
* Notify users when feature toggles are created

## Future features:
* Create strategies to enable/disable feature toggles
* Store metrics for each feature toggle
* UI to make it easier to configure feature toggles
* Clients to easy retrieve data from API


## Technologies:
* Node.js 8.10.0
* [Serverless framework](https://serverless.com/)
* AWS Services
  * Lambda functions
  * Dynamodb
  * API gateway
  * S3
  * SES
* Testing tools
  * Mocha
  * Chai
  * Sinon
  * [aws-sdk-mock](https://github.com/dwyl/aws-sdk-mock)
