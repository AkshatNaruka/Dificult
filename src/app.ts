import dictionary from "./dictionary";
import { shuffle } from "./utils";

enum State{
    Remaining,
    Error,
    Typed,
    Skipped
}

type Part = {
    character: string;
    state: State;
}

type GameState = {
    position: number;
    sequence: Part[];
}

const introelement = document.getElementById("intro")!;
const gameelement = document.getElementById("game")!;
const textelement = document.getElementById("text")!;
const caretelement = document.getElementById("caret")!;
const scoreelement = document.getElementById("score")!;
const wpmelement = document.getElementById("wpm")!;
const accuracyelement = document.getElementById("accuracy")!;

const render = (game_state: GameState) => {
    const text_html = game_state.sequence.map(({character, state}: Part,idx) => {
        let cls = [];
        switch(state){
            case State.Remaining:
                break;
            case State.Error:
                cls.push("error");
                break;
            case State.Typed:
                cls.push("typed");
                break;
            case State.Skipped:
                cls.push("skipped");
                break;
        }
        if (idx === game_state.position){
            cls.push("current");
        }
        return `<span class="${cls.join(" ")}">${character}</span>`;
    }).join("");
    textelement.innerHTML = text_html;

    const current_elem = textelement.querySelector(".current")!;
    if (current_elem!==null){
        const bbox = currentelement.getBoundingClientRect();;
        c
    }