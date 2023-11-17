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
        reset(el) {
            m = [1, 0, 0, 1, 0, 0];
            pos.x = 0;
            scale = 1;              // current scale
            pos.y = 0;
            el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
        }
    };
    return API;
})();

class ProcessDesign {
    constructor(id) {
        this.ele = document.getElementById(id);
        this.container = document.getElementById("container")
        this.listPlan = {}
        this.doms = null;
    }
    appendNode(idStart) {

        return null
    }
    findNode(type, id) {
        switch (type) {
            case 'start':

                break;

            default:
                break;
        }
    }
    renderTreeNode() {
        this.ele.innerHTML = "";

        return arrDiv;
    }
    test(organization, numberOrder) {
        this.listPlan = {}
        for (let index = 0; index < 10; index++) {
            const id = this.ObjectId();
            this.listPlan[id] = new NodeSign(id, id, this.getRandom(organization), this.getRandom(numberOrder))
        }
        const list = {}
        Object.values(this.listPlan).forEach(ele => {
            list[ele.organization] = [
                ...(list[ele.organization] || []),
                ele
            ]
        })
        const newList = [];
        Object.keys(list).forEach(ele => {
            newList.push(new NodeOrganization(+ele, list[ele], this.getRandom(numberOrder), this.getRandomColor()))
        })
        const final = {}
        newList.forEach(ele => {
            final[ele.numberOrder] = [
                ...(final[ele.numberOrder] || []),
                ele
            ]
        })
        console.log(final);
        this.doms = final;
    }
    ObjectId(m = Math, d = Date, h = 16, s = (sELe) => m.floor(sELe).toString(h)) {
        return s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));
    }
    getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }
    getRandomColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16)
    }
    render() {
        this.container.innerHTML = "";
        const road = document.createElement("div")
        road.classList.add("roadNodeOrganization")
        Object.values(this.doms).forEach(ele => {
            const div = document.createElement("div");
            div.classList.add("row_node")
            ele.forEach(item => {
                div.append(item.render())
            });
            this.container.append(road.cloneNode());
            this.container.append(div);
        })
        this.container.append(road.cloneNode());
    }
}
class NodeOrganization {
    constructor(id, nodes, numberOrder, color) {
        this.id = id;
        this.numberOrder = numberOrder
        this.nodes = nodes.sort((a, b) => a.numberOrder - b.numberOrder);
        this.color = color
    }

    render() {
        const div = document.createElement("div");
        div.classList.add("row_node_organization")
        if (this.nodes.length) {
            let row = document.createElement("div")
            row.classList.add('row_node_child');
            const roadNodePersonal = document.createElement("div")
            roadNodePersonal.classList.add("roadNodePersonal")
            let currentNumberOrder = this.nodes[0].numberOrder;
            this.nodes.forEach((ele) => {
                if (currentNumberOrder === ele.numberOrder) {
                    row.append(ele.renderNode(this.color));
                } else {
                    currentNumberOrder = ele.numberOrder;
                    div.append(row);
                    div.append(roadNodePersonal.cloneNode());
                    row = document.createElement("div")
                    row.classList.add('row_node_child');
                    row.append(ele.renderNode(this.color));
                }
            })
            if (row.childNodes.length) {
                div.append(row);
                // div.append(roadNodePersonal.cloneNode());
            }
            this.ele = div
        }
        this.renderLine()
        return div
    }
    renderLine() {
        [...this.ele.getElementsByClassName("roadNodePersonal")].forEach(ele => {
            const prev = ele.previousElementSibling.childNodes;
            const next = ele.nextElementSibling.childNodes;
            const lineCenterTop = this.renderLineCenter(prev, "top");
            const lineCenterBottom = this.renderLineCenter(next, "bottom");
            const lineCenterCenter = this.renderLineCenter(next, "center");
            ele.append(lineCenterTop)
            ele.append(lineCenterCenter)
            ele.append(lineCenterBottom)
        })
        console.log(
            this.ele.getElementsByClassName("roadNodePersonal")
        );
    }
    renderLineCenter(domList, type) {
        const div = document.createElement("div")
        div.classList.add("line")
        const arrlineConnect = [];
        let width = 0;
        let space = 0;
        switch (type) {
            case "top":
                console.log(domList[domList.length - 1].offsetLeft, domList[0].offsetLeft);
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.top = "40px";
                space = width / (domList.length - 1);
                for (let index = 0; index < domList.length; index++) {
                    const lineConnect = document.createElement("div");
                    lineConnect.classList.add("line")
                    lineConnect.style.height = "40px";
                    lineConnect.style.width = "2px";
                    lineConnect.style.top = "-18px";
                    lineConnect.style.left = space * index + "px";
                    arrlineConnect.push(lineConnect)
                }
                div.append(...arrlineConnect)
                break;
            case "bottom":
                console.log(domList[domList.length - 1].offsetLeft, domList[0].offsetLeft);
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.bottom = "40px";
                space = width / (domList.length - 1);
                for (let index = 0; index < domList.length; index++) {
                    const lineConnect = document.createElement("div");
                    lineConnect.classList.add("line")
                    lineConnect.style.height = "40px";
                    lineConnect.style.width = "2px";
                    lineConnect.style.top = "20px";
                    lineConnect.style.left = space * index + "px";
                    const arrow = document.createElement("div")
                    arrow.classList.add("line")
                    arrow.classList.add("line_arrow_connect")
                    lineConnect.append(arrow)
                    arrlineConnect.push(lineConnect)
                }
                div.append(...arrlineConnect)
                break;
            case "center":
                div.style.width = "2px";
                div.style.height = "68px";
                div.style.top = "50%";
                const add = document.createElement("div")
                add.classList.add("add_btn")
                add.textContent = "+"
                div.append(add)
                break;
            default:
                break;
        }
        return div
    }
}
class NodeSign {
    constructor(name, id, numberOrder, organization) {
        this.name = numberOrder;
        this.id = id
        this.isStart = false;
        this.isEnd = false;
        this.numberOrder = numberOrder
        this.organization = organization;
    }

    renderNode(color) {
        const div = document.createElement("div")
        div.classList.add("node_sign");
        div.style.background = color;
        div.innerHTML = this.name;
        div.setAttribute("id", this.id);
        this.ele = div
        return div
    }
}

const organization = [1, 2, 3, 4]
const numberOrder = [1, 2, 3, 4]

const mainNode = new ProcessDesign("main");
const main = document.getElementById("main")
const btn = document.getElementById("addNode")
const area_wheel = document.getElementById("area_wheel")
const reset = document.getElementById("reset")

mainNode.test(organization, numberOrder)
mainNode.render()


btn.addEventListener("click", () => {
    mainNode.test(organization, numberOrder)
    mainNode.render()
})
reset.addEventListener("click", () => {
    view.reset(main)
})
let scale = 1;


area_wheel.addEventListener("mousemove", mouseEvent, { passive: false });
area_wheel.addEventListener("mousedown", mouseEvent, { passive: false });
area_wheel.addEventListener("mouseup", mouseEvent, { passive: false });
area_wheel.addEventListener("mouseout", mouseEvent, { passive: false });
area_wheel.addEventListener("wheel", mouseWheelEvent, { passive: false });
const mouse = { x: 0, y: 0, oldX: 0, oldY: 0, button: false };
function mouseEvent(event) {
    event.preventDefault();
    if (event.type === "mousedown") {
        mouse.button = true;
    }
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