import { initSnapshots } from "./snapshots.js";
import { initTitleAnimations } from "./titles.js";
import { initFitHeroTitle } from "./fit-hero-title.js";
import { initFooterReveal } from "./footer-reveal.js";
import { initCareer } from "./career.js";
import { initSkills } from "./skills.js";

initFitHeroTitle(document.querySelector(".intro__title"));
initFooterReveal();
initSnapshots(document.querySelector("[data-snapshots]"));
initCareer();
initTitleAnimations();
initSkills();
