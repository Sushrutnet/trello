import { Client } from 'appwrite';
import { databases } from '@/appwrite';
import Board from '@/components/Board';

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  console.log(data);
  

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.has(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done","backlog"];

  // Add empty columns for each type if they don't exist
  for (const columnType of columnTypes) {
    if (!columns.has(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  // Sort the columns based on columnTypes order
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board = {
    columns: sortedColumns,
  };

  return board;
};
