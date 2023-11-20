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
        view.reset(this.ele)
        this.listPlan = {}
        for (let index = 0; index < 20; index++) {
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
        this.renderLine();
    }
    renderLine() {
        const width = document.getElementById("container")?.clientWidth || 0;
        [...this.ele.getElementsByClassName("roadNodeOrganization")].forEach(ele => {
            const prev = ele.previousElementSibling;
            const next = ele.nextElementSibling;
            if (prev) {
                [...prev.getElementsByClassName("row_node_organization")].forEach(item => {
                    const domParent = item.getElementsByClassName("row_node_child")[0];
                    const domNodeSign = domParent.getElementsByClassName("node_sign");
                    if (domNodeSign) {
                        const lineCenterBottom = this.renderLineCenter([...domNodeSign], "bottom");
                        domParent.append(lineCenterBottom)
                    }
                })
            }
            if (next) {
                [...next.getElementsByClassName("row_node_organization")].forEach(item => {
                    const domParent = [...item.getElementsByClassName("row_node_child")];
                    const domChild = domParent[domParent.length - 1];
                    if (domChild) {
                        const domNodeSign = [...domChild.getElementsByClassName("node_sign")];
                        const lineCenterBottom = this.renderLineCenter(domNodeSign, "top");
                        domParent[domParent.length - 1].append(lineCenterBottom)
                    }
                })
            }
            const lineTop = this.renderLineOrganization(prev, 'top');
            const lineBottom = this.renderLineOrganization(next, 'bottom');
            ele.append(lineTop);
            ele.append(lineBottom);
            const lineCenter = this.renderLineOrganization(null, 'center', lineTop, prev, lineBottom, next);
            ele.append(lineCenter);
            if (prev) {
                [...prev.getElementsByClassName("row_node_organization")].forEach((ele, index) => {
                    const lineToPrev = [...(ele ? ele.getElementsByClassName("line ProcessDesign renderLineCenter_top") : [])]
                    lineTop.append(
                        this.renderLineConnectOrganization(lineTop, 'top', lineToPrev[lineToPrev.length - 1], index)
                    )
                })
            }
            setTimeout(() => {
                if (next) {
                    [...next.getElementsByClassName("row_node_organization")].forEach((ele, index) => {
                        console.log(ele.getElementsByClassName("line ProcessDesign renderLineCenter_bottom"));
                        const lineToNext = [...(ele ? ele.getElementsByClassName("line ProcessDesign renderLineCenter_bottom") : [])]
                        if (lineToNext.length > 1) {

                        }
                        lineTop.append(
                            this.renderLineConnectOrganization(lineTop, 'bottom', lineToNext[0], index)
                        )
                    })
                }
            });
        })
    }
    getWidthRowNode(dom) {
        let width = dom?.clientWidth || 0;
        let left = 0;
        if (dom) {
            const item = [...(dom.getElementsByClassName("row_node_organization") || [])];
            if (item.length && item.length > 1) {

                width = item[item.length - 1].offsetLeft - item[0].offsetLeft + (item[item.length - 1].clientWidth / 2) - (item[0].clientWidth / 2);
                left = item[0].clientWidth / 2 + item[0].offsetLeft;
            } else {
                width = 0;
            }
        }
        return [width, left];
    }
    renderLineOrganization(dom, type, domTop, domLineTop, domBottom, domLineBottom) {
        const div = document.createElement("div")
        div.classList.add("line")
        div.classList.add("ProcessDesign")
        div.classList.add("renderLineOrganization")
        const arrlineConnect = [];
        const position = this.getWidthRowNode(dom)
        let width = position[0];
        let left = position[1];
        let connectLine
        let space = 0;
        switch (type) {
            case "top":
                div.style.top = "40%";
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.left = left + "px";
                // space = width / (domList.length - 1);
                // for (let index = 0; index < domList.length; index++) {
                //     const lineConnect = document.createElement("div");
                //     lineConnect.classList.add("line")
                //     lineConnect.style.height = "40px";
                //     lineConnect.style.width = "2px";
                //     lineConnect.style.top = "20px";
                //     lineConnect.style.left = space * index + "px";
                //     const arrow = document.createElement("div")
                //     arrow.classList.add("line")
                //     arrow.classList.add("line_arrow_connect")
                //     lineConnect.append(arrow)
                //     arrlineConnect.push(lineConnect)
                // }
                break;
            case "bottom":
                div.style.top = "60%";
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.left = left + "px";
                break;
            case "center":
                div.style.width = 2 + "px";
                div.setAttribute("type-index", type)
                let countPositon = 0;
                let countHeight = 100;
                let deviationNumberTop = 0;
                let deviationNumberBottom = 0;
                if (domTop.clientWidth) {
                    countPositon = countPositon + 40;
                    countHeight -= 40;
                } else {
                    const haveLineChildTop = [...(domLineTop?.getElementsByClassName("line") || [])];
                    deviationNumberTop = (haveLineChildTop[haveLineChildTop.length - 1] || {}).clientWidth ? 41 : 0;

                }
                if (domBottom.clientWidth) {
                    countHeight -= 40;
                } else {
                    const haveLineChildBottom = [...(domLineBottom?.getElementsByClassName("line") || [])];
                    deviationNumberBottom = (haveLineChildBottom[haveLineChildBottom.length - 1] || {}).clientWidth ? 40 : 0;
                }
                div.style.top = `calc(${countPositon}% + ${deviationNumberTop}px )`;
                div.style.height = `calc(${countHeight}% - ${deviationNumberBottom}px - ${deviationNumberTop}px )`;
                div.style.left = `calc(50% - 1px)`;
                const add = document.createElement("div")
                add.classList.add("add_btn")
                add.textContent = "+"
                div.append(add)
            default:
                break;
        }
        return div
    }
    calculateDistanceY(element1, element2) {
        var rect1 = element1.getBoundingClientRect();
        var rect2 = element2.getBoundingClientRect();

        var distanceX = Math.abs(rect1.left - rect2.left);
        var distanceY = Math.abs(rect1.top - rect2.top);

        return { x: distanceX, y: distanceY };
    }
    renderLineConnectOrganization(domLine, type, lineTo, index) {
        const div = document.createElement("div")
        if (domLine.clientWidth) {
            div.classList.add("line")
            div.classList.add("ProcessDesign")
            div.classList.add("renderLineConnectOrganization")
            const arrlineConnect = [];
            let add
            let space = 0;
            switch (type) {
                case "top":
                    div.style.width = "2px";
                    div.style.height = this.calculateDistanceY(domLine, lineTo).y + "px";
                    div.style.bottom = "0px";
                    div.style.transform = "none";
                    div.style.left = this.calculateDistanceY(domLine, lineTo).x - 1 + lineTo.clientWidth / 2 + "px";
                    if (!index) {
                        div.style.left = "-1px"
                    }
                    add = document.createElement("div")
                    add.classList.add("add_btn")
                    add.textContent = "+"
                    div.append(add)
                    // console.log(domLine, lineTo, this.calculateDistanceY(domLine, lineTo), index);
                    break;
                case "bottom":
                    div.style.width = "2px";
                    div.style.height = this.calculateDistanceY(domLine, lineTo).y + "px";
                    div.style.bottom = "0px";
                    div.style.left = this.calculateDistanceY(domLine, lineTo).x - 1 + lineTo.clientWidth / 2 + "px";
                    div.style.transform = "none";
                    add = document.createElement("div")
                    add.classList.add("add_btn")
                    add.textContent = "+"
                    div.append(add)
                    console.log(div, lineTo, this.calculateDistanceY(domLine, lineTo), index);
                    break;
                default:
                    break;
            }
        }
        return div
    }
    renderLineCenter(domList, type, lineTo) {
        const div = document.createElement("div")
        div.classList.add("line")
        div.classList.add("ProcessDesign")
        div.classList.add(`renderLineCenter_${type}`)
        const arrlineConnect = [];
        let width = 0;
        let space = 0;
        let lineConnectOrganization
        switch (type) {
            case "top":
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.top = "150%";
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
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.bottom = " calc(100% + 40px)";
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
            default:
                break;
        }
        return div
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
            ele.append(lineCenterCenter)
            ele.append(lineCenterBottom)
            ele.append(lineCenterTop)
        })
    }
    renderLineCenter(domList, type) {
        const div = document.createElement("div")
        div.classList.add("line")
        div.classList.add("NodeOrganization")
        div.classList.add("renderLineCenter")
        div.style.backgroundColor = this.color;
        const arrlineConnect = [];
        let width = 0;
        let space = 0;
        switch (type) {
            case "top":
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.top = "40px";
                div.setAttribute("type-index", type)
                space = width / (domList.length - 1);
                for (let index = 0; index < domList.length; index++) {
                    const lineConnect = document.createElement("div");
                    lineConnect.classList.add("line")
                    lineConnect.style.height = "40px";
                    lineConnect.style.width = "2px";
                    lineConnect.style.top = "-18px";
                    lineConnect.style.left = space * index + "px";
                    lineConnect.style.backgroundColor = this.color;
                    arrlineConnect.push(lineConnect)
                }
                div.append(...arrlineConnect)
                break;
            case "bottom":
                width = 180 * domList.length + 80 * (domList.length - 1) - 180;
                div.style.width = width + "px";
                div.style.height = "2px";
                div.style.bottom = "40px";
                div.setAttribute("type-index", type)
                space = width / (domList.length - 1);
                for (let index = 0; index < domList.length; index++) {
                    const lineConnect = document.createElement("div");
                    lineConnect.classList.add("line")
                    lineConnect.style.height = "40px";
                    lineConnect.style.width = "2px";
                    lineConnect.style.top = "20px";
                    lineConnect.style.left = space * index + "px";
                    lineConnect.style.backgroundColor = this.color;
                    const arrow = document.createElement("div")
                    arrow.classList.add("line")
                    arrow.classList.add("line_arrow_connect")
                    arrow.style.backgroundColor = this.color;
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
                add.style.color = this.color
                add.style.borderColor = this.color
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
const numberOrder = [1, 2, 3, 4, 5, 6]

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