class PolygonArea extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.points = [];
    this.polygonDrawn = false;
    this.isCreatingPoints = false;
    this.selectingPoint = null;
    this.firstPoint = null;
    this.secondPoint = null;
    this.clockwise = true;
  }

  connectedCallback() {
    this.render();
    this.canvas = this.shadow.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.addEventListener("click", (e) => this.addOrSelectPoint(e));
  }

  setIsCreatingPoints() {
    this.isCreatingPoints = true;
  }

  addOrSelectPoint(event) {
    if (this.polygonDrawn && this.selectingPoint) {
      this.selectPathPoint(event);
    } else if (!this.polygonDrawn && this.isCreatingPoints) {
      this.addPoint(event);
    }
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

  startSelectingPoint(type) {
    this.selectingPoint = type;
  }

  selectPathPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let closestPoint = null;
    let minDistance = Infinity;

    this.points.forEach((p, index) => {
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < 10 && distance < minDistance) {
        closestPoint = index;
        minDistance = distance;
      }
    });

    if (closestPoint !== null) {
      if (this.selectingPoint === "first") {
        this.firstPoint = closestPoint;
      } else if (this.selectingPoint === "second") {
        this.secondPoint = closestPoint;
      }

      this.dispatchEvent(
        new CustomEvent("pointsSelected", {
          detail: { first: this.firstPoint, second: this.secondPoint },
        })
      );

      if (this.firstPoint !== null && this.secondPoint !== null) {
        this.renderCanvas();
      }
    }

    this.selectingPoint = null;
  }

  togglePathDirection() {
    this.clockwise = !this.clockwise;
    this.renderCanvas();
  }

  clear() {
    this.points = [];
    this.polygonDrawn = false;
    this.isCreatingPoints = false;
    this.firstPoint = null;
    this.secondPoint = null;
    this.selectingPoint = null;

    this.renderCanvas();

    this.dispatchEvent(
      new CustomEvent("pointsSelected", {
        detail: { first: null, second: null },
      })
    );
  }

  savePolygon() {
    if (!this.points.length) {
      alert("Создайте полигон, чтобы его сохранить!");
      return;
    }
    localStorage.setItem("polygon", JSON.stringify(this.points));
    alert("Полигон сохранен в localStorage!");
  }

  loadPolygon() {
    const saved = JSON.parse(localStorage.getItem("polygon"));
    if (saved) {
      this.points = saved;
      this.polygonDrawn = true;
      this.renderCanvas();

      alert("Полигон загружен из localStorage!");
    }
  }

  deletePolygon() {
    const saved = JSON.parse(localStorage.getItem("polygon"));
    if (saved) {
      localStorage.removeItem("polygon");
      alert("Полигон удален из localStorage!");
    }
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

    if (this.firstPoint !== null && this.secondPoint !== null) {
      this.ctx.strokeStyle = "blue";
      this.ctx.beginPath();

      let index1 = this.firstPoint;
      let index2 = this.secondPoint;

      let pathPoints = [];

      if (this.clockwise) {
        // Двигаемся по часовой стрелке
        if (index1 < index2) {
          pathPoints = this.points.slice(index1, index2 + 1);
        } else {
          pathPoints = [
            ...this.points.slice(index1),
            ...this.points.slice(0, index2 + 1),
          ];
        }
      } else {
        // Двигаемся против часовой стрелки
        if (index1 > index2) {
          pathPoints = this.points.slice(index2, index1 + 1).reverse();
        } else {
          pathPoints = [
            ...this.points.slice(index2),
            ...this.points.slice(0, index1 + 1),
          ].reverse();
        }
      }

      // Рисуем путь через рёбра
      this.ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      pathPoints.forEach((p) => this.ctx.lineTo(p.x, p.y));

      this.ctx.stroke();
    }
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          canvas { background: #bababa; border: 2px solid #000;}
        </style>
        <canvas width="600" height="600"></canvas>
      `;
  }
}

customElements.define("polygon-area", PolygonArea);
