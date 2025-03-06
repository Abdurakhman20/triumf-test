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

    this.polygonArea.addEventListener("pointAdded", (e) => {
      this.controls.setPointCount(e.detail.length);
    });
  }

  clear() {
    this.polygonArea.clear();
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
          background-color:#afafaf;
          padding: 10px;
          border: 2px solid #000;
          color: #fff;
        }
        .content {
          display: flex; 
          justify-content: center;
          gap: 20px;
        }
        .title {
          font-size: 28px;
        }
        
        polygon-controls {
          width: 250px;
        }
      </style>
      <div class="container">
        <h1 class="title">Полигон</h1>
        <div class="content">
          <polygon-area></polygon-area>
          <polygon-controls></polygon-controls>
        </div>
      </div>
    `;
  }
}

customElements.define("polygon-app", PolygonApp);
