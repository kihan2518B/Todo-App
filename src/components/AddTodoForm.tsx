import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTodoFormProps {
    newTodo: string;
    setNewTodo: (title: string) => void;
    handleCreateTodo: () => void;
    addTodoLoading: boolean
}

export default function AddTodoForm({ newTodo, setNewTodo, handleCreateTodo, addTodoLoading }: AddTodoFormProps) {
    return (
        <div>
            <Card className="mb-4 p-4">
                <CardHeader>
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="New Todo"
                        className="mb-4"
                    />
                </CardHeader>
                <CardFooter>
                    {addTodoLoading ? (
                        <Button
                            disabled
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Adding...
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCreateTodo}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Add Todo
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div >
    )
}
