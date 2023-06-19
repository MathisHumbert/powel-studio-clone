class Colors {
  constructor() {}

  change({ background, color }) {
    document.documentElement.style.setProperty('--main-bg-color', background);
    document.documentElement.style.setProperty('--main-text-color', color);
  }
}

export const ColorsManager = new Colors();
