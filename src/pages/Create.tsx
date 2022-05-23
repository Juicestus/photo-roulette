/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createResource, createSignal, JSX, Show } from "solid-js";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";
import Cookies from "js-cookie";

const Create: Component = (): JSX.Element => {
    const createGame = async (name: string): Promise<void> => {
        var response = await (await fetch("/api/create?hostname=" + name)).json();
        Cookies.set("game_id", response.game);
        Cookies.set("user_public_key", response.public);
        Cookies.set("user_name", response.name);
    }

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1 class={Style.centered_text}>Create Game</h1>
            </div>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <br/>
                <br/>
                <NameField btnTxt={"Create"} onSubmit={createGame} minLength={3} maxLength={12}/>
            </div>
        </div>
    </>)
};  

export default Create;