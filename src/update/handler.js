'use strict';
const { DynamoDB } = require("aws-sdk");
const AWS = require("aws-sdk")

module.exports.update = async (event, context) => {
    let bodyObj = {}
    try {
        bodyObj = JSON.parse(event.body)
    } catch (jsonError) {
        console.log("Errore", jsonError)
        return {
            statusCode: 400
        }
    }
    if (typeof bodyObj.anni === "undefined") {
        console.log("Missing parameters")
        return {
            statusCode: 400
        }
    }

    let updateParams = {
        TableName: process.env.DYNAMODB_GATTI_TABLE,
        Key: {
            nome: event.pathParameters.nome
        },
        UpdateExpression: 'set anni = :anni',
        ExpressionAttributeValues: { ':anni': bodyObj.anni }
    }

    try {
        let dynamodb = new AWS.DynamoDB.DocumentClient()
        await dynamodb.update(updateParams).promise()
    } catch (updateError) {
        console.log("c'è stato un errore nel prendere il gatto")
        console.log(updateError)
        return {
            statusCode: 500
        }
    }

    return {
        statusCode: 200,
    }
}