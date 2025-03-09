import Image from "next/image";

export const EmptyFavorites = () => {
    return (
        <div className=" w-full h-[calc(100vh-16rem)] flex flex-col items-center justify-center ">
            <Image
                src="/empty-favorites.svg"
                height={140}
                width={140}
                alt="Empty"
                className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold">No favorite pitches!</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoriting a pitch to see it here
            </p>
        </div>
    );
};
