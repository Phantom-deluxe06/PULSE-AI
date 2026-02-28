import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const STYLES = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_STYLES = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
};

function ToastItem({ toast, onRemove }) {
    const Icon = ICONS[toast.type] || Info;
    return (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg shadow-black/5 text-sm font-medium animate-in slide-in-from-right-4 duration-300 ${STYLES[toast.type]}`}>
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${ICON_STYLES[toast.type]}`} />
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export default function ToastContainer({ toasts, onRemove }) {
    if (!toasts.length) return null;
    return (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}
