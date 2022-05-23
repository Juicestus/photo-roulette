/* @refresh reload */
import { io } from "socket.io-client"
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import Style from "../Styles.module.css";
import util from "../util"; 


const Home: Component = (): JSX.Element => {
    var socket = io();
    socket.connect();
    console.log(socket);

    socket.on("connect", function() {
        console.log("Connected to server");
    });


    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <br/>
                <br/>
                <h1>Photo Roulette</h1>
                <br/>
                <h3>A game by <a href="https://www.justusl.com/">Justus Languell</a></h3>
                <br/>
            </div>
            <br/>
            <div class={util.cls(Style.centered_x)}>
                <ButtonLink href={"/create"}>
                    <h3>Create Game</h3>
                </ButtonLink>
                <br/>
                <ButtonLink href={"/create"}>
                    <h3>Join Game</h3> 
                </ButtonLink>
            </div>
        </div>
    </>)
};  

export default Home;