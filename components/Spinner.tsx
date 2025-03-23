import React from 'react';

interface SpinnerProps {
    variant?: 'success' | 'error';
}

const Spinner = ({variant}: SpinnerProps) => {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className={variant === "success"
                ? "w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"
                : variant === "error"
                    ? "w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"
                    : "w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin"}></div>
        </div>
    );
};

export default Spinner;