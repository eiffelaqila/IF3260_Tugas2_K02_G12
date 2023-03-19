class PropItem {
    /** @type {string} Prop item name */
    #name;
    /** @type {HTMLElement} Prop name */
    #html;

    /**
     * Create prop items
     * @param {string} name Prop name
     */
    constructor(name) {
        this.#name = name;
        console.log(`properties-${name}`);
        this.#html = document.getElementById(`properties-${name}`);
        console.log(this.#html);
    }

    get name() {
        return this.#name;
    }

    get html() {
        return this.#html;
    }
}

class Properties {
    /** @type {Object<string, PropItem>} Properties items */
    #items = [];

    constructor() {
        this.#items = {};
    }

    get items() {
        return this.#items;
    }

    /**
     * Create properties items
     * @param {PropItem} propItem Properties item to be added
     */
    add(propItem) {
        this.#items[propItem.name] = propItem;
    }
}

export const properties = new Properties();
properties.add(new PropItem("object"));
properties.add(new PropItem("projection"));

export function propertiesToggle(name) {
    Object.keys(properties.items).forEach((key) => {
        properties.items[key].html.style.display = "none";
    });

    properties.items[name].html.style.display = "block";
}

globalThis.app = {
    ...globalThis.app,
    properties: {
        instance: properties,
    },
};
