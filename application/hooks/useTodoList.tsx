import { useState, useEffect } from "react";
import { playSound } from "@/infrastructure/lib/utils";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos, TodoItem } from "@/application/services/todo";
import { TaskItem } from "@/application/atoms/todoListAtom"; // Type definition only

export function useTodoList() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState({
    todo: true,
    inProgress: true,
    done: true,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([
    "todo",
    "inProgress",
    "done",
  ]);

  const fetchTasks = async () => {
    try {
      const serverTodos = await getTodos();
      // serverTodos is TodoItem[], we need to map it to TaskItem (UI type)
      // TaskItem has: id, content, category, priority, project, subTasks
      // TodoItem matches mostly.
      const mapped: TaskItem[] = serverTodos.map(t => ({
        id: t.id,
        content: t.content,
        category: t.category as any,
        priority: t.priority as any,
        project: t.project as any,
        subTasks: t.subTasks || [],
      }));
      setTasks(mapped);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Run on mount

  // Get tasks for a category
  const getTasksByCategory = (category: string) => {
    return tasks.filter((task) => task.category === category);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      playSound("/sounds/click.mp3");
      const tempId = crypto.randomUUID();
      // Optimistic update
      const newLocalTask: TaskItem = {
        id: tempId,
        content: newTask.trim(),
        category: "todo",
        priority: "medium",
        project: "general",
        subTasks: []
      };
      setTasks(prev => [...prev, newLocalTask]);
      setNewTask("");

      try {
        await createTodo(newLocalTask.content, "todo", "medium", "general", []);
        await fetchTasks(); // Refresh to get real ID
      } catch (e) {
        console.error("Failed to create task", e);
        setTasks(prev => prev.filter(t => t.id !== tempId)); // Revert
      }
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    playSound("/sounds/click.mp3");
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
    try {
      await deleteTodo(taskId);
    } catch (e) {
      console.error("Failed to delete task", e);
      fetchTasks(); // Revert
    }
  };

  const handleMoveTask = async (
    taskId: string,
    newCategory: TaskItem["category"]
  ) => {
    playSound("/sounds/click.mp3");
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, category: newCategory } : task
      )
    );
    try {
      await updateTodo(taskId, { category: newCategory });
    } catch (e) {
      console.error("Failed to update task category", e);
      fetchTasks();
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
    playSound("/sounds/click.mp3");
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if we're dragging a category
    if (activeId.startsWith("category-") && overId.startsWith("category-")) {
      const oldIndex = categoryOrder.findIndex(
        (id) => `category-${id}` === activeId
      );
      const newIndex = categoryOrder.findIndex(
        (id) => `category-${id}` === overId
      );

      setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex));
      playSound("/sounds/click.mp3");
      return;
    }

    // Check if we're dropping a task into an empty category
    if (
      !activeId.startsWith("category-") &&
      overId.startsWith("empty-category-")
    ) {
      const targetCategory = overId.replace(
        "empty-category-",
        ""
      ) as TaskItem["category"];

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === activeId ? { ...task, category: targetCategory } : task
        )
      );

      playSound("/sounds/click.mp3");
      setActiveId(null);

      // Persist category change
      try {
        await updateTodo(activeId, { category: targetCategory });
      } catch (e) { console.error(e); fetchTasks(); }
      return;
    }

    // Handle task reordering within the same category or moving between categories
    let newTasksState: TaskItem[] = [];

    setTasks((currentTasks) => {
      const activeTask = currentTasks.find((task) => task.id === activeId);
      const overTask = currentTasks.find((task) => task.id === overId);

      if (!activeTask || !overTask) return currentTasks;

      // If same category, just reorder
      if (activeTask.category === overTask.category) {
        const category = activeTask.category;
        const categoryTasks = currentTasks.filter(
          (task) => task.category === category
        );

        const oldIndex = categoryTasks.findIndex(
          (task) => task.id === activeId
        );
        const newIndex = categoryTasks.findIndex((task) => task.id === overId);

        const reorderedCategoryTasks = arrayMove(
          categoryTasks,
          oldIndex,
          newIndex
        );

        // Create a new array where tasks in this category are replaced with reordered ones
        // and tasks from other categories remain unchanged
        const updatedTasks = currentTasks.filter(
          (task) => task.category !== category
        );
        newTasksState = [...updatedTasks, ...reorderedCategoryTasks];

        // Trigger server reorder
        const orderedIds = reorderedCategoryTasks.map(t => t.id);
        reorderTodos(category, orderedIds).catch(console.error);

        return newTasksState;
      }
      // If different category, move the task to the new category
      else {
        newTasksState = currentTasks.map((task) =>
          task.id === activeId ? { ...task, category: overTask.category } : task
        );

        // Trigger server update
        updateTodo(activeId, { category: overTask.category }).catch(console.error);

        return newTasksState;
      }
    });

    playSound("/sounds/click.mp3");
    setActiveId(null);
  };

  // Get active task
  const getActiveTask = () => {
    if (!activeId) return null;
    return tasks.find((task) => task.id === activeId);
  };

  return {
    tasks,
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
  };
}
