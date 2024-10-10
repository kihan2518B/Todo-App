import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Calendar, CheckCircle, XCircle, PlusCircle, BarChart2 } from 'lucide-react';
import AddTodoForm from '@/components/AddTodoForm';
import ListTodos from '@/components/ListTodo';
import EditTodoModal from '@/components/EditTodoModal';
import { TypeTodo } from '@/types';

interface TodoDashboardProps {
    todos: TypeTodo[];
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
}

const TodoDashboard: React.FC<TodoDashboardProps> = ({
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
}) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentTodo, setCurrentTodo] = useState<TypeTodo | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false)

    // Prepare data for the charts
    const categoryData = todos.reduce((acc: Record<string, number>, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(categoryData).map(category => ({
        name: category,
        tasks: categoryData[category]
    }));

    // Prepare data for daily completed tasks
    const dailyTasks = todos.reduce((acc: Record<string, number>, task) => {
        const date = new Date(task.dueDate).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + (task.completed ? 1 : 0);
        return acc;
    }, {});

    const dailyChartData = Object.keys(dailyTasks).map(date => ({
        date,
        completed: dailyTasks[date]
    }));

    // Prepare data for priority distribution
    const priorityData = todos.reduce((acc: Record<string, number>, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    const priorityChartData = Object.keys(priorityData).map(priority => ({
        name: priority,
        tasks: priorityData[priority]
    }));

    // Pie chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Todo Dashboard</h1>
                <Button
                    onClick={() => setIsAddFormOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Task
                </Button>
            </header>

            {/* Add Todo Form (Conditional Render) */}
            {isAddFormOpen && (
                <AddTodoForm
                    isAddFormOpen={isAddFormOpen}
                    setIsAddFormOpen={setIsAddFormOpen}
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
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task List Column */}
                <Card className="lg:col-span-2 p-3 h-fit bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                    {/* <CardHeader>
                        <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">Tasks Overview</CardTitle>
                    </CardHeader> */}
                    <ListTodos
                        todos={todos}
                        loading={loading}
                        error={error}
                        handleDeleteTodo={handleDeleteTodo}
                        handleToggleComplete={handleToggleComplete}
                        handleUpdateTodo={handleUpdateTodo}
                        editModalOpen={editModalOpen}
                        setEditModalOpen={setEditModalOpen}
                        currentTodo={currentTodo}
                        setCurrentTodo={setCurrentTodo}
                    />
                </Card>

                {/* Analytics Column */}
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">{todos.length}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">{todos.filter(todo => todo.completed).length}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <XCircle className="h-8 w-8 text-yellow-600 mb-2" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">{todos.filter(todo => !todo.completed).length}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <BarChart2 className="h-8 w-8 text-purple-600 mb-2" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
                                <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">{Object.keys(categoryData).length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="category">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="category">Category</TabsTrigger>
                                    <TabsTrigger value="priority">Priority</TabsTrigger>
                                    <TabsTrigger value="daily">Daily</TabsTrigger>
                                </TabsList>
                                <TabsContent value="category">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="tasks"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                                <TabsContent value="priority">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={priorityChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="tasks" fill="#8884d8">
                                                {priorityChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                                <TabsContent value="daily">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dailyChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="completed" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TodoDashboard;