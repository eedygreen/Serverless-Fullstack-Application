import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'



const todoTable = process.env.TODO_TABLE
const bucketName = process.env.UPLOAD_S3_BUCKET

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId  = event.pathParameters.todoId
  const imageId = uuid.v4()
  const userId  = getUserId(event)

  const objecturl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: 300
  })

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  await docClient.update({
    TableName: todoTable,
    Key: { "todoId": todoId, "userId": userId },
    UpdateExpression: "set attachmentUrl = :objecturl",
    ExpressionAttributeValues: {
      ":objecturl": imageUrl
    },   
  }).promise()
// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        imageUrl: imageUrl,
        uploadUrl: objecturl
      })
    }

}
