import { TbLoader3 } from "react-icons/tb";

const Loading = () => {
  return (
    <div className="h-[95vh] flex justify-center items-center w-full">
      <TbLoader3 size={65} className="animate-spin" />
    </div>
  );
};

export default Loading;
