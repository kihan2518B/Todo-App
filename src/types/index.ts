// types.ts
export interface TypeTodo {
    id: number;
    title: string;
    priority: "Low" | "Medium" | "High";
    category: string;
    completed: boolean;
    dueDate: string;
}