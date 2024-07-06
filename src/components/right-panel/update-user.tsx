"use client";

import type { User } from "@prisma/client";
import Image from "next/image";
import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";

import { updateProfile } from "@/lib/actions";
import { UpdateUserButton } from "@/components/right-panel/update-user-button";

type UpdateUserProps = { user: User };

export const UpdateUser = ({ user }: UpdateUserProps) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<CloudinaryUploadWidgetInfo>();

  const [state, action] = useActionState(updateProfile, null);

  const onClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <span className="text-blue-500 text-xs cursor-pointer" onClick={onClick}>
        Update
      </span>

      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form
            action={(formData) => {
              action({ formData, cover: cover?.secure_url });
            }}
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:1-/3 relative"
          >
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile dropdown to update username or profile
              image.
            </div>

            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result, widget) => {
                setCover(result.info as CloudinaryUploadWidgetInfo);
                widget.close();
              }}
            >
              {({ open }) => {
                return (
                  <div
                    className="flex flex-col gap-4 my-4"
                    onClick={() => open()}
                  >
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src={user.cover ?? "/noCover.png"}
                        alt=""
                        width={96}
                        height={48}
                        className="h-12 w-24 rounded-md object-cover"
                      />
                      <span className="text-xs underline text-gray-600">
                        Change
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>

            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              <div className="flex flex-col gap-4 grow">
                <label htmlFor="name" className="text-xs text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name || undefined}
                  placeholder="e.g. John"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="name"
                  name="name"
                />
              </div>

              <div className="flex flex-col gap-4 grow">
                <label htmlFor="surname" className="text-xs text-gray-500">
                  Surname
                </label>
                <input
                  type="text"
                  defaultValue={user.surname || undefined}
                  placeholder="e.g. Smith"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="surname"
                  name="surname"
                />
              </div>

              <div className="flex flex-col gap-4 grow w-full">
                <label htmlFor="description" className="text-xs text-gray-500">
                  Description
                </label>
                <textarea
                  defaultValue={user.description || undefined}
                  placeholder="e.g. Life is but a dream..."
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="description"
                  name="description"
                ></textarea>
              </div>

              <div className="flex flex-col gap-4 grow">
                <label htmlFor="city" className="text-xs text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  defaultValue={user.city || undefined}
                  placeholder="e.g. Columbus"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="city"
                  name="city"
                />
              </div>

              <div className="flex flex-col gap-4 grow">
                <label htmlFor="school" className="text-xs text-gray-500">
                  School
                </label>
                <input
                  type="text"
                  defaultValue={user.school || undefined}
                  placeholder="e.g. Ohio State University"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="school"
                  name="school"
                />
              </div>

              <div className="flex flex-col gap-4 grow">
                <label htmlFor="work" className="text-xs text-gray-500">
                  Work
                </label>
                <input
                  type="text"
                  defaultValue={user.work || undefined}
                  placeholder="e.g. Starbucks"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="work"
                  name="work"
                />
              </div>

              <div className="flex flex-col gap-4 grow">
                <label htmlFor="website" className="text-xs text-gray-500">
                  Website
                </label>
                <input
                  type="text"
                  defaultValue={user.website || undefined}
                  placeholder={"e.g. jsmith.dev"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  id="website"
                  name="website"
                />
              </div>
            </div>

            <UpdateUserButton />

            {state === null ? null : state.success ? (
              <span className="bg-green-600 px-0.5 text-white rounded">
                Profile has been updated!
              </span>
            ) : (
              <span className="bg-red-600 px-0.5 text-white rounded">
                Something went wrong!
              </span>
            )}

            <div
              onClick={onClick}
              className="absolute text-3xl right-3 top-2 cursor-pointer"
            >
              ×
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
