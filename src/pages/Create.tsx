/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";
import socket from "../socket";
import { io } from "socket.io-client";

const Create: Component = (): JSX.Element => {
    let socket = io();
    socket.connect();

    socket.on("connect", function() {
        console.log("Connected to server");
    });
    console.log(socket);

    
    // socket.on("create_game_with_hostname_response", (hostname: string) => {
    //     console.log(hostname);
    // });

    const submit = (name: string): void => {
        console.log("Creating game with hostname " + name);
        // socket.emit("/create", "create_game_with_hostname", name);
    }

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1>Create Game</h1>
            </div>
            <NameField onSubmit={submit} minLength={3} maxLength={12}/>
        </div>
    </>)
};  

export default Create;