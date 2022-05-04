import { AttrVal, HTMLElem, HTMLText } from "../HTMLBuilder/HTMLBuilder";

export class CubeFace{
    private static imgFolder : string = "src\\media\\img\\aboutMe";

    private _message : string = "";

    public get message() : string{
        return this._message;
    }
    public set message(val : string) {
        this._message = val;
    }

    private _image : string = "";

    public get image() : string {
        return `${CubeFace.imgFolder}\\${this._image}`;
    }
    public set image(val : string) {
        this._image = val;
    }

    private onClick : (() => void) | undefined = undefined;

    constructor(message : string, image : string, onclick : (() => void) | undefined = undefined){
        this.message = message;
        this.image = image;
        this.onClick = onclick;
    }

    public updateFace(face : JQuery) {
        face.html(this.getContent());

        face.off("click");
        face.css("cursor", "")
        if(this.onClick != null) {
            face.css("cursor", "pointer")
            face.on("click", this.onClick);
        }
    }

    private getContent() : string {
        let faceHTML : HTMLElem = new HTMLElem("");

        let img : HTMLElem = new HTMLElem("img");
        img.get("src").push(new AttrVal(this.image));

        faceHTML.addChild(img);

        let messageDiv : HTMLElem = new HTMLElem("text");
        messageDiv.addChild(new HTMLText(this.message));

        faceHTML.addChild(messageDiv);

        return faceHTML.generateChildren()
    }
}