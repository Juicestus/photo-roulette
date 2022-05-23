/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";
import Button from "./Button";

const ButtonLink: Component<{children: any, href: string, width?: number}> = (props): JSX.Element => {
    return <Button width={props.width} onClick={() => {window.location.pathname = props.href;}}>{props.children}</Button>
};  

export default ButtonLink;