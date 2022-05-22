/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";
import Button from "./Button";

const ButtonLink: Component<{children: any, href: string}> = (props): JSX.Element => {
    return <Button onClick={() => {window.location.pathname = props.href;}}>{props.children}</Button>
};  

export default ButtonLink;