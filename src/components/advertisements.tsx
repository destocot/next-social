import Image from "next/image";

type AdvertisementsProps = {
  size: "sm" | "md" | "lg";
};

export const Advertisements = ({ size }: AdvertisementsProps) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-sm">
      <div className="flex items-center justify-between text-gray-500 font-mediun">
        <span>Sponsored Ads</span>
        <Image src="/more.png" alt="more" width="16" height="16" />
      </div>

      <div
        data-size={size}
        className="flex flex-col mt-4 data-[size=sm]:gap-2 gap-4"
      >
        <div
          data-size={size}
          className="relative w-full data-[size=sm]:h-24 data-[size=md]:h-36 data-[size=lg]:h-48"
        >
          <Image
            src="https://picsum.photos/id/204/400/600"
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex items-center gap-4">
          <Image
            src="https://picsum.photos/id/204/400/600"
            alt=""
            width="24"
            height="24"
            className="rounded-full w-6 h-6 object-cover"
          />
          <span className="text-blue-500 font-medium">BigChef Lounge</span>
        </div>

        <p data-size={size} className="data-[size=sm]:text-xs text-sm">
          {size === "sm"
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            : size === "md"
            ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">
          Learn more
        </button>
      </div>
    </div>
  );
};
