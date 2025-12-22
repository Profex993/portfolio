import React, {useEffect, useState} from "react";

export default function Typewriter({text, speed = 18, instant = false}) {
    const [output, setOutput] = useState(instant ? text : "");

    useEffect(() => {
        if (instant) {
            setOutput(text);
            return;
        }

        setOutput("");
        let i = 0;
        const id = setInterval(() => {
            i++;
            setOutput(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
            }
        }, speed);

        return () => clearInterval(id);
    }, [text, speed, instant]);

    return <span>{output}</span>;
}