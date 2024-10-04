import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TypeTodo } from '@/types';

interface EditTodoModalProps {
  todo: TypeTodo;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTodo: (updatedTodo: TypeTodo) => void;
}

const categoryOptions = ["Work", "Personal", "Shopping", "Health", "Other"];

export default function EditTodoModal({
  todo,
  isOpen,
  onClose,
  onUpdateTodo,
}: EditTodoModalProps) {
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [updatedPriority, setUpdatedPriority] = useState<"Medium" | "Low" | "High">(todo.priority);
  const [updatedCategory, setUpdatedCategory] = useState(todo.category);
  const [EditLoading, setEditLoading] = useState<boolean>(false)

  const handleUpdate = () => {
    setEditLoading(true)
    const updatedTodo = {
      ...todo,
      title: updatedTitle,
      priority: updatedPriority,
      category: updatedCategory,
    };
    onUpdateTodo(updatedTodo);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Task Title"
          />
          <Select value={updatedPriority} onValueChange={setUpdatedPriority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={updatedCategory}
            onValueChange={setUpdatedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          {EditLoading ? (
            <Button disabled>Updating...</Button>
          ) : (
            <Button onClick={handleUpdate}>Update Task</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
