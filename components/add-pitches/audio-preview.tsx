"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

interface AudioPreviewProps {
    file: File;
    onRemove?: () => void;
}

export function AudioPreview({ file, onRemove }: AudioPreviewProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioUrl, setAudioUrl] = useState<string>("");

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current?.duration || 0);
            });

            audioRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(audioRef.current?.currentTime || 0);
            });

            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const handleReset = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(false);
            audioRef.current.pause();
        }
    };

    return (
        <Card className="p-4">
            <audio ref={audioRef} src={audioUrl} />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
                </div>

                <div className="space-y-2">
                    <Slider
                        value={[currentTime]}
                        max={duration}
                        step={0.1}
                        onValueChange={handleSeek}
                        aria-label="Audio progress"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglePlay}
                            >
                                {isPlaying ? (
                                    <PauseCircle className="h-6 w-6" />
                                ) : (
                                    <PlayCircle className="h-6 w-6" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleReset}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>

                        {onRemove && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRemove}
                                className="text-xs"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}