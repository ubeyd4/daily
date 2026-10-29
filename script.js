
// ONE QUESTION A DAY — HOMEPAGE INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {

  // MOBILE MENU

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const opening = mobileMenu.hidden;

      mobileMenu.hidden = !opening;
      menuToggle.setAttribute("aria-expanded", String(opening));
      menuToggle.setAttribute(
        "aria-label",
        opening ? "Close navigation" : "Open navigation"
      );
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.focus();
      }
    });
  }

  // FOUR PUBLIC SAMPLE QUESTIONS

  const questions = [
    "What's a small moment from recently that you wish you could experience again?",
    "What is something you used to worry about that no longer matters to you?",
    "If you could speak to yourself one year ago, what would you want them to know?",
    "What part of your everyday life do you think you'll miss one day?"
  ];

  let currentQuestion = 0;

  const questionText = document.getElementById("question-text");
  const questionCount = document.getElementById("question-count");
  const previousButton = document.getElementById("question-prev");
  const nextButton = document.getElementById("question-next");

  function renderQuestion() {
    if (!questionText || !questionCount) return;

    questionText.textContent = questions[currentQuestion];

    questionCount.textContent =
      `${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentQuestion = (currentQuestion + 1) % questions.length;
      renderQuestion();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      currentQuestion =
        (currentQuestion - 1 + questions.length) % questions.length;
      renderQuestion();
    });
  }

  renderQuestion();

  // COPYRIGHT YEAR

  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
