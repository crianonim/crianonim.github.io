const INTERESTS_ID = ["languages", "botany", "cooking", "history", "technology"];
const SECTIONS_ID = ["who", "why", "how"];
const transitionTime = 0.7;
const interestViewTime = 5;
let interest = "languages";
let section = 0;
let timeOutHandle;
let paused = false;
let sectionsSizes = [];

window.addEventListener("load", () => {

    // all css variables
    document.body.style.setProperty('--transition-time', transitionTime + "s");
    document.body.style.setProperty('--transition-time-double', transitionTime * 2 + "s");
    document.body.style.setProperty('--interest-view-time', interestViewTime + "s");


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

    // interests nav button to change interest
    document.querySelector("#interests nav").addEventListener("click", (event) => {
        if (event.target.tagName == "A") selectInterestById(event.target.dataset.interestId)
    })


    // all keyboard bindings
    window.addEventListener("keydown", (event) => {
        if (event.keyCode == 37) {
            selectPreviousInterest();
        }
        if (event.keyCode == 39) {
            selectNextInterest();
        }
        if (event.keyCode == 32) {
            gotoNextSection();
            event.preventDefault();
        }
    })

    // carousel buttons
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

    // control section based on scroll
    window.addEventListener("scroll", (event) => {
        let height = window.innerHeight;
        let scrolled = window.scrollY;
        let newSection = getSectionIndexFromScroll(scrolled);
        if (newSection != section) {
            changeSectionInHeaderNav(newSection);
        }
    })

    window.addEventListener("resize", (event) => {
        calculateSectionSizes();
    })

    // kick off functionality
    selectInterestById(interest)
    startCountdownToChange();
    calculateSectionSizes();
})

function gotoNextSection() {
    let destinationSection = Math.min(section + 1, SECTIONS_ID.length - 1);
    let element = document.getElementById(SECTIONS_ID[destinationSection])
    element.scrollIntoView({ behavior: "smooth", block: "start" });
}

// should be called whenever the size of viewport is changed;
function calculateSectionSizes() {
    sectionsSizes = SECTIONS_ID.map(id => document.getElementById(id).clientHeight);
}
function getSectionIndexFromScroll(scroll, sizes = sectionsSizes) {
    let currentValue = 0;
    cummulativeSizes = sizes.map(el => currentValue += el);
    let index = cummulativeSizes.findIndex(point => scroll < point);
    return index;

}
function changeSectionInHeaderNav(newSection) {
    let headerElement = document.querySelector('header');
    let sectionName = SECTIONS_ID[newSection]
    document.getElementById("nav-" + SECTIONS_ID[section]).classList.remove("selected")
    document.getElementById("nav-" + sectionName).classList.add("selected")
    headerElement.classList.remove("who", "why", "how");
    headerElement.classList.add(sectionName);
    section = newSection;
}

function startCountdownToChange() {
    clearTimeout(timeOutHandle)
    timeOutHandle = setTimeout(() => {
        if (paused) {
            return;
        }
        selectNextInterest();
        startCountdownToChange();
    }, interestViewTime * 1000);
}
function pauseCountDown() {
    clearTimeout(timeOutHandle);
    document.getElementById("interests").classList.add("paused");
    paused = true;
}
function resumeCountDown() {
    paused = false;
    document.getElementById("interests").classList.remove("paused");
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
    clearTimeout(timeOutHandle)
    let navSelected = document.querySelector("#interests nav a.selected");
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