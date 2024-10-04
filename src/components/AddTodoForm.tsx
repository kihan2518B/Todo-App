import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from "date-fns";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddTodoFormProps {
    newTodo: string;
    setNewTodo: (title: string) => void;
    handleCreateTodo: () => void;
    addTodoLoading: boolean;
    newPriority: "Medium" | "Low" | "High";
    setNewPriority: (priority: "Medium" | "Low" | "High") => void;
    newCategory: string;
    setNewCategory: (category: string) => void;
    newDueDate: Date | null; // Allow null as a valid type
    setNewDueDate: (date: Date | null) => void; // Handle null
}

const priorityOptions = ["Low", "Medium", "High"];
const categoryOptions = ["Work", "Personal", "Shopping", "Health", "Other"];

export default function AddTodoForm({
    newTodo,
    setNewTodo,
    handleCreateTodo,
    addTodoLoading,
    newPriority,
    setNewPriority,
    newCategory,
    setNewCategory,
    newDueDate,
    setNewDueDate,
}: AddTodoFormProps) {
    return (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateTodo(); }} className="space-y-4">
                    <Input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Enter new task"
                        className="w-full"
                    />
                    <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {priorityOptions.map((priority) => (
                                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={newCategory} onValueChange={(value: any) => setNewCategory(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categoryOptions.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newDueDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newDueDate ? format(newDueDate, "PPP") : <span>Pick a due date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                value={newDueDate} // Accept Date | null
                                onChange={(date) => {
                                    if (Array.isArray(date)) {
                                        // If it's a range, use the first date
                                        setNewDueDate(date[0] || null);
                                    } else {
                                        // Otherwise, it's a single date or null
                                        setNewDueDate(date);
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button type="submit" disabled={addTodoLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> {addTodoLoading ? 'Adding...' : 'Add Task'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
