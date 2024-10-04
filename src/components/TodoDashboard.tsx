import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AddTodoForm from '@/components/AddTodoForm';
import ListTodos from '@/components/ListTodo';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TypeTodo } from '@/types';

interface TodoDashboardProps {
    todos: any[];
    loading: boolean;
    error: boolean;
    newTodo: string;
    setNewTodo: (title: string) => void;
    handleCreateTodo: () => void;
    addTodoLoading: boolean;
    newPriority: "Medium" | "Low" | "High";
    setNewPriority: (priority: "Medium" | "Low" | "High") => void;
    newCategory: string;
    setNewCategory: (category: string) => void;
    newDueDate: Date | null;
    setNewDueDate: (date: Date | null) => void;
    handleDeleteTodo: (id: number) => void;
    handleToggleComplete: (id: number) => void;
    handleUpdateTodo: (updatedTodo: TypeTodo) => void;
    editModalOpen: boolean;
    setEditModalOpen: (v: boolean) => void;
    currentTodo: TypeTodo | null;
    setCurrentTodo: (todo: TypeTodo | null) => void
}

export default function TodoDashboard({
    todos,
    loading,
    error,
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
    handleDeleteTodo,
    handleToggleComplete,
    handleUpdateTodo,
    editModalOpen,
    setEditModalOpen,
    currentTodo,
    setCurrentTodo
}: TodoDashboardProps) {
    // Prepare data for the charts
    const categoryData = todos.reduce((acc, task) => {
        if (task) {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        } else {
            return []
        }
    }, {});

    const chartData = Object.keys(categoryData).map(category => ({
        name: category,
        tasks: categoryData[category]
    }));

    // Prepare data for daily completed tasks
    const dailyTasks = todos.reduce((acc, task) => {

        const date = new Date(task.dueDate).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + (task.completed ? 1 : 0);
        return acc;
    }, {});

    const dailyChartData = Object.keys(dailyTasks).map(date => ({
        date,
        completed: dailyTasks[date]
    }));

    // Pie chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
            {/* Task Summary Component */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-800 dark:text-orange-300">Task Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <div className="font-bold">Total Tasks</div>
                            <div className="text-2xl">{todos.length}</div>
                        </div>
                        <div className="text-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <div className="font-bold">Completed</div>
                            <div className="text-2xl">{todos.filter(todo => todo.completed).length}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col w-full items-start justify-between p-6 lg:flex-row gap-6">
                {/* Left Side - Add Todo Form */}
                <div className="w-full lg:w-1/3 h-fit">
                    <AddTodoForm
                        newTodo={newTodo}
                        setNewTodo={setNewTodo}
                        handleCreateTodo={handleCreateTodo}
                        addTodoLoading={addTodoLoading}
                        newPriority={newPriority}
                        setNewPriority={setNewPriority}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        newDueDate={newDueDate}
                        setNewDueDate={setNewDueDate}
                    />
                </div>

                {/* Tasks List Component */}
                <div className="w-full">

                    <ListTodos
                        setCurrentTodo={setCurrentTodo}
                        currentTodo={currentTodo}
                        setEditModalOpen={setEditModalOpen}
                        editModalOpen={editModalOpen}
                        todos={todos}
                        loading={loading}
                        error={error}
                        handleUpdateTodo={handleUpdateTodo}
                        handleDeleteTodo={handleDeleteTodo}
                        handleToggleComplete={handleToggleComplete}
                    />
                </div>
            </div>

            {/* Right Side - Tasks, Charts*/}
            <div className="w-full flex-col flex md:flex-row gap-5 items-start justify-start ">
                {/* Daily Completed Tasks Chart */}
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">Daily Completed Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tasks by Category Pie Chart */}
                <Card className="bg-white/80 m-0 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className=" m-0 text-2xl font-bold text-blue-800 dark:text-blue-300">Tasks by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={chartData} dataKey="tasks" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
