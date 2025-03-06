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

    this.createPointsBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("createPoints"))
    );
    this.drawPolygonBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("drawPolygon"))
    );
    this.clearBtn.addEventListener("click", () =>
      this.dispatchEvent(new Event("clear"))
    );
  }

  setPointCount(count) {
    const countDisplay = this.shadow.querySelector("#pointCount");
    countDisplay.textContent = `Created ${count} points`;
    countDisplay.style.color = count >= 3 && count <= 15 ? "green" : "red";
    this.drawPolygonBtn.disabled = count < 3;
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          .panel { display: flex; flex-direction: column; gap: 10px; }
          button:disabled { background: #999; }
          #pointCount { font-size: 14px; }
        </style>
        <div class="panel">
          <button id="createPoints">Create points</button>
          <span id="pointCount">Created 0 points</span>
          <button id="drawPolygon" disabled>Draw polygon</button>
          <button id="clear">Clear</button>
        </div>
      `;
  }
}

customElements.define("polygon-controls", PolygonControls);
