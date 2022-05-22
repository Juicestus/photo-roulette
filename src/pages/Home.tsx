/* @refresh reload */
import { Component, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";

const Home: Component = (): JSX.Element => {   ``
    return (<>
        <div class={util.cls(Style.centerxy, Style.purplebg, Style.br)} style={util.sizepx(500, 540)}>
            <div class={util.cls(Style.centerxy, Style.center)} style={util.sizepx(500, 380)}>
                <h1>Hello World</h1>
                <p>This</p>
            </div>
        </div>
    </>)
};  

export default Home;