import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { getTodo } from '../../businessLogic/todologic'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const result = await getTodo(userId)
    
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Orgin': '*'
    },
    body: JSON.stringify({
      "items": result
    })

}
}).use(cors({
  credentials: true
}))
