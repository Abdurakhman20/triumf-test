class PolygonArea extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.points = [];
    this.polygonDrawn = false;
    this.isCreatingPoints = false;
  }

  connectedCallback() {
    this.render();
    this.canvas = this.shadow.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.addEventListener("click", (e) => this.addPoint(e));
  }

  setIsCreatingPoints() {
    this.isCreatingPoints = true;
  }

  addPoint(event) {
    if (this.polygonDrawn || !this.isCreatingPoints) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.points.length < 15) {
      this.points.push({ x, y });
      this.renderCanvas();
      this.dispatchEvent(
        new CustomEvent("pointAdded", { detail: this.points })
      );
    }
  }

  drawPolygon() {
    if (this.points.length < 3) return;
    this.polygonDrawn = true;
    this.renderCanvas();
  }

  clear() {
    this.points = [];
    this.polygonDrawn = false;
    this.isCreatingPoints = false;
    this.renderCanvas();
  }

  renderCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "yellow";
    this.points.forEach((p, index) => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = "black";
      this.ctx.font = "14px Roboto";
      this.ctx.fillText(`p${index + 1}`, p.x + 10, p.y - 10);
      this.ctx.fillStyle = "yellow";
    });

    if (this.polygonDrawn) {
      this.ctx.strokeStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      this.points.forEach((p) => this.ctx.lineTo(p.x, p.y));
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          canvas { background: #6d6c6c; border: 2px solid #000;}
        </style>
        <canvas width="600" height="600">
        </canvas>
      `;
  }
}

customElements.define("polygon-area", PolygonArea);
