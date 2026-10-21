import { useEffect, useState } from "react"



export const useCountdown = (time: number = 60) => {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        }

    }, [secondsLeft]);

    const startTimer = () => {
        setSecondsLeft(time);
    }

    return {
        startTimer,
        secondsLeft
    }
}