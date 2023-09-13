import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { todo } from "node:test";
import { create } from "zustand";

// Define the types for your board state
interface BoardState {
  // setImage: any;
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoID: Todo, id: TypedColumn) => void;

  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columId: TypedColumn) => void;
  setImage:(image:File | null) => void;
}

// Create a Zustand store
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",
  newTaskInput: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskType: "todo",
  image: null,

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  addTask: async (todo: string, columId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const {$id} = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID! ,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columId);

      if (!column) {
        newColumns.set(columId, {
          id: columId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
