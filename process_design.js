const view = (() => {
    const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
    var m = matrix;             // alias 
    var scale = 1;              // current scale
    const pos = { x: 0, y: 0 }; // current position of origin
    var dirty = true;
    const API = {
        applyTo(el) {
            if (dirty) { }
            this.update()
            el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
        },
        update() {
            dirty = false;
            m[3] = m[0] = scale;
            m[2] = m[1] = 0;
            m[4] = pos.x;
            m[5] = pos.y;
        },
        pan(amount) {
            if (dirty) { } this.update()
            pos.x += amount.x;
            pos.y += amount.y;
            dirty = true;
        },
        scaleAt(at, amount) { // at in screen coords
            if (dirty) { } this.update()
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
        },
    };
    return API;
})();

class ProcessDesign {
    constructor(id) {
        this.arrNode = [[]]
        this.ele = document.getElementById(id);
    }

    appendNode(index, node) {
        if (this.arrNode[index]) {
            this.arrNode[index].push(node);
            this.renderTreeNode();
            return node;
        }
        if (index >= this.arrNode.length - 1) {
            this.arrNode.push([]);
            this.arrNode[this.arrNode.length - 1].push(node);
            this.renderTreeNode();
            return node;
        }
        return null;
    }
    renderTreeNode() {
        this.ele.innerHTML = "";

        const arrDiv = this.arrNode.map(ele => {
            const row = document.createElement("div")
            row.classList.add("row_node")
            row.append(...[...ele.map(ele => ele.renderNode())]);
            return row;
        })
        this.ele.append(...arrDiv)
        return arrDiv;
    }
}
class Node {
    constructor(name) {
        this.name = name;
    }

    renderNode() {
        const div = document.createElement("div")
        div.classList.add("node_sign")
        div.innerHTML = this.name;
        return div
    }
}

const mainNode = new ProcessDesign("main");
const main = document.getElementById("main")
const btn = document.getElementById("addNode")
const area_wheel = document.getElementById("area_wheel")


btn.addEventListener("click", () => {
    mainNode.appendNode(+document.getElementById("index").value, new Node(document.getElementById("name").value))
})
let scale = 1;


area_wheel.addEventListener("mousemove", mouseEvent, { passive: false });
area_wheel.addEventListener("mousedown", mouseEvent, { passive: false });
area_wheel.addEventListener("mouseup", mouseEvent, { passive: false });
area_wheel.addEventListener("mouseout", mouseEvent, { passive: false });
area_wheel.addEventListener("wheel", mouseWheelEvent, { passive: false });
const mouse = { x: 0, y: 0, oldX: 0, oldY: 0, button: false };
function mouseEvent(event) {
    if (event.type === "mousedown") { mouse.button = true }
    if (event.type === "mouseup") {
        mouse.button = false
    }
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    if (mouse.button) { // pan
        view.pan({ x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY });
        view.applyTo(main);
    }
    event.preventDefault();
}
function mouseWheelEvent(event) {
    const x = event.pageX - (main.clientWidth / 2);
    const y = event.pageY - (main.clientHeight / 2);
    if (event.deltaY < 0) {
        view.scaleAt({ x, y }, 1.1);
        view.applyTo(main);
    } else {
        view.scaleAt({ x, y }, 1 / 1.1);
        view.applyTo(main);
    }
    event.preventDefault();
}