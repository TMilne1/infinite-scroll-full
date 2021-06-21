let cardSection = document.getElementById('card-section');
let loadingEllipsis = document.getElementById('loading-ellipses');
let page = 1;


function makeDiv(id, imgSrc, imgCaption, title, author, description) {
    return (
        `
        <div class="container d-flex justify-content-center" id=${id}>
            <div class="card shadow p-3 mb-5 bg-white rounded custom-card";>
                <div class="row custom-row no-gutters">
                    <div class="col-sm-6 d-flex align-items-center custom-card-img-container">
                        <img src="${imgSrc}" class="card-img custom-card-img" alt="${imgCaption}">
                    </div>
                    <div class="col-sm-6">
                        <div class="card-body">
                            <b><h4 class="card-title">${title}</h4></b>
                            <p class="card-text">${author}</p>
                            <div class='desciption'>
                                <p class="card-text"><small class="text-muted">${description}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        `
    );
}


function makeCard(obj) {
    let id = obj.id;
    let img = obj.images.orig.url;
    let description = obj.description;
    let title = obj.title.toUpperCase() || "UNTITLED";
    let imgCaption = obj.pin_join.visual_annotation[0];
    let author = `By: ${obj.pinner.full_name || "Anonymous"}`;

    return makeDiv(id, img, imgCaption, title, author, description);
}

//add new cards once at least 98% of the current content has been viewed
function addNewCards() {
    let { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    let scrollDownPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

    if (scrollDownPercentage >= 98) {
        //98% of the content viewed, temporarily stop event listener, so multiple fetchAndUpdate calls are not made
        window.removeEventListener('scroll', addNewCards)
        fetchAndUpdate();
        setTimeout(() => {
            window.addEventListener('scroll', addNewCards)
        }, 550);
    }
}

function updateDomWithData(dataSet) {
    for (let item of dataSet) {
        cardSection.innerHTML += makeCard(item);
    }
}

//API call to retrieve objects from data.json
async function fetchAndUpdate() {
    loadingEllipsis.style.visibility = 'visible'
    //artificial load time simulator
    setTimeout(async () => {
        try {
            await fetch(`http://127.0.0.1:5000/pins/page/${page}`)
                .then(response => {
                    console.log(response.status)
                    if (response.status == 404) {
                        page = 1;
                        addNewCards();
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    if (data) {
                        updateDomWithData(data.pins);
                        page++;
                    } else {
                        return [];
                    }
                })
        } catch (err) {
            console.error(err);
            alert("UNABLE TO RETRIEVE NEW MEDIA");
        }
    }, 500);
}


//set an event listener on the window to track when additional data will be needed based on how far down client has scrolled
window.addEventListener('scroll', addNewCards)

//populate page with the initial set of cards
fetchAndUpdate();
