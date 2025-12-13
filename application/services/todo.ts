'use server'

import { createClient } from '@/infrastructure/config/supabase-server'
import { revalidatePath } from 'next/cache'

export type TodoItem = {
    id: string
    content: string
    category: string
    priority: string
    project: string
    subTasks: any[]
    orderIndex: number
    completedAt?: string | null
}

export async function getTodos() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching todos:', error)
        return []
    }

    return data.map((todo: any) => ({
        id: todo.id,
        content: todo.content,
        category: todo.category,
        priority: todo.priority,
        project: todo.project,
        subTasks: todo.sub_tasks,
        orderIndex: todo.order_index,
        completedAt: todo.completed_at,
    }))
}

export async function createTodo(
    content: string,
    category: string = 'todo',
    priority: string = 'medium',
    project: string = 'general',
    subTasks: any[] = []
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Get max order index
    const { data: maxOrder } = await supabase
        .from('todos')
        .select('order_index')
        .eq('user_id', user.id)
        .eq('category', category)
        .order('order_index', { ascending: false })
        .limit(1)

    const newOrderIndex = maxOrder && maxOrder.length > 0 ? maxOrder[0].order_index + 1 : 0

    const { data, error } = await supabase
        .from('todos')
        .insert({
            user_id: user.id,
            content,
            category,
            priority,
            project,
            sub_tasks: subTasks,
            order_index: newOrderIndex,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/')
    return {
        id: data.id,
        content: data.content,
        category: data.category,
        priority: data.priority,
        project: data.project,
        subTasks: data.sub_tasks,
        orderIndex: data.order_index,
        completedAt: data.completed_at,
    }
}

export async function updateTodo(id: string, updates: Partial<TodoItem>) {
    const supabase = await createClient()

    const dbUpdates: any = {}
    if (updates.content !== undefined) dbUpdates.content = updates.content
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority
    if (updates.project !== undefined) dbUpdates.project = updates.project
    if (updates.subTasks !== undefined) dbUpdates.sub_tasks = updates.subTasks
    if (updates.orderIndex !== undefined) dbUpdates.order_index = updates.orderIndex
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt

    const { error } = await supabase
        .from('todos')
        .update(dbUpdates)
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function deleteTodo(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)
    revalidatePath('/')
}

export async function reorderTodos(categoryId: string, orderedIds: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // This could be optimized to database transaction or batch update if Supabase supports RPC for this nicely,
    // but for now simple loop or upsert is okay for small lists.
    // Efficient way: upsert with explicit values.

    const updates = orderedIds.map((id, index) => ({
        id,
        user_id: user.id, // validation
        order_index: index,
        category: categoryId,
        updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
        .from('todos')
        .upsert(updates, { onConflict: 'id' })

    if (error) throw new Error(error.message)
    revalidatePath('/')
}
