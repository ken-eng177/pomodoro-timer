import { Trash2, Check } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      <span
        className={`flex-1 transition-all ${
          todo.completed
            ? 'text-gray-400 line-through'
            : 'text-gray-700'
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}