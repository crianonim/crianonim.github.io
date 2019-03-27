const INTERESTS_ID = ["languages", "botany","cooking", "history",  "technology"]
let interest="botany";
let timeOut;
window.addEventListener("load", () => {
    // add data-interests-id to each nav button, keep the html clean
    Array.prototype.forEach.call(document.querySelectorAll("#interests nav a"), (el) => {
        el.dataset.interestId = el.textContent.toLowerCase();
    })
    document.querySelector("#interests nav").addEventListener("click", (event) => {
        if (event.target.tagName=="A") selectInterestById(event.target.dataset.interestId)
    })
    document.getElementById(interest).classList.add("selected");
    startCoundownToChange();
})

function startCoundownToChange(){
    clearTimeout(timeOut)
    timeOut=setTimeout(()=>{
        console.log("Happened!")
        selectNextInterest();
        startCoundownToChange();    
    },3000);
}

function selectNextInterest(){
    selectInterestByStep(1);
}
function selectPreviousInterest(){
    selectInterestByStep(-1);
}

function selectInterestByStep(step){
    let interestCount=INTERESTS_ID.length
    let current=INTERESTS_ID.indexOf(interest);
    current+=step;
    if (current>=interestCount) current-=interestCount;
    if (current<0) current+=interestCount;
    selectInterestById(INTERESTS_ID[current])

}

function fadeIn(selected){
    Array.from(document.querySelectorAll(".fading-in")).forEach(el=>{
        el.classList.remove("fading-in");
    })
    selected.classList.add("fading-in");
    selected.addEventListener("animationend", () => {
        selected.classList.remove("fading-in");
        if (selected.id==interest){
            selected.classList.add("selected");
            startCoundownToChange();
        }
    }, { once: true })

}
function selectInterestById(id) {
    interest=id;
    clearTimeout(timeOut)
    document.querySelector("#interests nav a.selected").classList.remove("selected");
    document.querySelector("a[data-interest-id=" + id + "]").classList.add("selected");

    let interestSection = document.querySelector("#interests article.selected")
    let selected = document.querySelector("#" + id)
    if (interestSection){
        if (interestSection.classList.contains("fading-out")){
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