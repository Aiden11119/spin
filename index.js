const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const addItemBtn = document.getElementById("addItem");
const itemList = document.getElementById("itemList");
const result = document.getElementById("result");

let items = [];
let currentRotation = 0;

function renderInputs() {
    itemList.innerHTML = "";
    items.forEach((text, i) => {
        const row = document.createElement("div");
        row.className = "input-group mb-2";
        row.innerHTML = `
            <span class='input-group-text'>${i + 1}</span>
            <input type='text' class='form-control itemInput' data-index='${i}' value='${text}' />
            <button class='btn btn-danger deleteItem' data-index='${i}'><i class='bi bi-trash'></i></button>
        `;
        itemList.appendChild(row);
    });
}

//删除按钮
itemList.addEventListener("click", e => {
    if (e.target.closest(".deleteItem")) {
        const i = e.target.closest(".deleteItem").dataset.index;
        items.splice(i, 1);
        renderInputs();
        buildWheel();
    }
});


//添加按钮
addItemBtn.onclick = () => {
    items.push("");
    renderInputs();
    buildWheel();
};


//给input 添加listened
document.addEventListener("input", e => {
    if (e.target.classList.contains("itemInput")) {
        items[e.target.dataset.index] = e.target.value;
        buildWheel();
    }
});



function buildWheel() {
    const filled = items.filter(x => x.trim() !== "");
    wheel.innerHTML = "";
    if (filled.length === 0) {
        wheel.style.background = "#eee";
        return;
    }

    if (filled.length === 1) {
        wheel.innerHTML = "";
        wheel.style.background = "hsl(200, 70%, 50%)";

        const label = document.createElement("div");
        label.style.position = "absolute";
        label.style.left = "50%";
        label.style.top = "50%";
        label.style.transform = "translate(-50%, -50%)";
        label.style.fontWeight = "bold";
        label.style.color = "#fff";
        label.style.fontSize = "24px";
        label.style.textShadow = "1px 1px 3px rgba(0,0,0,0.5)";
        label.textContent = filled[0];
        wheel.appendChild(label);
        return;
    }

    
    let gradientParts = [];
    const angle = 360 / filled.length;

    filled.forEach((item, index) => {
        const start = index * angle;
        const end = start + angle;
        const color = `hsl(${index * (360 / filled.length)}, 70%, 50%)`;
        gradientParts.push(`${color} ${start}deg ${end}deg`);
    });

    wheel.style.background = `conic-gradient(${gradientParts.join(',')})`;

    filled.forEach((item, index) => {
        const label = document.createElement("div");
        label.style.position = "absolute";
        label.style.left = "50%";
        label.style.top = "50%";
        label.style.transform = `translate(-50%, -50%) rotate(${index * angle + angle / 2}deg) translate(0, -110px) rotate(${- (index * angle + angle / 2)}deg)`;
        label.style.transformOrigin = "center";
        label.style.fontWeight = "bold";
        label.style.color = "#fff";
        label.style.fontSize = "18px";
        label.style.textShadow = "1px 1px 3px rgba(0,0,0,0.5)";
        label.textContent = item;
        wheel.appendChild(label);
    });
}



spinBtn.onclick = () => {
    const filled = items.filter(x => x.trim() !== "");
    if (filled.length === 0) return alert("please input at least one content");

    const anglePer = 360 / filled.length;
    const randomSpin = Math.floor(Math.random() * 360) + 720 + Math.random()*360;

    currentRotation += randomSpin;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const normalized = (currentRotation % 360 + 360) % 360;
        const index = Math.floor(filled.length - (normalized / anglePer)) % filled.length;
        result.textContent = "RESULT:" + filled[index];
    }, 5100);
};