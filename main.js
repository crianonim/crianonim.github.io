const INTERESTS_ID = ["languages", "botany", "history", "cooking", "technology"]

window.addEventListener("load", () => {
    // add data-interests-id to each nav button, keep the html clean
    Array.prototype.forEach.call(document.querySelectorAll("#interests nav a"), (el) => {
        el.dataset.interestId = el.textContent.toLowerCase();
    })
    document.querySelector("#interests nav").addEventListener("click", (event) => {
        selectInterestById(event.target.dataset.interestId)
    })
})

function deselectAllInterests() {
    let interestButtons = document.querySelectorAll("#interests nav a");
    Array.prototype.forEach.call(interestButtons, (el) => {
        el.classList.remove("selected")
    })
    
    let interestSections = document.querySelectorAll("#interests article");
    Array.prototype.forEach.call(interestSections, (el) => {
        el.classList.add("hidden");
    })
}

function selectInterestById(id) {
    deselectAllInterests()
    document.querySelector("#" + id).classList.remove("hidden");
    document.querySelector("a[data-interest-id=" + id + "]").classList.add("selected")
}