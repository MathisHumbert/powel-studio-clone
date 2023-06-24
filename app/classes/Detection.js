class Detection {
  constructor() {
    this.isDesktop = document.body.classList.contains('desktop');
  }

  checkIsDesktop() {
    return this.isDesktop;
  }
}

// Usage:
const detection = new Detection();

export default detection;
