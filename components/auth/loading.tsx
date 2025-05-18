import Image from "next/image";
import LogoIcon from "@/components/ui/logo-icon";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 dark:bg-neutral-900 ">
            <div className="animate-pulse duration-800 flex items-center flex-1 justify-center gap-2">
                <LogoIcon/>
                <h1 className="text-lg font-semibold">Pista</h1>
            </div>
        </div>
    );
};
