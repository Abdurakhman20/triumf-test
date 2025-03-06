class PolygonControls extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.createPointsBtn = this.shadow.querySelector("#createPoints");
    this.drawPolygonBtn = this.shadow.querySelector("#drawPolygon");
    this.clearBtn = this.shadow.querySelector("#clear");
    this.firstPointBtn = this.shadow.querySelector("#firstPoint");
    this.secondPointBtn = this.shadow.querySelector("#secondPoint");
    this.orderBtn = this.shadow.querySelector("#clockwise-order");
    this.firstPointLabel = this.shadow.querySelector("#firstPointLabel");
    this.secondPointLabel = this.shadow.querySelector("#secondPointLabel");
    this.saveBtn = this.shadow.querySelector("#save");
    this.deleteBtn = this.shadow.querySelector("#delete");
    this.loadBtn = this.shadow.querySelector("#load");

    this.createPointsBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("createPoints"))
    );
    this.drawPolygonBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("drawPolygon"))
    );
    this.clearBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("clear"))
    );
    this.firstPointBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("selectFirstPoint"))
    );
    this.secondPointBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("selectSecondPoint"))
    );
    this.orderBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("toggleDirection"))
    );
    this.saveBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("savePolygon"))
    );
    this.loadBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("loadPolygon"))
    );
    this.deleteBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("deletePolygon"))
    );
  }

  setPointCount(count) {
    const countDisplay = this.shadow.querySelector("#pointCount");
    countDisplay.textContent = `Created ${count} points`;
    countDisplay.style.color = count >= 3 && count <= 15 ? "green" : "red";
    this.drawPolygonBtn.disabled = count < 3;
  }

  setSelectedPoints(first, second) {
    this.firstPointLabel.textContent =
      first !== null ? `P${first + 1}` : "Not selected";
    this.secondPointLabel.textContent =
      second !== null ? `P${second + 1}` : "Not selected";
  }

  setOrderButtonText(clockwise) {
    this.orderBtn.textContent = clockwise ? "clockwise" : "counterclockwise";
  }

  updatePath(pathPoints) {
    const pathText =
      pathPoints.length > 0
        ? `Path: ${pathPoints.map((p) => p.name).join(" -> ")}`
        : "";
    this.shadow.querySelector("#path-text").textContent = pathText;
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          .panel { 
            display: flex; 
            flex-direction: column; 
            gap: 10px; 
          }
          button:disabled { 
            background: #999; 
          }
          #pointCount { 
            font-size: 14px; 
          }
          .text {
            text-align: center;
          }
          .path-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .path-container-box {
            display: flex;
            gap: 10px;
          }
          .label { font-size: 14px; color: blue; }
        </style>
        <div class="panel">
          <button id="createPoints">Create points</button>
          <span id="pointCount">Created 0 points</span>
          <button id="drawPolygon" disabled>Draw polygon</button>
          <span class="text">Create Path</span>
          <div class="path-container">
            <div class="path-container-box">
              <button id="firstPoint">First point</button>
              <span id="firstPointLabel" class="label">Not selected</span>
            </div>
            <div class="path-container-box">
              <button id="secondPoint">Second point</button>
              <span id="secondPointLabel" class="label">Not selected</span>
            </div>
          </div>
          <button id="clockwise-order">clockwise</button>
          <button id="save">save to localStorage</button>
          <button id="load">load from localStorage</button>
          <button id="delete">delete from localStorage</button>
          <button id="clear">Clear</button>
          <p id="path-text"></p>
        </div>
      `;
  }
}

customElements.define("polygon-controls", PolygonControls);
