/* @refresh reload */
import { Link } from "solid-app-router";
import { Component, createResource, createSignal, For, JSX, Show } from "solid-js";
import NameField from "../components/NameField";
import Style from "../Styles.module.css";
import util from "../util";
import Cookies from "js-cookie";
import CodeField from "../components/CodeField";
import Button from "../components/Button";

const Select: Component = (): JSX.Element => {

    const maxFileSize = 8e6;
    const legalExtensions: string[] = ['png','jpeg','jpg','gif'];

    const isFilenameLegal = (name: string): boolean => {
        var extension = name.split('.').pop();
        if (!extension) return false;
        return legalExtensions.includes(extension.toLowerCase());
    }

    const base64SizeEstimate = (base64: any): number => {
        return Math.round(4 * Math.ceil(((base64.length - 22) / 3)) * 0.5624896334383812);
    }

    const fileHandlingError = (message: string): void => {
        var upload = document.getElementById('fileUpload') as HTMLInputElement;
        if (!upload) return;
        upload.type = "text";
        upload.type= "file";
        setMessage(message);
    }

    const incrementedImageID = (): number => {
        var id = localStorage.getItem("image_id");
        if (!id) id = "0";
        var n = parseInt(id) + 1;
        localStorage.setItem("image_id", n.toString());
        return n;
    }

    const handleImageStore = async (image: string): Promise<void> => {
        const key: string = "image_" + incrementedImageID();
        localStorage.setItem(key, image);
        setPictures(pictures().concat(key));
    }

    const handleImageReading = async (file: File): Promise<void> => {
        var reader = new FileReader();
        reader.onload = async (): Promise<void> => {
            if (base64SizeEstimate(reader.result) > maxFileSize) {
                fileHandlingError("Picture is too large.");
                return;
            };
            if (typeof reader.result === "string")
                handleImageStore(reader.result);
            else
                fileHandlingError("I do not know what went on.")
        };
        if (!file) return;
        if (!isFilenameLegal(file.name)) {
            fileHandlingError("File type not allowed.");
            return;
        }
        reader.readAsDataURL(file);
    }

    const handleImageInput = async (): Promise<void> => {
        var upload = document.getElementById("fileUpload") as HTMLInputElement;
        if (!upload) return;
        upload.click();
        if (!upload.files) return;

        var wait = await setInterval(() => {
            if (upload.files && upload.files.length > 0)  {
                handleImageReading(upload.files[0]);
                clearInterval(wait);
            }
        });
    }

    const [message, setMessage] = createSignal<string>("");
    const [pictures, setPictures] = createSignal<string[]>([]);

    return (<>
        <div class={util.cls(Style.centered_xy, Style.purple_bg, Style.rounded_all)} style={util.sizepx(500, 700)}>
            <div class={util.cls(Style.centered_x)} style={util.widthpx(400)}>
                <Button onClick={handleImageInput}>Add photo</Button>
                <input id="fileUpload" type='file' name="myfile" style="visibility: hidden;"/>
                <h4 style={Style.red}>{message()}</h4>
                <For each={pictures()}>{(item, index) => {
                    var img = localStorage.getItem(item);
                    if (!img) img = "";

                    return (<>
                        <img src={img} style={util.sizepx(200, 200)}/>
                    </>)
                }}</For>
            </div>
        </div>
    </>);
}

export default Select;