import "./components/polygon-area.js";
import "./components/polygon-controls.js";

class PolygonApp extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.polygonArea = this.shadow.querySelector("polygon-area");
    this.controls = this.shadow.querySelector("polygon-controls");

    this.controls.addEventListener("createPoints", () =>
      this.polygonArea.setIsCreatingPoints()
    );

    this.controls.addEventListener("drawPolygon", () =>
      this.polygonArea.drawPolygon()
    );

    this.controls.addEventListener("clear", () => this.clear());

    this.controls.addEventListener("selectFirstPoint", () => {
      this.polygonArea.startSelectingPoint("first");
    });

    this.controls.addEventListener("selectSecondPoint", () => {
      this.polygonArea.startSelectingPoint("second");
    });

    this.controls.addEventListener("toggleDirection", () => {
      this.polygonArea.togglePathDirection();
      this.controls.setOrderButtonText(this.polygonArea.clockwise);
      this.controls.updatePath(this.polygonArea.pathPoints);
    });

    this.controls.addEventListener("savePolygon", () =>
      this.polygonArea.savePolygon()
    );

    this.controls.addEventListener("loadPolygon", () => {
      this.polygonArea.loadPolygon();
      this.controls.setPointCount(this.polygonArea.points.length);
    });

    this.controls.addEventListener("deletePolygon", () =>
      this.polygonArea.deletePolygon()
    );

    this.polygonArea.addEventListener("pointAdded", (e) => {
      this.controls.setPointCount(e.detail.length);
    });

    this.polygonArea.addEventListener("pointsSelected", (e) => {
      this.controls.setSelectedPoints(e.detail.first, e.detail.second);
    });

    this.polygonArea.addEventListener("pathPointsUpdated", (e) => {
      this.controls.updatePath(e.detail.pathPoints);
    });
  }

  clear() {
    this.polygonArea.clear();
    this.controls.updatePath([]);
    this.controls.setPointCount(0);
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          border: 2px solid #000;
        }
        .content {
          display: flex; 
          justify-content: center;
          gap: 20px;
        }
        polygon-controls {
          width: 250px;
        }
      </style>
      <div class="container">
        <div class="content">
          <polygon-area></polygon-area>
          <polygon-controls></polygon-controls>
        </div>
      </div>
    `;
  }
}

customElements.define("polygon-app", PolygonApp);
