import { motion } from "framer-motion";
import Image from "next/image";

export const EmptySearch = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="mb-8">
                    <Image
                        src="/empty-search.svg"
                        alt="No search results found"
                        width={200}
                        height={200}
                        className="mx-auto"
                        priority
                    />
                </div>
                
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                    No results found
                </h2>
                
                <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                    We couldn't find any pitches matching your search. Try adjusting your search terms or filters.
                </p>
            </motion.div>
        </div>
    );
}; 