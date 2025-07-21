import {
  GripVertical,
  Trash2,
  Pencil,
  Timer,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  MoreHorizontal,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem, TaskPriority } from "@/application/atoms/todoListAtom";
import { useState, useRef, useEffect } from "react";
import { playSound } from "@/infrastructure/lib/utils";

type TaskItemProps = {
  task: TaskItem;
  sessionCount: number;
  onRemove: (id: string) => void;
  onMove: (id: string, category: TaskItem["category"]) => void;
  onEdit: (id: string, content: string) => void;
};

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
};

const projectColors: Record<string, string> = {
  "project-phoenix": "bg-purple-100 text-purple-800",
  "q3-marketing": "bg-blue-100 text-blue-800",
  "research": "bg-green-100 text-green-800",
  "development": "bg-orange-100 text-orange-800",
  "general": "bg-gray-100 text-gray-800",
};

const projectLabels: Record<string, string> = {
  "project-phoenix": "Phoenix",
  "q3-marketing": "Q3 Marketing",
  "research": "Research",
  "development": "Development",
  "general": "General",
};

export const SortableTaskItem = ({
  task,
  sessionCount,
  onRemove,
  onMove,
  onEdit,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [showSubTasks, setShowSubTasks] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    playSound("/sounds/click.mp3");
    if (isEditing) {
      onEdit(task.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedContent(task.content);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      optionsButtonRef.current &&
      !optionsButtonRef.current.contains(e.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <li ref={setNodeRef} style={style} className="bg-white border border-gray-200 my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Priority indicator */}
        <div className={`w-1 rounded-l-lg ${priorityColors[task.priority]}`} />
        
        <div className="flex flex-col justify-center items-start relative w-full p-3">
          {/* Main task content */}
          <div className="flex w-full items-center mb-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab mr-3 touch-none"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEdit}
                className="text-sm flex-grow border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-gray-900 break-words flex-grow">
                {task.content}
              </span>
            )}
            
            {/* Options menu */}
            <div className="relative ml-2">
              <button
                ref={optionsButtonRef}
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                  >
                    <Pencil className="h-3 w-3 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => onRemove(task.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project tag */}
          {task.project && (
            <div className={`text-xs px-2 py-1 rounded-full ${projectColors[task.project]} mb-2`}>
              {projectLabels[task.project]}
            </div>
          )}

          {/* Bottom row - metadata and status */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {/* Sub-tasks indicator */}
              {totalSubTasks > 0 && (
                <button
                  onClick={() => setShowSubTasks(!showSubTasks)}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  <CheckSquare className="h-3 w-3" />
                  <span>{completedSubTasks}/{totalSubTasks}</span>
                  {showSubTasks ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
              
              {/* Session count */}
              {sessionCount > 0 && (
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <span>{sessionCount} sessions</span>
                </div>
              )}
              
              {/* Due date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${
                  new Date(task.dueDate) < new Date() ? 'text-red-600' : ''
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Assignee avatar */}
              {task.assignee && (
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  title={task.assignee.name}
                />
              )}
              
              {/* Status selector */}
              <select
                value={task.category}
                onChange={(e) =>
                  onMove(task.id, e.target.value as TaskItem["category"])
                }
                className="text-xs bg-transparent border border-gray-200 rounded px-2 py-1"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Sub-tasks list */}
          {showSubTasks && totalSubTasks > 0 && (
            <div className="w-full mt-3 border-t border-gray-100 pt-3">
              <div className="space-y-2">
                {task.subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center gap-2 text-sm">
                    {subTask.completed ? (
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={subTask.completed ? "line-through text-gray-500" : "text-gray-700"}>
                      {subTask.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export const TaskItemForOverlay = ({ task }: { task: TaskItem }) => (
  <div className="bg-white p-3 my-1 rounded shadow-md border-2 border-secondary w-full max-w-[300px]">
    <div className="flex flex-col justify-center items-start relative w-full">
      <div className="flex w-full items-center">
        <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm break-words flex-grow">{task.content}</span>
      </div>
    </div>
  </div>
);
