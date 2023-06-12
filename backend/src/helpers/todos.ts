import * as uuid from "uuid";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { AttachmentUtils } from "./attachmentUtils";
import { TodosAccess } from "./todosAcess";

const todoAccess = new TodosAccess();
const todosAttachments = new AttachmentUtils();

export async function getTodosForUser(userId): Promise<TodoItem[]> {
  try {
    const result = await todoAccess.getTodosForUser(userId);
    return result;
  } catch (e) {
    return null;
  }
}

export async function getTodoForUser(userId, todoId): Promise<TodoItem> {
  try {
    const result = await todoAccess.getTodoForUser(userId, todoId);
    return result;
  } catch (e) {
    return null;
  }
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4();

  try {
    if (!createTodoRequest.name) return null;

    const result = await todoAccess.createTodo({
      todoId: todoId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: "",
      createdAt: new Date().toISOString(),
    });
    return result;
  } catch (e) {
    return null;
  }
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<Boolean> {
  try {
    const result = await todoAccess.deleteTodo(userId, todoId);
    return result;
  } catch (e) {}
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<any> {
  try {
    const result = await todoAccess.updateTodo(
      userId,
      todoId,
      updateTodoRequest
    );
    return result;
  } catch (e) {
    return false;
  }
}

export async function updateTodoAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string
): Promise<any> {
  const attachmentUrl = todosAttachments.getAttachmentUrl(attachmentId);

  try {
    const result = await todoAccess.updateTodoAttachmentUrl(
      userId,
      todoId,
      attachmentUrl
    );
    return result;
  } catch (e) {
    return null;
  }
}

export async function createAttachmentPresignedUrl(
  attachmentId: string
): Promise<string> {
  return todosAttachments.getUploadUrl(attachmentId);
}
