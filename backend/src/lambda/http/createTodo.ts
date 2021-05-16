import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const name = process.env.Todo_Name

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  const todoId: string = uuid.v4()
  const userId = getUserId(event)
  const createdAt = new Date().toString()
  
  const newItem = {
    userId,
    createdAt,
    todoId,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachemntId}`,
    ...newTodo,
  }

  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise()
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "item": newItem
    })
  }
}

