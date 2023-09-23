// Price Range

const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    progress = document.querySelector(".slider .progress");

let priceGap = 10;

priceInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(priceInput[0].value),
            maxVal = parseInt(priceInput[1].value);

        if ((maxVal - minVal >= priceGap) && maxVal <= 200) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = minVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            } else {
                rangeInput[1].value = maxVal;
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap;
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }

    })
})

// Season Button

const seasonButton = document.querySelectorAll('.season-button');

seasonButton.forEach(seasonButton => {
    seasonButton.addEventListener('click', function () {
        if (seasonButton.classList.contains('clicked')) {
            seasonButton.classList.remove('clicked');
        } else {
            seasonButton.classList.add('clicked');
        }
    });
});

//   Sticky Nav

const sectionHeroEl = document.querySelector(".navigation")


const obs = new IntersectionObserver(
    function (entries) {
        const ent = entries[0]
        console.log(ent);

        if (ent.isIntersecting === false) {
            document.body.classList.add("sticky");
        }

        if (ent.isIntersecting === true) {
            document.body.classList.remove("sticky");
        }
    },
    {
        root: null,
        threshold: 0,
        rootMargin: "-140px"
    }
);
obs.observe(sectionHeroEl)



