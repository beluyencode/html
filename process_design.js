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

const organization = ["long1", "long2", "long3", "long4"]
const numberOrder = [1, 2, 3, 4, 5, 6]

const main = document.getElementById("main")
const area_wheel = document.getElementById("area_wheel")


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
        view.applyTo(area_wheel);
    }
}
function mouseWheelEvent(event) {
    const x = event.pageX - (area_wheel.clientWidth / 2);
    const y = event.pageY - (area_wheel.clientHeight / 2);
    if (event.deltaY < 0) {
        view.scaleAt({ x, y }, 1.1);
        view.applyTo(main);
    } else {
        view.scaleAt({ x, y }, 1 / 1.1);
        view.applyTo(main);
    }
    event.preventDefault();
}

class TreeGroupNode {
    constructor(nodes, isFirst) {
        this.nodes = [...nodes];
        this.isFirst = isFirst;
        this.el = this.render();
    }
    render() {
        const group = document.createElement("div");
        group.classList.add("group-node")

        const groupContent = document.createElement("div");
        const groupMain = document.createElement("div");
        groupMain.classList.add("group-content-group")
        groupContent.classList.add("group-content")
        this.group = groupContent
        this.nodes.forEach(ele => {
            groupContent.append(ele.el);
        })
        if (!this.isFirst) {
        }
        if (this.isFirst) {
            group.style.gap = "0px";
        } else {
            groupContent.append(this.renderBtnAdd());
        }
        this.groupContentGroup = groupMain
        group.append(groupContent)
        group.append(this.groupContentGroup)
        return group;
    }
    afterRender() {
        if (this.nodes.length) {
            if (this.lineNodeTop) {
                this.lineNodeTop.remove()
            }
            if (this.lineNodeBottom) {
                this.lineNodeBottom.remove()
            }
            const nodes = this.nodes.map(ele => ele.el);
            this.lineNodeTop = this.renderLineGroup(nodes, 0);
            this.lineNodeBottom = this.renderLineGroup(nodes, 100);
            this.group.append(this.lineNodeTop);
            this.group.append(this.lineNodeBottom);
        }
    }
    afterRenderGroup() {
        const nodes = [...[...this.groupContentGroup.childNodes].filter(ele => [...ele.classList].includes("group-node"))];
        if (nodes.length > 1) {
            console.log(nodes);
            if (this.lineGroupTop) {
                this.lineGroupTop.remove()
            }
            this.lineGroupTop = this.renderLineGroup(nodes, 0, false);
            this.groupContentGroup.append(this.lineGroupTop);
        }
    }
    renderLineGroup(nodes, top, showlineTop = true) {
        let width = (nodes[0].clientWidth / 2) + (nodes[nodes.length - 1].clientWidth / 2)
        let left = (nodes[0].clientWidth / 2)
        const lineTop = document.createElement("div");
        lineTop.classList.add("line-group-top");
        const lineTo = document.createElement('div');
        if (nodes.length === 1) {
            width = 0;
            left = 0;
            lineTop.style.height = "0px"
        }
        if (top) {
            lineTo.classList.add("line")
            lineTop.append(lineTo)
        } else {
            if (showlineTop) {
                const line = document.createElement("div");
                line.append(lineTo)
                line.classList.add("line-to-top")
                lineTo.classList.add("line")
                lineTop.append(line)
            }
        }
        lineTop.style.width = `calc(100% - ${width}px)`;
        lineTop.style.left = `${left}px`;
        lineTop.style.top = `${top}%`;
        return lineTop
    }
    renderBtnAdd() {
        const btn = document.createElement("btn");
        btn.classList.add("add-node")
        btn.textContent = "+";
        return btn;
    }
}

class TreeNode {
    constructor(isFirst, name) {
        this.isFirst = isFirst;
        this.name = name;
        this.el = this.render();
    }
    render() {
        const node = document.createElement("div");
        node.classList.add("node");
        const nodeContent = document.createElement("div");
        nodeContent.textContent = this.name;
        nodeContent.classList.add("node-content");
        if (!this.isFirst) {
            const lineTop = document.createElement("div")
            lineTop.classList.add("line")
            node.append(lineTop);
        }
        node.append(nodeContent)
        const lineBottom = document.createElement("div")
        lineBottom.classList.add("line")
        node.append(lineBottom);
        if (this.isFirst) {
            this.group = new TreeGroupNode([]).group;
            node.append(this.group)
        }
        // node.append(this.renderBtnAdd())
        return node
    }

}
const parent = new TreeGroupNode([new TreeNode(true),], true);
let domParnet = parent
main.append(domParnet.el)

const group1 = new TreeGroupNode([
    new TreeNode(false, 1),
])
const group2 = new TreeGroupNode([
    new TreeNode(false, 2),
    new TreeNode(false, 2),
    new TreeNode(false, 2),
])
const group3 = new TreeGroupNode([
    new TreeNode(false, 3),
])
const group4 = new TreeGroupNode([
    new TreeNode(false, 4),
    new TreeNode(false, 4),
    new TreeNode(false, 4),

])
const group5 = new TreeGroupNode([
    new TreeNode(false, 5),
    new TreeNode(false, 5),
])
const group6 = new TreeGroupNode([
    new TreeNode(false, 6),
    new TreeNode(false, 6),
])

domParnet.groupContentGroup.append(group1.el)
domParnet.groupContentGroup.append(group2.el)
group1.groupContentGroup.append(group3.el)
group1.groupContentGroup.append(group4.el)
group4.groupContentGroup.append(group5.el)
group4.groupContentGroup.append(group6.el)

domParnet.afterRenderGroup()

group1.afterRender()
group1.afterRenderGroup()

group2.afterRender()
group2.afterRenderGroup()

group3.afterRender()
group3.afterRenderGroup()

group4.afterRender()
group4.afterRenderGroup()

group5.afterRender()
group5.afterRenderGroup()

group6.afterRender()
group6.afterRenderGroup()

setTimeout(() => {
    const group7 = new TreeGroupNode([
        new TreeNode(false, 7),
        new TreeNode(false, 7),
    ])
    group4.groupContentGroup.append(group7.el)

    domParnet.afterRenderGroup()
    group1.afterRender()
    group1.afterRenderGroup()

    group2.afterRender()
    group2.afterRenderGroup()

    group3.afterRender()
    group3.afterRenderGroup()

    group4.afterRender()
    group4.afterRenderGroup()

    group5.afterRender()
    group5.afterRenderGroup()

    group6.afterRender()
    group6.afterRenderGroup()
    group7.afterRender()
    group4.afterRenderGroup()
}, 2000);
