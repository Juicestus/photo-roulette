/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createResource, createSignal, JSX, Show } from "solid-js";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";
import Cookies from "js-cookie";
import CodeField from "../components/CodeField";

const Join: Component = (): JSX.Element => {
    const url: string = "";

    const joinGame = async (): Promise<void> => {
        var response = await (await fetch(url + "/api/join?code=" + code() + "&name=" + name())).json();

        if (response.hasOwnProperty("error")) {
            if (response.code == 5) {
                var _code = code()
                setCode("");
                setCode(_code);
            } else 
                setCode("");

            setName("");
            setMessage(response.error);
            return;
        }

        setMessage("");
        console.log(response);
        Cookies.set("game_code", response.game);
        Cookies.set("game_id", response.guid);
        Cookies.set("user_public_key", response.public);
        Cookies.set("user_name", response.name);
        window.location.href = "/lobby";
    }

    var [code, setCode] = createSignal<string>("");
    var [name, setName] = createSignal<string>("");
    var [message, setMessage] = createSignal<string>("");

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1 class={Style.centered_text}>Join Game</h1>
            </div>
            <Show when={code() == ""}>
                <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <CodeField btnTxt={"Next"} onSubmit={(code: string) => {
                        setCode(code);
                        setMessage("");
                    }} onEdit={() => setMessage("")} />             
                </div>
            </Show>
            <Show when={code() != ""}>
                <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <NameField btnTxt={"Join"} onSubmit={(name: string) => {
                        setName(name);
                        setMessage("");
                        joinGame();
                    }} onEdit={() => setMessage("")} minLength={3} maxLength={12}/>             
                </div>
            </Show>
            <div class={Style.centered_x} style={util.widthpx(300)}>
                <h4 class={util.cls(Style.red, Style.centered_text)}>{message()}</h4>
            </div>

        </div>
    </>)
};  

export default Join;