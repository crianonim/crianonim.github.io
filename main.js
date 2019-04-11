const INTERESTS_ID = ["languages", "botany", "cooking", "history", "technology"];
const SECTIONS_ID = ["who", "why", "how"];
let interest = "languages";
let section = 0;
let timeOut;
let paused = false;

window.addEventListener("load", () => {
    // add data-interests-id to each nav button, keep the html clean
    Array.prototype.forEach.call(document.querySelectorAll("#interests nav a"), (el) => {
        el.dataset.interestId = el.textContent.toLowerCase();
    })

    // Set the header nav button selection based on hash or default to 0
    if (location.hash) {
        let hashSpecified = location.hash.substring(1);
        changeSectionInHeaderNav(SECTIONS_ID.indexOf(hashSpecified))
    } else {
        changeSectionInHeaderNav(0)
    }

    document.querySelector("#interests nav").addEventListener("click", (event) => {
        if (event.target.tagName == "A") selectInterestById(event.target.dataset.interestId)
    })

    selectInterestById(interest)
    // document.getElementById(interest).classList.add("selected");


    window.addEventListener("keydown", (event) => {
        if (event.keyCode == 37) {
            selectPreviousInterest();
        }
        if (event.keyCode == 39) {
            selectNextInterest();
        }
    })

    document.getElementById("pause-button").addEventListener("click", (event) => {
        event.target.innerHTML = paused ? '&#9208' : '&#9654'
        if (paused) resumeCountDown();
        else pauseCountDown();
    })
    document.getElementById("back-button").addEventListener("click", () => {
        selectPreviousInterest();

    })
    document.getElementById("forward-button").addEventListener("click", () => {
        selectNextInterest();
    })
    window.addEventListener("scroll", (event) => {
        let height = window.innerHeight;
        let scrolled = window.scrollY;
        let newSection = (scrolled / height) >> 0;
        if (newSection != section) {
            changeSectionInHeaderNav(newSection);
        }
    })
    startCountdownToChange();
})
function changeSectionInHeaderNav(newSection) {
    let headerElement = document.querySelector('header');
    let sectionName = SECTIONS_ID[newSection]
    document.getElementById("nav-" + SECTIONS_ID[section]).classList.remove("selected")
    // console.log("Change to",SECTIONS_ID[newSection]);
    document.getElementById("nav-" + sectionName).classList.add("selected")
    headerElement.classList.remove("who", "why", "how");
    headerElement.classList.add(sectionName);

    section = newSection;
}
function startCountdownToChange() {
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
        // console.log("Happened!")
        if (paused) {
            // console.log("Paused");
            return;
        }
        selectNextInterest();
        startCountdownToChange();
    }, 3000);
}
function pauseCountDown() {
    clearTimeout(timeOut);
    paused = true;
}
function resumeCountDown() {
    paused = false;
    //maybe move to next already?
    startCountdownToChange();
}
function selectNextInterest() {
    selectInterestByStep(1);
}
function selectPreviousInterest() {
    selectInterestByStep(-1);
}

function selectInterestByStep(step) {
    let interestCount = INTERESTS_ID.length
    let current = INTERESTS_ID.indexOf(interest);
    current += step;
    if (current >= interestCount) current -= interestCount;
    if (current < 0) current += interestCount;
    selectInterestById(INTERESTS_ID[current])

}

function fadeIn(selected) {
    Array.from(document.querySelectorAll(".fading-in")).forEach(el => {
        el.classList.remove("fading-in");
    })
    selected.classList.add("fading-in");
    selected.addEventListener("animationend", () => {
        selected.classList.remove("fading-in");
        if (selected.id == interest) {
            selected.classList.add("selected");
            startCountdownToChange();

            let nav = document.querySelector('.picture .navigation');
            nav.parentElement.removeChild(nav);
            selected.querySelector('.picture').appendChild(nav)
        }
    }, { once: true })

}
function selectInterestById(id) {
    interest = id;
    clearTimeout(timeOut)
    let navSelected=document.querySelector("#interests nav a.selected");
    if (navSelected) {
        navSelected.classList.remove("selected");
    }
    document.querySelector("a[data-interest-id=" + id + "]").classList.add("selected");

    let interestSection = document.querySelector("#interests article.selected")
    let selected = document.querySelector("#" + id)
    if (interestSection) {
        if (interestSection.classList.contains("fading-out")) {
            return;
        }
        interestSection.classList.add("fading-out");
        interestSection.addEventListener("transitionend", () => {
            interestSection.classList.remove("selected");
            interestSection.classList.remove("fading-out");
            let selected = document.querySelector("#" + interest)
            fadeIn(selected)

        }, { once: true })
    } else {
        fadeIn(selected)
    }

}