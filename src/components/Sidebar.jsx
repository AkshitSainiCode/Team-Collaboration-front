import React, { useState } from "react";
import { Plus, Folder, X } from "lucide-react";

const Sidebar = ({
  boards,
  selectedBoard,
  onSelectBoard,
  onCreateBoard,
  isOpen,
  onClose,
}) => {
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async () => {
    if (!newBoardName.trim()) return;

    setIsCreating(true);
    try {
      await onCreateBoard(newBoardName);
      setNewBoardName("");
    } catch (error) {
      alert("Failed to create board: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 sm:w-72 bg-white shadow-lg flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Folder className="text-blue-500" size={24} />
              <span>Boards</span>
            </h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="New board name..."
              disabled={isCreating}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSubmit}
              disabled={isCreating || !newBoardName.trim()}
              className="bg-blue-500 text-white rounded px-3 py-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              title="Create board"
              aria-label="Create board"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {boards.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              No boards yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {boards.map((board) => (
                <button
                  key={board._id}
                  onClick={() => onSelectBoard(board)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedBoard?._id === board._id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-medium truncate">{board.name}</div>
                  {board.createdAt && (
                    <div
                      className={`text-xs mt-1 ${
                        selectedBoard?._id === board._id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      Created {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          {boards.length} board{boards.length !== 1 ? "s" : ""} total
        </div>
      </div>
    </>
  );
};

export default Sidebar;
