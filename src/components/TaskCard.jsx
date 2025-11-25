import React from "react";
import { Edit2, Trash2, Calendar, User } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onDragStart }) => {
  const priorityColors = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 flex-1 pr-2 text-sm sm:text-base break-words">
          {task.title}
        </h4>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3 break-words">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
        <span
          className={`px-2 py-1 rounded border ${
            priorityColors[task.priority]
          } whitespace-nowrap`}
        >
          {task.priority}
        </span>

        {task.assignedTo && (
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 whitespace-nowrap">
            <User size={12} />
            <span className="hidden xs:inline sm:inline truncate max-w-[100px]">
              {task.assignedTo}
            </span>
          </span>
        )}

        {task.dueDate && (
          <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1 whitespace-nowrap">
            <Calendar size={12} />
            <span className="hidden xs:inline sm:inline">
              {formatDate(task.dueDate)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
