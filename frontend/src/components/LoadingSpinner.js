export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizes[size]} border-4 border-slate-200 border-t-[#002B50] rounded-full animate-spin`}></div>
            {text && <p className="text-slate-600 text-sm font-medium">{text}</p>}
        </div>
    );
}

// Full page loading
export function LoadingPage({ text = "Memuat..." }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

// Inline loading (for buttons, etc)
export function LoadingInline({ text = "" }) {
    return (
        <span className="inline-flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {text && <span>{text}</span>}
        </span>
    );
}
