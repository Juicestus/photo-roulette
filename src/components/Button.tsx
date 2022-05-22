/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";

const Button: Component<{children: any, onClick: () => void}> = (props): JSX.Element => {
    return (<>
        <div class={util.cls(Style.btn_wrap)}>
            <button class={util.cls(Style.btn)} onClick={props.onClick}>{props.children}</button>
        </div>
    </>)
};  

export default Button;