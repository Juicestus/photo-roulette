/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, JSX } from "solid-js";
import Style from "../Styles.module.css";
import util from "../util";

const Home: Component = (): JSX.Element => {
    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.padded_10)} style={util.sizepx(500, 540)}>
            <table>
                <tr><td>
                    <h1>Photo Roulette</h1>
                </td></tr>

                <tr><td>
                    <h3>A game by <a href="https://www.justusl.com/">Justus Languell</a></h3>
                </td></tr>

                <tr><td>
                    <div>
                        {/* <button onClick={() => {
                            window.location.pathname = "/join";
                        }}> */}
                            <Link href="/join">Join</Link>
                    </div>
                </td></tr>
            </table>            
        </div>
    </>)
};  

export default Home;