/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createSignal, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";
import Button from "./Button";

const CodeField: Component<{onSubmit: (name: string) => void, 
        btnTxt?: string, onEdit?: () => void}> = (props): JSX.Element => {
    const validCharacters: string = '1234567890';
    const requiredLength: number = 4;

    const [code, setCode] = createSignal<string>("");
    const [message, setMessage] = createSignal<string>("");
    const [valid, setValid] = createSignal<boolean>(false);
    const  [editted, setEditted] = createSignal<boolean>(false);

    const legalInput = (input: string): boolean => {
        for (const char of input) {
            if (validCharacters.indexOf(char) === -1)
                return false;
        }
        return true;
    }

    const set = (message: string): void => {
        setMessage(message);
        setValid(message == "");
    }

    const inputLoop = (e: InputEvent): void => {
        if (!editted()) {
            if (props.onEdit != undefined)
                props.onEdit();
            setEditted(true);
        }

        if (e.target instanceof HTMLInputElement) {
            setCode(e.target.value);
        }

        if (code().length != requiredLength)
            set("A code is " + requiredLength + " characters long.");
        else if (!legalInput(code()))
            set("Invalid character used.");
        else
            set("");
    }

    const submit = (): void => {
        if (valid()) props.onSubmit(code());
        else set("Cannot submit invalid code.");
    }

    return (<>
        <div>
            <br/>
            <div class={Style.centered_x} style={util.widthpx(300)}>
                <input class={Style.name_field} onInput={inputLoop} minlength={4} 
                        maxlength={4} id="code" type="text" name="code" placeholder="Code"></input>
            </div>
            <br/><br/>
            <div class={Style.centered_x} style={util.widthpx(250)}>
                <Button onClick={submit}><h2>{props.btnTxt || 'Submit'}</h2></Button>
            </div>
            <br/><br/>
            <div class={Style.centered_x} style={util.widthpx(300)}>
                <h4 class={util.cls(Style.red, Style.centered_text)}>{message()}</h4>
            </div>
        </div>
    </>)
};  

export default CodeField;