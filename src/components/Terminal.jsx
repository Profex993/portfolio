import React, {useEffect, useRef, useState} from "react";
import Typewriter from "./Typewriter";

const USER = "guest";
const SERVICE = "eger.software";
const HOST = "eger.software";
const promptPrefix = `${USER.toLowerCase()}@${SERVICE.toLowerCase()}:~$`;

const COMMANDS = [
    {name: "help", description: "list commands"},
    {name: "profile", description: "overview of the person"},
    {name: "bio", description: "short biography"},
    {name: "skills", description: "technical skills"},
    {name: "certificates", description: " earned certificates"},
    {name: "projects", description: "selected projects"},
    {name: "contact", description: "contact information"},
    {name: "whoami", description: "current user"},
    {name: "date", description: "current date/time"},
    {name: "sysinfo", description: "service information"},
    {name: "clear", description: "clear screen"},
];

function isWindows() {
    const platform = navigator.userAgentData?.platform;
    if (typeof platform === "string" && platform.length > 0) {
        return platform.toLowerCase().includes("windows");
    }
    return false;
}

const WELCOME_LINES = [
    `Trying ${HOST}...`,
    `Connected to ${HOST}.`,
    `Escape character is '^]'.`,
    ``,
    `${SERVICE} 0.9.3 (interactive profile terminal)`,
    `[ INFO ] This is fictional demo software running entirely in your browser.`,
    `[ INFO ] No real network requests are performed.`,
    ``,
    `${isWindows() ? "[ WARNING ] Windows detected! Consider installing Linux." : ""}`,
    `[ BOOT ] Initializing runtime...`,
    `[ OK   ] Allocated client session (user: ${USER})`,
    `[ OK   ] Loaded core modules`,
    `[ OK   ] Loaded profile record: lukas_eger`,
    `[ OK   ] Loaded biography`,
    `[ OK   ] Loaded skills index`,
    `[ OK   ] Loaded projects list`,
    `[ OK   ] Bound command router`,
    `[ OK   ] Ready`,
    ``,
    `[ INFO ] As guest, you can browse information about user: lukas_eger.`,
    `[ INFO ] Use commands like 'profile', 'bio', 'skills', 'projects', 'contact'.`,
    ``,
    `Type \`help\` and press ENTER to see all available commands.`,
];

function resolveCommand(input) {
    const [raw] = input.trim().split(" ");
    const cmd = raw.toLowerCase();
    return COMMANDS.find((c) => c.name === cmd) || null;
}

function renderCommandOutput(cmd) {
    switch (cmd) {
        case "help":
            return (
                <div>
                    <div>available commands:</div>
                    <div>
                        {COMMANDS.map((c) => (
                            <div key={c.name}>
                <span style={{color: "var(--accent)"}}>
                  {c.name.padEnd(10)}
                </span>
                                <span style={{color: "var(--text-dim)"}}>
                  {c.description}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "profile":
            return (
                <div>
                    <div>service: {SERVICE}</div>
                    <div>profile id: profex</div>
                    <div>name: Profex</div>
                    <div>role: developer</div>
                </div>
            );

        case "bio":
            return (
                <div>
                    <div>bio:</div>
                    <div>
                        I am soon-to-be high school graduate stepping into the IT industry, focused on building real
                        projects primarily with Java and Spring Boot.<br/>
                        I run my own homelab and work comfortably in Linux, using it as a playground to keep improving
                        my skills.
                    </div>
                </div>
            );

        case "skills":
            return (
                <div>
                    <div>skills:</div>
                    <div>- Java / Spring Boot</div>
                    <div>- Object Oriented Programming</div>
                    <div>- Python</div>
                    <div>- C# / .NET</div>
                    <div>- Linux / Bash</div>
                    <div>- Testing</div>
                    <div>- Computer Networks</div>
                    <div>- Troubleshooting</div>
                    <div>- Server Management</div>
                    <div>- Docker</div>
                    <div>- ProxmoxVE</div>
                    <div>- SQL / PostgreSQL / MySQL / ...</div>
                    <div>- Git / GitHub</div>
                    <div>- Unity</div>
                    <div>- JavaScript / Node.js / React</div>
                    <div>- HTML / CSS</div>
                    <div>- MongoDB</div>
                </div>
            );

        case "certificates":
            return (
                <div>to be added</div>
            );

        case "projects":
            return (
                <div>
                    <div>selected projects:</div>
                    <div>- this website: built using React</div>
                    <div>- <a href={"https://github.com/Profex993/DummyPay"}>DummyPay</a>: demo payment gateway for
                        testing and demonstration purposes, built using Spring Boot and Maven
                    </div>
                    <div>- Hosting service: My custom solution for my own web hosting business, built using Spring Boot,
                        PostgreSQL and Maven
                    </div>
                    <div>- <a href={"https://github.com/Profex993/Music-player"}>Music Player</a>: simple music player
                        built using Java
                    </div>
                    <div>- <a href={"https://github.com/Profex993/Inventory_Manager"}>Inventory Manager</a>: application
                        for small warehouse management, built using C# and postgreSQL
                    </div>
                </div>
            );

        case "contact":
            return (
                <div>
                    <div>contact:</div>
                    <div>- github: <a href={"https://github.com/Profex993"}>Profex993</a></div>
                    <div>- email: luky.eger@gmail.com</div>
                </div>
            );

        case "whoami":
            return <div>{USER.toLowerCase()}@{SERVICE.toLowerCase()}</div>;

        case "date":
            return <div>{new Date().toString()}</div>;

        case "sysinfo":
            return (
                <div>
                    <div style={{color: "var(--accent)"}}>{SERVICE} status</div>
                    <div>--------------------------------------------------</div>
                    <div>Service: {SERVICE}</div>
                    <div>Host: {HOST}</div>
                    <div>Mode: read-only, single-tenant profile session</div>
                    <div>Runtime: browser (React-based terminal UI)</div>
                    <div>Transport: TCP/telnet</div>
                    <div>Persistence: none</div>
                    <div>Telemetry: disabled</div>
                </div>
            );

        default:
            return null;
    }
}

export default function Terminal() {
    const [history, setHistory] = useState([]);
    const [bootDone, setBootDone] = useState(false);
    const [lineIndex, setLineIndex] = useState(0);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const historyRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (lineIndex >= WELCOME_LINES.length) {
            setBootDone(true);
            setTimeout(() => inputRef.current && inputRef.current.focus(), 200);
            return;
        }

        const t = setTimeout(() => {
            setHistory((prev) => [
                ...prev,
                {type: "boot", text: WELCOME_LINES[lineIndex]},
            ]);
            setLineIndex((v) => v + 1);
        }, 260);

        return () => clearTimeout(t);
    }, [lineIndex]);

    useEffect(() => {
        if (!historyRef.current) return;
        historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }, [history, isProcessing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = input.trim();
        if (!value || isProcessing) return;

        const cmdData = resolveCommand(value);

        setCommandHistory((prev) => [...prev, value]);
        setHistoryIndex(-1);

        setHistory((prev) => [
            ...prev,
            {type: "input", text: value},
            {
                type: "output",
                text: cmdData ? cmdData.name : value,
                invalid: !cmdData,
            },
        ]);

        setInput("");
        setIsProcessing(true);

        setTimeout(() => {
            if (!cmdData) {
                setHistory((prev) => [
                    ...prev,
                    {
                        type: "system",
                        text: `${SERVICE.toLowerCase()}: ${value}: command not found`,
                        isError: true,
                    },
                ]);
                setIsProcessing(false);
                return;
            }

            if (cmdData.name === "clear") {
                setHistory([]);
                setIsProcessing(false);
                return;
            }

            setHistory((prev) => [
                ...prev,
                {type: "rendered", command: cmdData.name, input: value},
            ]);
            setIsProcessing(false);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (commandHistory.length === 0) return;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const newIndex =
                historyIndex === -1
                    ? commandHistory.length - 1
                    : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex === -1) return;
            const newIndex = historyIndex + 1;
            if (newIndex >= commandHistory.length) {
                setHistoryIndex(-1);
                setInput("");
            } else {
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        }
    };

    return (
        <div className="terminal-screen">
            <div className="terminal-output" ref={historyRef}>
                {history.map((entry, idx) => {
                    if (entry.type === "boot") {
                        return (
                            <div key={idx} className="line line-system">
                                <Typewriter text={entry.text} instant/>
                            </div>
                        );
                    }

                    if (entry.type === "input") {
                        return (
                            <div key={idx} className="line">
                                <span className="prompt">{promptPrefix}</span>{" "}
                                <span>{entry.text}</span>
                            </div>
                        );
                    }

                    if (entry.type === "output") {
                        if (entry.invalid) {
                            return (
                                <div key={idx} className="line line-error">
                                    &gt; {entry.text}
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className="line line-accent">
                                &gt; {entry.text}
                            </div>
                        );
                    }

                    if (entry.type === "system") {
                        return (
                            <div
                                key={idx}
                                className={
                                    "line " + (entry.isError ? "line-error" : "line-system")
                                }
                            >
                                {entry.text}
                            </div>
                        );
                    }

                    if (entry.type === "rendered") {
                        return (
                            <div key={idx} className="line-block">
                                {renderCommandOutput(entry.command)}
                            </div>
                        );
                    }

                    return null;
                })}

                {bootDone && (
                    <form className="line" onSubmit={handleSubmit}>
                        <span className="prompt">{promptPrefix}</span>{" "}
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input"
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </form>
                )}
            </div>
        </div>
    );
}