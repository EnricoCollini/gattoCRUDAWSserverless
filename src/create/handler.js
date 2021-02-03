'use strict';
const { DynamoDB } = require("aws-sdk");
const AWS = require("aws-sdk")

module.exports.create = async (event, context) => {
    let bodyObj = {}
    try {
        bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
        console.log("Errore", jsonError)
        return {
            statusCode: 400
        }
    }
    if (typeof bodyObj.nome === 'undefined' || typeof bodyObj.anni === "undefined") {
        console.log("Missing parameters")
        return {
            statusCode: 400
        }
    }

    let putParams = {
        TableName: process.env.DYNAMODB_GATTI_TABLE,
        Item: {
            nome: bodyObj.nome,
            anni: bodyObj.anni
        }
    }
    let putResult = {}
    try {
        let dynamodb = new AWS.DynamoDB.DocumentClient()
        putResult = await dynamodb.put(putParams).promise()
    } catch (putError) {
        console.log("C'è un errore nell'inserimento del gatto")
        console.log("putParams", putParams)
        return {
            statusCode: 500
        }
    }

    return {
        statusCode: 201
    }
}
