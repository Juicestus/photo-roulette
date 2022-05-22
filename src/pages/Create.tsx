/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";

const Create: Component = (): JSX.Element => {
    

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1>Create Game</h1>
            </div>
            <NameField minLength={3} maxLength={12}/>
        </div>
    </>)
};  

export default Create;