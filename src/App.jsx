import React, { useState, useEffect } from "react";
import { Search, Filter, Menu } from "lucide-react";
import { boardAPI, taskAPI } from "./services/api";
import Sidebar from "./components/Sidebar";
import BoardColumn from "./components/BoardColumn";
import TaskModal from "./components/TaskModal";
import "./App.css";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load boards on mount
  useEffect(() => {
    loadBoards();
  }, []);

  // Load tasks when board changes
  useEffect(() => {
    if (selectedBoard) {
      loadTasks(selectedBoard._id);
    }
  }, [selectedBoard]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const data = await boardAPI.getAll();
      setBoards(data);
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0]);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load boards: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (boardId) => {
    try {
      const data = await boardAPI.getTasks(boardId);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks: " + err.message);
    }
  };

  const handleCreateBoard = async (name) => {
    try {
      const board = await boardAPI.create({ name });
      setBoards([...boards, board]);
      setSelectedBoard(board);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask?._id) {
        await taskAPI.update(editingTask._id, taskData);
      } else {
        await taskAPI.create(taskData);
      }
      loadTasks(selectedBoard._id);
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.delete(taskId);
        loadTasks(selectedBoard._id);
      } catch (err) {
        alert("Failed to delete task: " + err.message);
      }
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (newStatus) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await taskAPI.update(draggedTask._id, { status: newStatus });
        loadTasks(selectedBoard._id);
      } catch (err) {
        alert("Failed to update task: " + err.message);
      }
    }
    setDraggedTask(null);
  };

  const openTaskModal = (status = "To Do", task = null) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask({ status });
    }
    setShowModal(true);
  };

  const closeTaskModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const statuses = ["To Do", "In Progress", "Done"];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-base sm:text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        boards={boards}
        selectedBoard={selectedBoard}
        onSelectBoard={(board) => {
          setSelectedBoard(board);
          setSidebarOpen(false);
        }}
        onCreateBoard={handleCreateBoard}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {selectedBoard ? (
          <>
            <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-700 hover:text-gray-900 mr-2 sm:mr-3 p-1"
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate flex-1">
                  {selectedBoard.name}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks by title or description..."
                    className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative sm:w-40">
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6">
              <div className="flex gap-4 sm:gap-6 h-full min-w-min pb-4">
                {statuses.map((status) => (
                  <BoardColumn
                    key={status}
                    status={status}
                    tasks={filteredTasks.filter((t) => t.status === status)}
                    onAddTask={(s) => openTaskModal(s)}
                    onEditTask={(task) => openTaskModal(task.status, task)}
                    onDeleteTask={handleDeleteTask}
                    onDrop={handleDrop}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Open Boards
              </button>
              <p className="text-gray-500 text-base sm:text-lg mb-2">
                No board selected
              </p>
              <p className="text-gray-400 text-sm">
                Create a board to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          boardId={selectedBoard._id}
        />
      )}
    </div>
  );
}

export default App;
