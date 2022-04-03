/***
 * body: function that sets up page body
 * @param children {Node}
 */
function body(...children) {
    const el = document.querySelector("body");
    el.id = "body";
    const classList = "body".split(" ");
    el.classList.add(...classList);
    el.style.margin = "0";
    el.style.padding = "0";
    children.forEach(child => el.appendChild(child));
    return el;
}

/***
 * topBar: function that sets up top bar
 * @param children {Node}
 */
function topBar(...children) {
    const el = document.createElement("section");
    el.id = "top-bar";
    const classList = "bar top-bar".split(" ");
    el.classList.add(...classList);
    children.forEach(child => el.appendChild(child));
    return el;
}

function buttonFactory({text, id, classList, onClick}) {
    const el = document.createElement("button");
    el.id = id;
    el.classList.add(...classList);
    el.innerText = text;
    el.onclick = (e) => {
        const clickEvent = new Event(`${id}-clicked`);
        document.dispatchEvent(clickEvent);
        onClick(e);
    };
    el.style.cursor = "pointer";
    el.style.margin = "4px";
    return el;
}

/***
 * brandButton: creates a button that will function as a brand
 * @param text {string}
 * @param onClick { (this:GlobalEventHandlers, ev: MouseEvent) => any }
 * @returns {HTMLButtonElement}
 */
function brandButton(text, onClick) {
    const id = "brand-btn";
    const classList = "brand btn".split(" ");
    document.addEventListener(`${id}-clicked`, e => {
        console.log("received event. reload page again.", e.timeStamp);
    });
    return buttonFactory({text, id, classList, onClick});
}

/***
 * fileMenuItem: create a menu item for file button
 * @param text {string}
 * @param onClick { (this:GlobalEventHandlers, ev: MouseEvent) => any }
 * @returns {HTMLButtonElement}
 */
function fileMenuItem(text, onClick) {
    const id = "file-menu-item";
    const classList = "file menu-item".split(" ");
    document.addEventListener(`${id}-clicked`, e => {
        console.log("received event. open file menu", e.timeStamp);
    });
    return buttonFactory({text, id, classList, onClick});
}

/***
 * menu: creates a menu for topBar
 * @param children
 * @returns {HTMLDivElement}
 */
function menu(...children) {
    const el = document.createElement("div");
    el.id = "menu";
    const classList = "menu top-menu".split(" ");
    el.classList.add(...classList);
    children.forEach(child => el.appendChild(child));
    return el;
}

body(
    topBar(
        menu(
            brandButton("jspaint", () => console.log("brand clicked")),
            fileMenuItem("file", () => console.log("file menu item clicked")))));
