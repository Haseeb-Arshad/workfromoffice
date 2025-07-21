import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Filter,
  Grid3X3,
  List,
  Calendar,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react";
import { useTodoList } from "../../application/hooks/useTodoList";
import { SortableCategorySection } from "./components/CategorySection";
import { TaskItemForOverlay } from "./components/TaskItem";
import { useAtom } from "jotai";
import { editTaskAtom } from "../../application/atoms/todoListAtom";

const TodoList = () => {
  const {
    newTask,
    setNewTask,
    expandedCategories,
    activeId,
    categoryOrder,
    handleAddTask,
    handleRemoveTask,
    handleMoveTask,
    toggleCategory,
    handleDragStart,
    handleDragEnd,
    getTasksByCategory,
    getActiveTask,
  } = useTodoList();

  const [, editTask] = useAtom(editTaskAtom);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditTask = (id: string, content: string) => {
    editTask({ id, content });
  };

  const handleCalendarSync = () => {
    // Mock calendar sync functionality
    console.log('Syncing with calendar...');
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">12 active</span>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500">3 completed today</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={handleFilterToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-gray-700'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            
            {/* View Toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('board')}
                className={`p-2 text-sm ${
                  viewMode === 'board' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Calendar Sync */}
            <button
              onClick={handleCalendarSync}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              Sync Calendar
            </button>
            
            {/* More Options */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Quick Add Task */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
          </div>
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
        
        {/* Filter Pills */}
        {showFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Filters:</span>
            <button className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Phoenix</button>
            <button className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full">High Priority</button>
            <button className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Due Today</button>
            <button className="text-xs text-gray-500 hover:text-gray-700">+ Add Filter</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categoryOrder.map((id) => `category-${id}`)}
              strategy={verticalListSortingStrategy}
            >
              {categoryOrder.map((categoryId) => {
                const categoryTasks = getTasksByCategory(categoryId);
                let title = "";
                const bgColor = "bg-stone-200";

                switch (categoryId) {
                  case "todo":
                    title = "To Do";
                    break;
                  case "inProgress":
                    title = "In Progress";
                    break;
                  case "done":
                    title = "Done";
                    break;
                }

                return (
                  <SortableCategorySection
                    key={categoryId}
                    title={title}
                    tasks={categoryTasks}
                    category={categoryId}
                    bgColor={bgColor}
                    isExpanded={
                      expandedCategories[
                        categoryId as keyof typeof expandedCategories
                      ]
                    }
                    onToggle={toggleCategory}
                    onRemoveTask={handleRemoveTask}
                    onMoveTask={handleMoveTask}
                    onEditTask={handleEditTask}
                  />
                );
              })}
            </SortableContext>

            <DragOverlay>
              {activeId && getActiveTask() ? (
                <TaskItemForOverlay task={getActiveTask()!} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
