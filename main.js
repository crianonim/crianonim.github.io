const INTERESTS_ID = ["languages", "botany","cooking", "history",  "technology"]
let interest="botany";
window.addEventListener("load", () => {
    // add data-interests-id to each nav button, keep the html clean
    Array.prototype.forEach.call(document.querySelectorAll("#interests nav a"), (el) => {
        el.dataset.interestId = el.textContent.toLowerCase();
    })
    document.querySelector("#interests nav").addEventListener("click", (event) => {
        selectInterestById(event.target.dataset.interestId)
    })
    document.getElementById(interest).classList.add("selected");
})


function selectNextInterest(){
    selectInterestByStep(1);
}
function selectPreviousInterest(){
    selectInterestByStep(-1);
}

function selectInterestByStep(step){
    let interestCount=INTERESTS_ID.length
    let current=INTERESTS_ID.indexOf(interest);
    console.log("Old id",current);
    current+=step;
    if (current>=interestCount) current-=interestCount;
    if (current<0) current+=interestCount;
    console.log("New id",current);
    selectInterestById(INTERESTS_ID[current])

}

function selectInterestById(id) {
    interest=id;
    
    document.querySelector("#interests nav a.selected").classList.remove("selected");
    document.querySelector("a[data-interest-id=" + id + "]").classList.add("selected");

    let interestSection = document.querySelector("#interests article.selected")
    let selected = document.querySelector("#" + id)
    if (interestSection){
        if (interestSection.classList.contains("fading-out")){
            console.log("Already fading out");
            return;
        }
        interestSection.classList.add("fading-out");
        interestSection.addEventListener("transitionend", () => {
            console.log("Transitioned remove selection",interestSection)
            interestSection.classList.remove("selected");
            interestSection.classList.remove("fading-out");
            if (id!=interest){
                console.log("Changed");
                
            }
            let selected = document.querySelector("#" + interest)
            Array.from(document.querySelectorAll(".fading-in")).forEach(el=>{
                el.classList.remove("fading-in");
            })
            selected.classList.add("fading-in");
            selected.addEventListener("animationend", () => {
                console.log("Anim add selectopm",selected);
                selected.classList.remove("fading-in");
                if (selected.id==interest){
                    selected.classList.add("selected");
                }
            }, { once: true })
        }, { once: true })
    } else {
        console.log("NOTHING IS SELECTEC")
        Array.from(document.querySelectorAll(".fading-in")).forEach(el=>{
            el.classList.remove("fading-in");
        })
        selected.classList.add("fading-in");
        selected.addEventListener("animationend", () => {
            console.log("Anim",selected);
            selected.classList.remove("fading-in");
            if (id==interest){
                selected.classList.add("selected");
            }
        }, { once: true })
    }
    
}