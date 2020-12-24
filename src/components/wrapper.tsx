import React, { useMemo } from "react";
import SlateTranscriptEditor from ".";
import subtitlesGenerator from '../util/export-adapters/subtitles-generator/index.js';
import { parseSync } from "../util/import-adapters/srt-to-slate/subtitlejs/parseSync";
import { flatten } from "fp-ts/lib/Array";
import "bootstrap-css-only/css/bootstrap.min.css";

interface DigitalPaperEditTranscript {
    words: DigitalPaperEditTranscriptWord[];
    paragraphs: DigitalPaperEditTranscriptParagraph[];
}

interface DigitalPaperEditTranscriptWord {
    id: number;
    start: number;
    end: number;
    text: string;
}

interface DigitalPaperEditTranscriptParagraph {
    id: number;
    start: number;
    end: number;
    speaker: string;
}

interface Props {
    srtTranscript: string;
    mediaUrl: string;
    handleSaveEditor: (srtTranscript: any) => void;
}


function dpeToSrt(dpeTranscript: DigitalPaperEditTranscript): string {
    const srtTranscript = subtitlesGenerator({ words: dpeTranscript.words, type: "srt", numberOfCharPerLine: 30 });
    return srtTranscript;
}

function srtToDpe(srtTranscript: string): DigitalPaperEditTranscript {
    const parseNodes = parseSync(srtTranscript);

    const words = flatten(parseNodes
        .map(node => {
            if (node.type !== "cue") {
                return [];
            }

            const nodeWords = node.data.text.split(/\s+/);

            const words = nodeWords
                .map((nodeWord, idx) => {
                    const word = {
                        start: ((node.data.start * (nodeWords.length - idx)) + (node.data.end * idx)) / (nodeWords.length * 1000), // weighted average of paragraph start and end times
                        end: ((node.data.start * (nodeWords.length - (idx + 1))) + (node.data.end * (idx + 1))) / (nodeWords.length * 1000),
                        text: nodeWord,
                    };
                    return word;
                })
                .filter(notEmpty);
            return words;
        }))
        .map((word, idx) => {
            const dpeWord: DigitalPaperEditTranscriptWord = {
                ...word,
                id: idx,
            };
            return dpeWord;
        });

    const paragraphs = parseNodes
        .map(((node, idx) => {
            if (node.type !== "cue") {
                return null;
            }

            const paragraph: DigitalPaperEditTranscriptParagraph = {
                id: idx,
                start: node.data.start / 1000,
                end: node.data.end / 1000,
                speaker: "U_UKN",
            };

            return paragraph;
        }))
        .filter(notEmpty);

    return {
        words,
        paragraphs
    };
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export default function TranscriptEditor(props: Props): JSX.Element {
    const dpeTranscript = useMemo(() => {
        return srtToDpe(props.srtTranscript);
    }, [props.srtTranscript]);


    function handleSaveEditor(dpeTranscript: any) {
        props.handleSaveEditor(dpeToSrt(dpeTranscript));
    }

    return <SlateTranscriptEditor
    isEditable={true}
    mediaUrl={props.mediaUrl}
    transcriptData={dpeTranscript}
    autoSaveContentType="digitalpaperedit"
    handleSaveEditor={handleSaveEditor}
    showSpeakers={false}
    showTimecodes={true}
    showTitle={false} />;
}