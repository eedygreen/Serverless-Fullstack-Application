import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'


const xray = AWSXRay.captureAWS(AWS)

export class Todo {
    constructor(
        private readonly docClient: DocumentClient = new xray.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly Index = process.env.INDEX_NAME
    ){}


async getTodo(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
        TableName: this.todoTable,
        IndexName: this.Index,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    const do_items = result.Items
    return do_items as TodoItem[]
}

async updateTodo(userId: string, todoId: string, updateTodo: UpdateTodoRequest){
    await this.docClient.update({
        TableName: this.todoTable,
        Key: {
            "userId": userId,
            "todoId": todoId,
        },
        UpdateExpression: "set #Date = :du, #name = :n, #done = :do",
           ExpressionAttributeNames: {
               '#Date': 'dueDate',
               '#name': 'name',
               '#done': 'done'
           },
           ExpressionAttributeValues: {
               ':du': updateTodo.dueDate,
               ':n': updateTodo.name,
               ':do': updateTodo.done
           }
    }).promise()
}

async deleteTodo(userId: string, todoId: string){
    await this.docClient.delete({
        TableName: this.todoTable,
        Key: {
            userId,
            todoId
        }
    }).promise()
   }

}