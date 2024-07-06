"use client";

import { useFormStatus } from "react-dom";

export const CreatePostButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="bg-blue-500 px-2 py-1 font-semibold mt-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[5ch]"
    >
      {pending ? (
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
      ) : (
        "Post"
      )}
    </button>
  );
};
