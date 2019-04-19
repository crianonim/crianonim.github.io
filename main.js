const INTERESTS_ID = ["languages", "botany", "cooking", "history", "technology"];
const SECTIONS_ID = ["who", "why", "how"];
const INTEREST_TRANSITION_TIME = 0.2;
const INTEREST_VIEW_TIME = 13;
let interest = "languages";
let section = 0;
let timeOutHandle;
let paused = false;
let colourful= false;
let sectionsSizes = [];

window.addEventListener("load", () => {

    // all css variables
    document.documentElement.style.setProperty('--transition-time', INTEREST_TRANSITION_TIME + "s");
    document.documentElement.style.setProperty('--transition-time-double', INTEREST_TRANSITION_TIME * 2 + "s");
    document.documentElement.style.setProperty('--interest-view-time', INTEREST_VIEW_TIME + "s");
    

    

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

    // when you have too much time before deadline you add ESSENTIAL features;)
    document.getElementById("face").addEventListener("click",toggleColourful);


    // kick off functionality
    selectInterestById(interest)
    startCountdownToChange();
    calculateSectionSizes();
})
// COLOURIZE !
function makeWebsiteColourful(){
    document.documentElement.style.setProperty('--colour-who', '#3D9970');
    document.documentElement.style.setProperty('--colour-why', '#FF4136');
    document.documentElement.style.setProperty('--colour-how', '#0074D9');
}
function makeWebsiteGrey(){
    document.documentElement.style.setProperty('--colour-who', '');
    document.documentElement.style.setProperty('--colour-why', '');
    document.documentElement.style.setProperty('--colour-how', '');
}
function toggleColourful(){
    if (colourful){
        makeWebsiteGrey();
        colourful=false;
    } else {
        makeWebsiteColourful();
        colourful=true;
    }
}

// - SECTION CHANGE - 

// establishes where you are based on scroll amount
function getSectionIndexFromScroll(scroll, sizes = sectionsSizes) {
    let currentValue = 0;
    cummulativeSizes = sizes.map(el => currentValue += el);
    let index = cummulativeSizes.findIndex(point => scroll < point);
    return index;
}

function gotoNextSection() {
    let destinationSection = Math.min(section + 1, SECTIONS_ID.length - 1);
    let element = document.getElementById(SECTIONS_ID[destinationSection])
    element.scrollIntoView({ behavior: "smooth", block: "start" });
}

// should be called whenever the size of viewport is changed;
function calculateSectionSizes() {
    sectionsSizes = SECTIONS_ID.map(id => document.getElementById(id).clientHeight);
}

// updates classes in header based on section we are in
function changeSectionInHeaderNav(newSection) {
    let headerElement = document.querySelector('header');
    let sectionName = SECTIONS_ID[newSection]
    document.getElementById("nav-" + SECTIONS_ID[section]).classList.remove("selected")
    document.getElementById("nav-" + sectionName).classList.add("selected")
    headerElement.classList.remove("who", "why", "how");
    headerElement.classList.add(sectionName);
    section = newSection;
}

// - CAROUSEL -

function startCountdownToChange() {
    clearTimeout(timeOutHandle)
    timeOutHandle = setTimeout(() => {
        if (paused) {
            return;
        }
        selectNextInterest();
        startCountdownToChange();
    }, INTEREST_VIEW_TIME * 1000);
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

function selectInterestById(id) {
    interest = id;
    clearTimeout(timeOutHandle)
    
    // interest nav bar
    let navSelected = document.querySelector("#interests nav a.selected");
    if (navSelected) {
        navSelected.classList.remove("selected");
    }
    document.querySelector("a[data-interest-id=" + id + "]").classList.add("selected");

    // carousel itself
    let currentlySelected = document.querySelector("#interests article.selected")
    let newlySelected = document.querySelector("#" + id)
    if (currentlySelected) {
        if (currentlySelected.classList.contains("fading-out")) {
            return;
        }
        currentlySelected.classList.add("fading-out");
        currentlySelected.addEventListener("transitionend", () => {
            currentlySelected.classList.remove("selected");
            currentlySelected.classList.remove("fading-out");
            let newlySelected = document.querySelector("#" + interest)
            fadeIn(newlySelected)
        }, { once: true })
    } else {
        fadeIn(newlySelected)
    }
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
            // move the carousel buttons to selected
            let nav = document.querySelector('.picture .navigation');
            nav.parentElement.removeChild(nav);
            selected.querySelector('.picture').appendChild(nav)
        }
    }, { once: true })
}