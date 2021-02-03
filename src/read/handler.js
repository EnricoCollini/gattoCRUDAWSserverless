'use strict';
const { DynamoDB } = require("aws-sdk");
const AWS = require("aws-sdk")

module.exports = {
    list: async (event, context) => {
        let scanParams = {
            TableName: process.env.DYNAMODB_GATTI_TABLE
        }
        let scanResult = {}
        try {
            let dynamodb = new AWS.DynamoDB.DocumentClient()
            scanResult = await dynamodb.scan(scanParams).promise()
        } catch (scanError) {
            console.log("C'è stato un errore scansionando i gatti")
            console.log("putParams", putParams)
            return {
                statusCode: 500
            }
        }

        if (scanResult.Item === null || !Array.isArray(scanResult.Items) || scanResult.Items.length === 0) {
            return {
                statusCode: 404
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(scanResult.Items.map(gatto => {
                return {
                    nome: gatto.nome,
                    anni: gatto.anni
                }
            }))
        }
    },
    get: async (event, context) => {
        let getParams = {
            TableName: process.env.DYNAMODB_GATTI_TABLE,
            Key: {
                nome: event.pathParameters.nome
            }
        }
        let getResult = {}
        try {
            let dynamodb = new AWS.DynamoDB.DocumentClient()
            getResult = await dynamodb.get(getParams).promise()
        } catch (getError) {
            console.log("c'è stato un errore nel prendere il gatto")
            console.log(getError)
            return {
                statusCode: 500
            }
        }

        if (getResult.Item === null) {
            return {
                statusCode: 404
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                nome: getResult.Item.nome,
                anni: getResult.Item.anni
            })
        }
    }
}