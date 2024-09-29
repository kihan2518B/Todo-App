import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypeTodo } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface ListTodoProps {
    todos: TypeTodo[];
    handleDeleteTodo: (todoID: number) => void;
    loading: boolean;
    error: boolean
}

export default function ListTodo({ todos, handleDeleteTodo, loading, error }: ListTodoProps) {

    if (error) return <div className="text-red-500 hover:text-red-600">SomeThing went wrong...</div>
    return (
        <div>
            <ScrollArea className="max-h-[300px]">
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        {todos.length > 0 ? (
                            todos.map((todo: any) => (
                                <Card key={todo.id} className="mb-4">
                                    <CardContent className="flex justify-between items-center">
                                        <span className="text-lg">{todo.title}</span>
                                        <Button
                                            onClick={() => handleDeleteTodo(todo.id)}
                                            variant="outline"
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No todos yet!</p>
                        )}
                    </>
                )}

            </ScrollArea>
        </div>
    )
}
