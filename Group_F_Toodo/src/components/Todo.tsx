interface Task {
  id: number;
  text: string;
  completed: boolean;
  completedAt: string | null;
}


// Initial Demo task 
const initialTasks: Task[] = [
  { id: 1, text: "Exercise", completed: false, completedAt: null },
  { id: 2, text: "Go to shopping", completed: true, completedAt: "10:30 AM" },
  { id: 3, text: "Meet my friends", completed: false, completedAt: null },
  {
    id: 4,
    text: "Responding to client request",
    completed: false,
    completedAt: null,
  },
  {
    id: 5,
    text: "Finish writing the report",
    completed: false,
    completedAt: null,
  },
];

export default function TodoList() {
  const tasks = initialTasks;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0b2a3a" }}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl p-8"
        style={{ backgroundColor: "#0d3347" }}
      >
        {/* Title */}
        <h1 className="text-white text-3xl font-bold mb-6">To-Do List</h1>

        {/* Input Row */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value=""
            readOnly
            placeholder="Please Enter a New task"
            className="flex-1 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 outline-none text-sm border border-slate-600 focus:border-yellow-400 transition-colors"
            style={{ backgroundColor: "transparent" }}
          />
          <button
            type="button"
            disabled
            className="bg-yellow-400/60 text-slate-900 font-bold px-6 py-3 rounded-lg uppercase tracking-widest text-sm cursor-not-allowed"
            aria-disabled="true"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-lg px-4 py-3 border border-slate-700/50 hover:border-slate-600 transition-colors"
              style={{ backgroundColor: "#0d3347" }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Custom Checkbox */}
                <button
                  type="button"
                  disabled
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all duration-150 ${
                    task.completed
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-transparent border-slate-500"
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

                {/* Task Text + Completed Time */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm transition-all duration-150 truncate ${
                      task.completed
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                    }`}
                  >
                    {task.text}
                  </span>

                  {/* Completed At Time */}
                  {task.completed && task.completedAt && (
                    <span className="text-xs text-yellow-400/70 mt-0.5 flex items-center gap-1">
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
                          d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                        />
                      </svg>
                      Completed at {task.completedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <button
                  type="button"
                  disabled
                  className="bg-blue-500/60 text-white text-xs font-semibold px-4 py-1.5 rounded cursor-not-allowed"
                  aria-disabled="true"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled
                  className="bg-red-500/60 text-white text-xs font-semibold px-4 py-1.5 rounded cursor-not-allowed"
                  aria-disabled="true"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}
