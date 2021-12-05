let index = 0;

window.onload = function() {
    nextImage();
};

function upVote() {
    fetch("http://127.0.0.1:8001/posts/" + index + "/up", { method: "GET" });
    index++;
    nextImage();
}

function downVote() {
    fetch("http://127.0.0.1:8001/posts/" + index + "/down", { method: "GET" });
    index++;
    nextImage();
}

async function nextImage() {
    const res = await fetch("http://127.0.0.1:8001/posts/" + index, { method: "GET" });
    const data = await res.json();
    document.getElementById("dog").src = data.url;
}