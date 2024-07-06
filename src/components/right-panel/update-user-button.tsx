"use client";

import { useFormStatus } from "react-dom";

export const UpdateUserButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Updating..." : "Update Profile"}
    </button>
  );
};
