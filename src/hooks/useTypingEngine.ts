import { useState, useCallback, useEffect, useRef } from 'react';
import { getWords } from '../utils/words';
import { useTypingSounds } from './useTypingSounds';

export type TestMode = 'time' | 'words';
export type TestType = 'words' | 'numbers' | 'symbols';

export interface HistoryDataPoint {
    time: number; // second
    wpm: number;
    rawWpm: number;
    errors: number;
}

export const useTypingEngine = () => {
    // Test Configuration
    const [testMode, setTestMode] = useState<TestMode>('time');
    const [testType, setTestType] = useState<TestType>('words');
    const [timeConfig, setTimeConfig] = useState(30);
    const [wordConfig, setWordConfig] = useState(25);

    // Test State
    const [state, setState] = useState<'idle' | 'running' | 'finished'>('idle');
    const [words, setWords] = useState<string>('');
    const [typed, setTyped] = useState<string>(''); // What the user has typed so far
    const [combo, setCombo] = useState<number>(0);
    const [maxCombo, setMaxCombo] = useState<number>(0);
    const { playClick, playError } = useTypingSounds();

    // Metrics
    const [timeLeft, setTimeLeft] = useState(timeConfig);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    // History for plotting graphs at end-screen
    const [history, setHistory] = useState<HistoryDataPoint[]>([]);
    // Use a ref to track the latest typed value inside the interval
    const typedRef = useRef(typed);
    const wordsRef = useRef(words);
    const startTimeRef = useRef(startTime);
    const errorsRef = useRef(errors);
    const historyRef = useRef(history);

    // Keep refs synced
    useEffect(() => { typedRef.current = typed; }, [typed]);
    useEffect(() => { wordsRef.current = words; }, [words]);
    useEffect(() => { startTimeRef.current = startTime; }, [startTime]);
    useEffect(() => { errorsRef.current = errors; }, [errors]);
    useEffect(() => { historyRef.current = history; }, [history]);

    const generateWords = useCallback(() => {
        let count = 50; // default for time mode to ensure enough words
        if (testMode === 'words') {
            count = wordConfig;
        }
        const newWords = getWords(count, testType);
        setWords(newWords);
    }, [testMode, testType, wordConfig]);

    const restart = useCallback(() => {
        setState('idle');
        setTyped('');
        setErrors(0);
        setCombo(0);
        setMaxCombo(0);
        setStartTime(null);
        setHistory([]);
        setTimeLeft(timeConfig);
        generateWords();
    }, [timeConfig, generateWords]);

    // Initial load
    useEffect(() => {
        restart();
    }, [restart]);

    // Handle Timer and History tracking
    useEffect(() => {
        if (state !== 'running') return;

        const intervalId = setInterval(() => {
            // Record history every second
            const now = Date.now();
            const st = startTimeRef.current || now;
            const t = typedRef.current;
            const w = wordsRef.current;

            const timeElapsedSec = (now - st) / 1000;
            const timeElapsedMin = timeElapsedSec / 60;

            // Calculate WPM
            // A standard word is 5 characters
            const rawWpm = Math.round((t.length / 5) / timeElapsedMin) || 0;

            // Calculate correct characters for net WPM
            let correctChars = 0;
            for (let i = 0; i < t.length; i++) {
                if (t[i] === w[i]) correctChars++;
            }

            const netWpm = Math.max(0, Math.round((correctChars / 5) / timeElapsedMin)) || 0;

            const newPoint: HistoryDataPoint = {
                time: Math.floor(timeElapsedSec),
                wpm: netWpm,
                rawWpm: rawWpm,
                errors: Math.max(0, t.length - correctChars)
            };

            setHistory(prev => {
                // Only add if we don't already have this second
                if (prev.length === 0 || prev[prev.length - 1].time !== newPoint.time) {
                    return [...prev, newPoint];
                }
                return prev;
            });

            // Handle time-based mode ending
            if (testMode === 'time') {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalId);
                        setState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [state, testMode, timeConfig]);

    // Input Handler
    const insertChar = useCallback((char: string) => {
        if (state === 'finished') return;
        if (state === 'idle') {
            setState('running');
            setStartTime(Date.now());
        }

        setTyped(prev => {
            const nextTyped = prev + char;
            const targetChar = wordsRef.current[prev.length];

            if (char !== targetChar) {
                setErrors(e => e + 1);
                setCombo(0);
                playError();
            } else {
                setCombo(c => {
                    const newCombo = c + 1;
                    setMaxCombo(max => Math.max(max, newCombo));
                    return newCombo;
                });
                playClick();
            }

            // Check if finished by words
            if (testMode === 'words' && nextTyped.length >= wordsRef.current.length) {
                setState('finished');
            }

            // Automatically generate more words if nearing the end in time mode
            if (testMode === 'time' && nextTyped.length > wordsRef.current.length - 20) {
                setWords(w => w + " " + getWords(20, testType));
            }

            return nextTyped;
        });
    }, [state, testMode, testType]);

    const deleteChar = useCallback((ctrlKey: boolean = false) => {
        if (state !== 'running') return;

        setTyped(prev => {
            if (prev.length === 0) return prev;

            // Play click on backspace
            playClick();

            if (ctrlKey) {
                // Delete last word
                let i = prev.length - 1;
                // Skip trailing spaces
                while (i >= 0 && prev[i] === ' ') i--;
                // Delete characters until next space
                while (i >= 0 && prev[i] !== ' ') i--;
                return prev.slice(0, i + 1);
            }

            return prev.slice(0, -1);
        });
    }, [state]);

    return {
        state,
        words,
        typed,
        timeLeft,
        errors,
        combo,
        maxCombo,
        history,
        testMode,
        testType,
        timeConfig,
        wordConfig,
        insertChar,
        deleteChar,
        restart,
        setTestMode,
        setTestType,
        setTimeConfig,
        setWordConfig,
    };
};
