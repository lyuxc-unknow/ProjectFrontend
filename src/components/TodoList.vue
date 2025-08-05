<template>
    <div class="p-6 max-w-2xl mx-auto space-y-4">
        <!-- 添加栏 -->
        <el-card shadow="hover">
            <div class="flex-1 items-center space-x-2" style="display: flex;">
                <el-input v-model="newTodo" placeholder="请输入新的待办事项..." clearable class="flex-2"
                    @keyup.enter="addTodo" />
                <el-divider direction="vertical" border-style="none"></el-divider>
                <el-button type="primary" @click="addTodo">添加</el-button>
            </div>
        </el-card>

        <!-- 列表为空 -->
        <el-empty v-if="todos.length === 0" description="暂无待办事项" />

        <!-- 列表渲染 -->
        <transition-group name="fade" tag="div">
            <el-card v-for="(todo, index) in todos" :key="todo.id ?? index" shadow="hover" class="group">
                <div class="flex items-center justify-between" style="display: flex;">
                    <!-- 左侧：勾选 + 文本 -->
                    <div class="flex items-center space-x-3">
                        <el-checkbox v-model="todo.completed" @change="(val: boolean) => updateStatus(index, val)" >
                            {{todo.text}}
                        </el-checkbox>
                    </div>

                    <!-- 右侧：删除按钮 -->
                    <el-button style="margin-left: auto;" type="danger" circle @click="removeTodo(index)" :icon="Delete" />
                </div>
            </el-card>
        </transition-group>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {Delete} from '@element-plus/icons-vue'

interface Todo {
    id: number
    text: string
    completed: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([])

// 初始化加载
const fetchTodos = async () => {
    try {
        const res = await fetch('/api/todos')
        if (res.ok) {
            todos.value = await res.json()
        } else {
            console.error('加载待办失败')
        }
    } catch (e) {
        console.error('加载待办异常', e)
    }
}

// 添加待办
const addTodo = async () => {
    const trimmed = newTodo.value.trim()
    if (!trimmed) return
    try {
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: trimmed }),
        })
        if (res.ok) {
            const createdTodo = await res.json()
            todos.value.push(createdTodo)
            newTodo.value = ''
        } else {
            console.error('添加失败')
        }
    } catch (e) {
        console.error('添加异常', e)
    }
}

// 删除待办
const removeTodo = async (index: number) => {
    const todo = todos.value[index]
    if (!todo?.id) return
    try {
        const res = await fetch(`/api/todos/${todo.id}`, {
            method: 'DELETE',
        })
        if (res.ok) {
            todos.value.splice(index, 1)
        } else {
            console.error('删除失败')
        }
    } catch (e) {
        console.error('删除异常', e)
    }
}

// 更新完成状态
const updateStatus = async (index: number, newCompleted: boolean) => {
    const todo = todos.value[index]
    if (!todo?.id) return

    // 乐观更新
    todo.completed = newCompleted

    try {
        const res = await fetch(`/api/todos/${todo.id}/completed`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCompleted),
        })

        if (!res.ok) {
            // 接口调用失败，回滚状态
            todo.completed = !newCompleted
            console.error('更新状态失败')
        }
    } catch (e) {
        todo.completed = !newCompleted
        console.error('更新状态异常', e)
    }
}

onMounted(() => {
    fetchTodos()
})
</script>

<style scoped>
.line-through {
    text-decoration: line-through;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>