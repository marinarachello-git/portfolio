const PLUS_ICON = "assets/skills/icon-plus.png";
const MINUS_ICON = "assets/skills/icon-minus.png";

function setToggleState(toggle, isOpen) {
  const icon = toggle.querySelector(".skill-toggle__icon");
  if (icon) {
    icon.src = isOpen ? MINUS_ICON : PLUS_ICON;
  }
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute(
    "aria-label",
    isOpen ? "Collapse skill" : "Expand skill"
  );
}

export function initSkills() {
  const skillItems = document.querySelectorAll(".skill-item");

  if (!skillItems.length) return;

  skillItems.forEach((item) => {
    const row = item.querySelector(".skill-row");
    const body = item.querySelector(".skill-body");
    const toggle = item.querySelector(".skill-toggle");

    if (!row || !body || !toggle) return;

    row.addEventListener("click", () => {
      const isOpen = !body.hidden;

      skillItems.forEach((other) => {
        const otherBody = other.querySelector(".skill-body");
        const otherToggle = other.querySelector(".skill-toggle");
        if (!otherBody || !otherToggle) return;

        otherBody.hidden = true;
        setToggleState(otherToggle, false);
      });

      if (!isOpen) {
        body.hidden = false;
        setToggleState(toggle, true);
      }
    });
  });
}
