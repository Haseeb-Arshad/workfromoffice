"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useAtom } from "jotai";
import { openWindowAtom } from "@/application/atoms/windowAtoms";
import { appRegistry } from "@/infrastructure/config/appRegistry";
import { Search, Monitor, Zap, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTodo } from "@/application/services/todo";
import { playSound } from "@/infrastructure/lib/utils";

export const CommandBar = () => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [, openWindow] = useAtom(openWindowAtom);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    const handleCreateTask = async (content: string) => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            playSound("/sounds/click.mp3");
            await createTodo(content);
            setSearch("");
            setOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter apps to show in the list
    const apps = Object.values(appRegistry);

    const isTaskMode = search.toLowerCase().startsWith("todo ");
    const taskContent = isTaskMode ? search.substring(5) : "";

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl">
                <Command
                    className="w-full overflow-hidden rounded-xl border bg-white shadow-2xl animate-in zoom-in-95 duration-200"
                    loop
                    shouldFilter={!isTaskMode}
                >
                    <div className="flex items-center border-b px-3">
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                        ) : (
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
                        <Command.Input
                            placeholder="Type a command or search..."
                            value={search}
                            onValueChange={setSearch}
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm">
                            {isTaskMode ? "Press Enter to create task" : "No results found."}
                        </Command.Empty>

                        {isTaskMode && taskContent.trim().length > 0 && (
                            <Command.Group heading="Quick Actions">
                                <Command.Item
                                    onSelect={() => handleCreateTask(taskContent)}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                >
                                    <div className="flex h-5 w-5 items-center justify-center rounded border bg-background mr-2">
                                        <Plus className="h-3 w-3" />
                                    </div>
                                    <span>Create Task: <span className="font-semibold">{taskContent}</span></span>
                                </Command.Item>
                            </Command.Group>
                        )}

                        {!isTaskMode && (
                            <>
                                <Command.Group heading="Apps">
                                    {Object.entries(appRegistry).map(([id, app]) => (
                                        <Command.Item
                                            key={id}
                                            value={app.name}
                                            onSelect={() => {
                                                runCommand(() => {
                                                    openWindow({
                                                        id: id,
                                                        appId: id,
                                                        title: app.name,
                                                        initialSize: app.defaultSize || { width: 400, height: 300 },
                                                    });
                                                });
                                            }}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                        >
                                            <div className="flex h-5 w-5 items-center justify-center rounded border bg-background mr-2">
                                                {/* Assuming app.icon doesn't exist on type, check src */}
                                                <img src={app.src} alt="" className="h-3 w-3" />
                                            </div>
                                            <span>{app.name}</span>
                                        </Command.Item>
                                    ))}
                                </Command.Group>

                                <Command.Group heading="System">
                                    <Command.Item
                                        onSelect={() => {
                                            runCommand(() => {
                                                // Toggle Theme logic
                                            });
                                        }}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                    >
                                        <Zap className="mr-2 h-4 w-4" />
                                        <span>Toggle Theme</span>
                                        <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                                    </Command.Item>
                                </Command.Group>
                            </>
                        )}

                    </Command.List>

                    <div className="border-t px-4 py-2 text-[10px] text-muted-foreground flex items-center justify-between bg-stone-50">
                        <div>Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">↵</kbd> to select</div>
                        <div><kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">ESC</kbd> to close</div>
                    </div>
                </Command>
            </div>
        </div>
    );
};
