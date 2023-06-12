import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as uuid from "uuid";

import {
  createAttachmentPresignedUrl,
  updateTodoAttachmentUrl,
} from "../../helpers/todos";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const attachmentId = uuid.v4();

    // Generate the presigned URL
    const uploadUrl = await createAttachmentPresignedUrl(attachmentId);

    if (uploadUrl) {
      const result = updateTodoAttachmentUrl(userId, todoId, attachmentId);

      if (result) {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            uploadUrl,
          }),
        };
      }
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Oops, something went wrong!",
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Oops, something went wrong!",
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
