import { X, Plus } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { useState, useEffect } from 'react';

type Todo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
};

type showTodoModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function TodoModal({
    isOpen,
    onClose,
}: showTodoModalProps) {

    const [todos, setTodos] = useState<Todo[]>([
        // { id: '1', text: '買い物に行く', completed: false, createdAt: Date.now() },
        // { id: '2', text: 'プロジェクトの資料を作成', completed: true, createdAt: Date.now() },
        // { id: '3', text: 'メールを返信する', completed: false, createdAt: Date.now() },
    ]);
    const [newTodoText, setNewTodoText] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    useEffect(() => {
        const saved = localStorage.getItem('pomodoro-todos');
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('pomodoro-todos', JSON.stringify(todos));
    }, [todos]);

    const completedCount = todos.filter((t) => t.completed).length;
    const totalCount = todos.length;

    const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newTodoText.trim() === '') return;
        setTodos([
            ...todos,
            {
                id: Date.now().toString(),
                text: newTodoText.trim(),
                completed: false,
                createdAt: Date.now(),
            },
        ]);
        setNewTodoText('');
    }

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-gray-800">Todoリスト</h2>
                        <p className="text-gray-500 mt-1">
                            {completedCount} / {totalCount} 完了
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Todo List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-2">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                            />
                        ))}
                        {todos.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                Todoがありません
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Todo Form */}
                <div className="p-6 border-t border-gray-200">
                    <form onSubmit={addTodo} className="flex gap-2">
                        <input
                            type="text"
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="新しいタスクを追加..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            追加
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}