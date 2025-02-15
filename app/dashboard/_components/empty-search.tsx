import Image from "next/image";

export const EmptySearch = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-search.svg"
                height={140}
                width={140}
                alt="Empty"
                className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold">No results found</h2>
            <p className="text-muted-foreground text-sm mt-2">
                We couldn&apos;t find any pitches matching your search
            </p>
        </div>
    );
};
