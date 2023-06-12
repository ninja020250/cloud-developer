import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import "source-map-support/register";
import { createTodo } from '../../helpers/todos';
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const newTodo = await createTodo(body, userId);

    if (newTodo) {
      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Contol-Allow-Credentials": true,
        },
        body: JSON.stringify({
          item: newTodo,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Oops, Somethings went wrong!",
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
