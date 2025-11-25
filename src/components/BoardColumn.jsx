import React, { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const BoardColumn = ({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDrop,
  onDragStart,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only reset if leaving the column itself, not child elements
    if (e.currentTarget === e.target) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(status);
  };

  const statusColors = {
    "To Do": "bg-gray-100",
    "In Progress": "bg-blue-50",
    Done: "bg-green-50",
  };

  return (
    <div
      className={`flex-1 min-w-[280px] sm:min-w-[320px] rounded-lg p-3 sm:p-4 transition-all ${
        statusColors[status]
      } ${dragOver ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2 text-base sm:text-lg">
          <span className="truncate">{status}</span>
          <span className="bg-white px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-normal text-gray-600 shadow-sm flex-shrink-0">
            {tasks.length}
          </span>
        </h3>
        <button
          onClick={() => onAddTask(status)}
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-1.5 rounded transition-colors flex-shrink-0"
          title={`Add task to ${status}`}
          aria-label={`Add task to ${status}`}
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 min-h-[100px]">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-6 sm:py-8 text-xs sm:text-sm">
            No tasks yet. Click + to add one.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
