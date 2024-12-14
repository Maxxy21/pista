import Image from "next/image";
import {FileDialog} from "@/components/add-pitches/file-dialog";
import {Button} from "@/components/ui/button";


interface EmptyPitchesProps {
    orgId: string;
}
export const EmptyPitches = ({orgId}:EmptyPitchesProps) => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-favorites.svg"
                height={110}
                width={110}
                alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first pitch!
            </h2>
            <p className="text-muted-foreground textg-sm mt-2">
                Start by uploading or writing your pitch
            </p>
            <div className="mt-6">
                <FileDialog orgId={orgId}>
                    <Button size="lg">
                        Create pitch
                    </Button>
                </FileDialog>
            </div>
        </div>
    );
};