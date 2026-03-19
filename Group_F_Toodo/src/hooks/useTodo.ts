import { useState, useCallback } from "react";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const STORAGE_KEY = "todo-tasks";

const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultTasks();
  } catch {
    return defaultTasks();
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const defaultTasks = (): Task[] => [
  {
    id: 1,
    text: "Exercise",
    completed: false,
    completedAt: null,
    createdAt: "9:00 AM",
  },
  {
    id: 2,
    text: "Go to shopping",
    completed: true,
    completedAt: "10:30 AM",
    createdAt: "8:45 AM",
  },
  {
    id: 3,
    text: "Meet my friends",
    completed: false,
    completedAt: null,
    createdAt: "8:00 AM",
  },
  {
    id: 4,
    text: "Responding to client request",
    completed: false,
    completedAt: null,
    createdAt: "7:30 AM",
  },
  {
    id: 5,
    text: "Finish writing the report",
    completed: false,
    completedAt: null,
    createdAt: "7:00 AM",
  },
];

export const useTodo = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const updateAndPersist = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveTasks(next);
      return next;
    });
  }, []);

  // Aadding of Todo
  const addTask = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Task cannot be empty.");
      return;
    }
    const isDuplicate = tasks.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setError("Task already exists.");
      return;
    }
    setError("");
    updateAndPersist((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
        completedAt: null,
        createdAt: getCurrentTime(),
      },
    ]);
    setInputValue("");
  }, [inputValue, tasks, updateAndPersist]);

  //Marking Todo Completed
  const toggleTask = useCallback(
    (id: number) => {
      updateAndPersist((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? getCurrentTime() : null,
              }
            : task,
        ),
      );
    },
    [updateAndPersist],
  );

  //Delete Todo
  const deleteTask = useCallback(
    (id: number) => {
      if (editingId === id) {
        setEditingId(null);
        setEditingText("");
      }
      updateAndPersist((prev) => prev.filter((task) => task.id !== id));
    },
    [editingId, updateAndPersist],
  );


  // Editing/Updating Of Todo
  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
    setError("");
  }, []);

  // Saving Edit
  const confirmEdit = useCallback(
    (id: number) => {
      const trimmed = editingText.trim();
      if (!trimmed) {
        setError("Task cannot be empty.");
        return;
      }
      const isDuplicate = tasks.some(
        (t) => t.id !== id && t.text.toLowerCase() === trimmed.toLowerCase(),
      );
      if (isDuplicate) {
        setError("Task already exists.");
        return;
      }
      setError("");
      updateAndPersist((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, text: trimmed } : task,
        ),
      );
      setEditingId(null);
      setEditingText("");
    },
    [editingText, tasks, updateAndPersist],
  );

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
    setError("");
  }, []);


  // 
  const clearCompleted = useCallback(() => {
    updateAndPersist((prev) => prev.filter((t) => !t.completed));
  }, [updateAndPersist]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return {
    tasks,
    inputValue,
    setInputValue,
    searchQuery,
    setSearchQuery,
    editingId,
    editingText,
    setEditingText,
    error,
    setError,
    addTask,
    toggleTask,
    deleteTask,
    startEdit,
    confirmEdit,
    cancelEdit,
    clearCompleted,
    completedCount,
    totalCount,
  };
};
