/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createResource, createSignal, For, JSX, Show } from "solid-js";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";
import Cookies from "js-cookie";
import CodeField from "../components/CodeField";
import Button from "../components/Button";

const Lobby: Component = (): JSX.Element => {
    const url: string = "";

    const leave = async (): Promise<void> => {
        var response = await (await fetch(url
            + "/api/lobby?code=" + Cookies.get("game_code") 
            + "&name=" + Cookies.get("user_name") 
            + "&public=" + Cookies.get("user_public_key")
            + "&action=leave"
        )).json();

        Cookies.remove("game_code");
        Cookies.remove("game_id");
        Cookies.remove("user_public_key");
        window.location.href = "/";
    }

    const start = async (): Promise<void> => {
        if (players().length < 2) {
            setMessage("You need at least 2 players to start the game.");
            return;
        }

        if (players().length > 8) {
            setMessage("You can't have more than 8 players in a game.");
            return;
        }
            
        var response = await (await fetch(url
            + "/api/lobby?code=" + Cookies.get("game_code") 
            + "&name=" + Cookies.get("user_name") 
            + "&public=" + Cookies.get("user_public_key")
            + "&action=start"
        )).json();

        if (response.hasOwnProperty("error"))
            setMessage(response.error);
        else
            window.location.href = "/game";
    }

    const update = async (): Promise<void> => {
        var response = await (await fetch(url
                + "/api/lobby?code=" + Cookies.get("game_code") 
                + "&name=" + Cookies.get("user_name") 
                + "&public=" + Cookies.get("user_public_key")
                + "&action=update"
        )).json();

        if (response.hasOwnProperty("error")) {
            if (response.code == 7)
                window.location.href = "/";
            setMessage(response.error);
            return;
        }

        if (response.started)
            window.location.href = "/game";

        setIsHost(response.ishost);
        setHostname(response.hostname);
        response.players.sort();
        setPlayers(response.players);
        setMessage("");
    }

    update();
    setInterval(() => update(), 1500);

    var [code, setCode] = createSignal<string>("");
    var [name, setName] = createSignal<string>("");
    var [message, setMessage] = createSignal<string>("");
    var [players, setPlayers] = createSignal<string[]>([]);
    var [hostname, setHostname] = createSignal<string>("");
    var [isHost, setIsHost] = createSignal<boolean>(false);

    setCode(Cookies.get("game_code") || "Must join a game");
    setName(Cookies.get("user_name") || "");

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 700)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1 class={Style.centered_text}>Game # {code()}</h1>
            </div>
            <br/>
            <Show when={isHost()}>
                <div class={Style.centered_x} style={util.sizepx(310, 25)}>
                    <div class={Style.left_div}>
                            <Button width={150} onClick={start}><h4>Start</h4></Button>
                    </div>
                    <div class={Style.right_div}>
                        <Button width={150} onClick={leave}><h4>Leave</h4></Button>
                    </div>
                </div>
            </Show>
            <Show when={!isHost()}>
                <div class={Style.centered_x} style={util.sizepx(150, 25)}>
                    <Button width={150} onClick={leave}><h4>Leave</h4></Button>
                </div>
            </Show>
            <br/>
            <br/>
            <br/>
            <Show when={code() != "" && message() == ""}>
                <div class={util.cls(Style.centered_x)} style={util.widthpx(300)}>
                    <ul>
                        <For each={players()}>
                            {(item, index) => 
                            <>
                                <h4>{item}<i>{item == hostname() ? " (Host)" : ""} {item == name() ? " (You)" : ""}</i></h4>
                            </>}
                        </For>
                    </ul>
                </div>
            </Show>
            <div class={Style.centered_x} style={util.widthpx(300)}>
                <h4 class={util.cls(Style.red, Style.centered_text)}>{message()}</h4>
            </div>

        </div>
    </>)
};  

export default Lobby;