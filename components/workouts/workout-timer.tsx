
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Pause, Play, Square } from 'lucide-react';

interface WorkoutTimerProps {
  restDuration?: number;
}

export function WorkoutTimer({ restDuration = 60 }: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(restDuration);
  const [isActive, setIsActive] = useState(false);
  const [audio] = useState(typeof Audio !== 'undefined' ? new Audio('/timer-beep.mp3') : null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 4 && time > 0 && audio) {
            audio.play();
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (audio) {
        audio.play();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, audio]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(restDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Rest Timer</CardTitle>
        <Timer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <Button 
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTimer}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
