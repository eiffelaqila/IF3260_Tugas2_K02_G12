import { propertiesToggle } from "./properties.js";

const toolbarFunction = (toolItem) => {
    if (toolItem.name === "object") {
        Object.keys(toolbar.items).forEach((key) => {
            toolbar.items[key].html.classList.remove("active");
        });

        toolItem.html.classList.add("active");
        propertiesToggle("object");
    } else if (toolItem.name === "projection") {
        Object.keys(toolbar.items).forEach((key) => {
            toolbar.items[key].html.classList.remove("active");
        });

        toolItem.html.classList.add("active");
        propertiesToggle("projection");
    } else if (toolItem.name === "file") {
        Object.keys(toolbar.items).forEach((key) => {
            toolbar.items[key].html.classList.remove("active");
        });

        toolItem.html.classList.add("active");
        propertiesToggle("file");
    } else {
        alert("Please select a valid button");
    }
};

class ToolItem {
    /** @type {string} Tool item name */
    #name;
    /** @type {boolean} Is active */
    #active;
    /** @type {HTMLElement} Tool name */
    #html;

    /**
     * Create tool items
     * @param {string} name Tool name
     */
    constructor(name) {
        this.#name = name;
        this.#active = false;
        this.#html = document.getElementById(`tool-${name}`);
        this.#html.addEventListener("click", (e) => {
            toolbarFunction(this);
        });
    }

    get name() {
        return this.#name;
    }

    get active() {
        return this.#active;
    }

    get html() {
        return this.#html;
    }
}

class Toolbar {
    /** @type {Object<string, ToolItem>} Toolbar items */
    #items = [];

    constructor() {
        this.#items = {};
    }

    get items() {
        return this.#items;
    }

    /**
     * Create tool items
     * @param {ToolItem} toolItem Tool item to be added
     */
    add(toolItem) {
        this.#items[toolItem.name] = toolItem;
    }
}

export const toolbar = new Toolbar();
toolbar.add(new ToolItem("object"));
toolbar.add(new ToolItem("projection"));

globalThis.app = {
    ...globalThis.app,
    toolbar: {
        instance: toolbar,
    },
};
