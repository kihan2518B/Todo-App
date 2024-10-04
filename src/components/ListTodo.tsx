import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import EditTodoModal from '@/components/EditTodoModal';

import Skeleton from '@mui/material/Skeleton';

import { TypeTodo } from '@/types'

interface ListTodosProps {
    todos: any[];
    loading: boolean;
    error: boolean;
    handleDeleteTodo: (id: number) => void;
    handleToggleComplete: (id: number) => void;
    handleUpdateTodo: (updatedTodo: TypeTodo) => void;
    editModalOpen: boolean;
    setEditModalOpen: (v: boolean) => void;
    currentTodo: TypeTodo | null;
    setCurrentTodo: (todo: TypeTodo | null) => void
}

const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-amber-500',
    Low: 'bg-green-500'
};

export default function ListTodos({
    todos,
    loading,
    error,
    handleDeleteTodo,
    handleToggleComplete,
    handleUpdateTodo,
    editModalOpen,
    setEditModalOpen,
    currentTodo,
    setCurrentTodo
}: ListTodosProps) {

    const handleEditTodo = (todo: TypeTodo) => {
        setCurrentTodo(todo); // Set the selected todo to be edited
        setEditModalOpen(true); // Open the modal
    };


    if (error) return <div>Error loading todos</div>;

    return (

        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl">
            <CardHeader>
                <CardTitle className="flex justify-between items-center text-2xl font-bold text-purple-800 dark:text-purple-300">
                    <span>Tasks Overview</span>
                </CardTitle>
            </CardHeader>
            {loading ? (
                <CardContent className='h-[400px] pr-4'>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </CardContent>

            ) : (
                <CardContent>
                    {todos.length == 0 && (<>Can't find any task</>)}
                    <ScrollArea className="h-[400px] pr-4">
                        {todos.map((task: TypeTodo) => (
                            <div key={task.id} className="flex mb-2 items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-full flex items-center space-x-4">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => handleToggleComplete(task.id)}
                                        className="border-purple-400 text-purple-600"
                                    />
                                    <div className='flex w-full items-center justify-start gap-5'>
                                        <span className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>{task.title}</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge variant="outline" className={`${priorityColors[task.priority]} text-white px-2 py-1 text-xs font-semibold rounded-full`}>
                                                {task.priority}
                                            </Badge>
                                            <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 text-xs font-semibold rounded-full">{task.category}</Badge>
                                            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 flex items-center px-2 py-1 text-xs font-semibold rounded-full">
                                                <Calendar className="w-3 h-3 mr-1" />{task.dueDate.split("T")[0]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditTodo(task)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTodo(task.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            )}
            {currentTodo && (
                <EditTodoModal
                    todo={currentTodo}
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onUpdateTodo={handleUpdateTodo}
                />
            )}
        </Card>
    );
}