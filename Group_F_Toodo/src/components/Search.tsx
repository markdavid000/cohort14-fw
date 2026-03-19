import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  completedAt: string | null;
}

interface SearchProps {
  tasks: Task[];
  onSearchChange?: (results: Task[]) => void;
}

export function Search({ tasks, onSearchChange }: SearchProps) {
  const [query, setQuery] = useState('');

  const searchTasks = (searchQuery: string): Task[] => {
    if (!searchQuery.trim()) {
      return tasks;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter((task) =>
      task.text.toLowerCase().includes(lowerQuery) 
    );
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    const results = searchTasks(value);
    onSearchChange?.(results);
  };

  const clearSearch = () => {
    setQuery('');
    onSearchChange?.(tasks);
  };

  return {
    query,
    searchTasks,
    handleSearch,
    clearSearch,
    results: searchTasks(query),
  };
}
