// import { useTodo } from "./useTodo";

import { useTodo } from "../hooks/useTodo";

export default function TodoList() {
  const {
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
  } = useTodo();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === "Enter") confirmEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0b2a3a" }}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl p-8"
        style={{ backgroundColor: "#0d3347" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white text-3xl font-bold">To-Do List</h1>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors underline underline-offset-2"
            >
              Clear completed
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-slate-400 text-xs mb-1.5">
            {completedCount} of {totalCount} tasks completed
          </p>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{
                width:
                  totalCount > 0
                    ? `${(completedCount / totalCount) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>

        {/* Input Row */}
        <div className="flex gap-3 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Please Enter a New task"
            className="flex-1 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 outline-none text-sm border border-slate-600 focus:border-yellow-400 transition-colors"
            style={{ backgroundColor: "transparent" }}
          />
          <button
            onClick={addTask}
            className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-bold px-6 py-3 rounded-lg uppercase tracking-widest text-sm transition-all duration-150"
          >
            Add
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-xs mb-4 pl-1">{error}</p>}

        {/* Spacer when no error */}
        {!error && <div className="mb-4" />}

        {/* Search Row */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-lg px-4 py-2 text-slate-300 placeholder-slate-500 outline-none text-xs border border-slate-700 focus:border-yellow-400 transition-colors"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        {/* Task List */}
        <ul className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-lg px-4 py-3 border border-slate-700/50 hover:border-slate-600 transition-colors"
              style={{ backgroundColor: "#0d3347" }}
            >
              {/* Left: checkbox + text */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all duration-150 ${
                    task.completed
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-transparent border-slate-500 hover:border-yellow-400"
                  }`}
                  aria-label={
                    task.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {task.completed && (
                    <svg
                      className="w-3 h-3 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex flex-col min-w-0">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editingText}
                      autoFocus
                      onChange={(e) => {
                        setEditingText(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                      onBlur={() => confirmEdit(task.id)}
                      className="bg-transparent border-b border-yellow-400 text-slate-200 text-sm outline-none py-0.5 w-full"
                    />
                  ) : (
                    <span
                      className={`text-sm truncate transition-all duration-150 ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-slate-200"
                      }`}
                    >
                      {task.text}
                    </span>
                  )}

                  {/* Timestamps */}
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v8l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                        />
                      </svg>
                      Added {task.createdAt}
                    </span>

                    {task.completed && task.completedAt && (
                      <span className="text-xs text-yellow-400/70 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Done at {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {editingId === task.id ? (
                  <>
                    <button
                      onClick={() => confirmEdit(task.id)}
                      className="bg-green-500 hover:bg-green-400 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all duration-150"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-slate-600 hover:bg-slate-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all duration-150"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(task)}
                    disabled={task.completed}
                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-all duration-150 ${
                      task.completed
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-400 active:scale-95 text-white"
                    }`}
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-400 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all duration-150"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}

          {filteredTasks.length === 0 && (
            <li className="text-center text-slate-500 py-8 text-sm">
              {searchQuery
                ? `No tasks found matching "${searchQuery}"`
                : "No tasks yet. Add one above!"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
