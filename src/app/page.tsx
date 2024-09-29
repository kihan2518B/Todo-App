"use client"

import { useState, useEffect } from "react";
import AddTodoForm from "@/components/AddTodoForm";
import ListTodo from "@/components/ListTodo";
import { TypeTodo } from "@/types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // For customizing toast styles

export default function Home() {
  const [todos, setTodos] = useState<TypeTodo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [addTodoLoading, setAddTodoLoading] = useState<boolean>(false)

  // Toast state
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

  // Fetch all todos on initial load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data.todos);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
      showToast("Failed to fetch todos", "error");
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodo.trim()) {
      showToast("Todo cannot be empty", "error");
      return;
    }

    try {
      setAddTodoLoading(true)
      const res = await fetch("/api/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });

      const data = await res.json();
      setTodos([...todos, data.todo]);
      setNewTodo("");
      showToast("Todo added successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add todo", "error");
    } finally {
      setAddTodoLoading(false)
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/delete?todoID=${id}`, {
        method: "DELETE",
      });
      const data = await res.json()

      console.log("data: ", data);

      fetchTodos(); // Refresh the todo list
      showToast("Todo deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete todo", "error");
    }
  };

  // Function to show toast
  const showToast = (message: string, severity: "success" | "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // Function to close the toast
  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>
      <AddTodoForm
        addTodoLoading={addTodoLoading}
        handleCreateTodo={handleCreateTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />

      <ListTodo
        loading={loading}
        error={error}
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
      />

      {/* Snackbar for toast messages */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // You can adjust the position
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
