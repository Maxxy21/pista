import Image from "next/image";

import {NewPitchButton} from "@/app/dashboard/components/new-pitch-button";


export const EmptyPitches = ({orgId}: { orgId: string }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Image
                src="/empty-favorites.svg"
                height={110}
                width={110}
                alt="Empty"
                className="mb-6"
            />
            <h2 className="text-2xl font-semibold text-center">
                Create your first pitch!
            </h2>
            <p className="text-muted-foreground text-sm mt-2 mb-6 text-center">
                Start by uploading or writing your pitch
            </p>
            <NewPitchButton orgId={orgId}/>
        </div>
    );
};