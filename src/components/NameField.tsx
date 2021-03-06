/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createSignal, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";
import Button from "./Button";

const NameField: Component<{onSubmit: (name: string) => void, minLength: number, 
        maxLength: number, btnTxt?: string, onEdit?: () => void}> = (props): JSX.Element => {
    const validCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.';

    const [name, setName] = createSignal<string>("");
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
            setName(e.target.value);
        }

        if (name().length < props.minLength)
            set("Name must be at least " + props.minLength + " characters long.");
        else if (name().length > props.maxLength)
            set("Name cannot exceed " + props.maxLength + " characters long.");
        else if (!legalInput(name()))
            set("Invalid character used.");
        else
            set("");
    }

    const submit = (): void => {
        if (valid()) props.onSubmit(name());
        else set("Cannot submit invalid name.");
    }

    return (<>
        <div>
            <br/>
            <div class={Style.centered_x} style={util.widthpx(300)}>
                <input class={Style.name_field} onInput={inputLoop} minlength={props.minLength} 
                        maxlength={props.maxLength} id="name" type="text" name="name" placeholder="Name"></input>
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

export default NameField;