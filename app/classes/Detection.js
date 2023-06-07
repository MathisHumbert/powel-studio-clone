class Detection {
  constructor() {}

  isPhone() {
    if (!this.isMobileChecked) {
      this.isMobileChecked = true;

      this.isMobileCheck = document.body.classList.contains('phone');

      return this.isMobileCheck;
    }
  }

  isTable() {
    if (!this.isTabletChecked) {
      this.isTabletChecked = true;

      this.isTabletCheck = document.body.classList.contains('tablet');

      return this.isTabletCheck;
    }
  }

  isDesktop() {
    if (!this.isDesktopChecked) {
      this.isDesktopChecked = true;

      this.isDesktopCheck = document.body.classList.contains('desktop');

      return this.isDesktopCheck;
    }
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
