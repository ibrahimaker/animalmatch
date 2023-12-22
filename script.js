document.addEventListener("DOMContentLoaded", () => {
    runMatchAnimals();
});


var swapAudio;
var selectAudio;
var clearAudio;
window.onload = function() {
    swapAudio = document.getElementById("swapAudio");
    selectAudio = document.getElementById("selectAudio");
    clearAudio = document.getElementById("clearAudio");
};

function SwapAudioPlay(){
    swapAudio.play();
}
function SelectAudioPlay(){
    selectAudio.play();
}
function ClearAudioPlay(){
    clearAudio.play();
}

function runMatchAnimals() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8;
    const squares = [];
    let score = 0;

    const animalTypes = [
        "url(/Assets/Images/cat.png)",
        "url(/Assets/Images/duck.png)",
        "url(/Assets/Images/frog.png)",
        //"url(/Assets/Images/monkey.png)",
        //"url(/Assets/Images/ostrich.png)",
        "url(/Assets/Images/penguin.png)",
        "url(/Assets/Images/raccoon.png)",
        //"url(/Assets/Images/sheep.png)",
        "url(/Assets/Images/tiger.png)",
        //"url(/Assets/Images/zebra.png)",
    ];

    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * animalTypes.length);
            square.style.backgroundImage = animalTypes[randomColor];
            square.style.backgroundSize = "70px 70px";
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
        square.addEventListener("drageleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        // this.style.backgroundImage = ''
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[
            squareIdBeingDragged
        ].style.backgroundImage = colorBeingReplaced;

        // Eğer yer değiştirilen kareler arasında en az üçlü eşleşme yoksa, eski pozisyonlarına geri döndür.
        if (!checkForMatch(squareIdBeingReplaced) && !checkForMatch(squareIdBeingDragged)) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    function dragEnd() {
        
        SelectAudioPlay();
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);
    
        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    function checkForMatch(newSquareId) {
        const color = squares[newSquareId].style.backgroundImage;
    
        // Yatay eşleşme kontrolü
        const horizontalMatches = checkHorizontalMatch(newSquareId, color);
    
        // Dikey eşleşme kontrolü
        const verticalMatches = checkVerticalMatch(newSquareId, color);
        if(horizontalMatches || verticalMatches){
            SwapAudioPlay();
        }
        return horizontalMatches || verticalMatches;
    }
    
    function checkHorizontalMatch(newSquareId, color) {
        const row = Math.floor(newSquareId / width);
        const startIdx = row * width;
        const endIdx = startIdx + width;
    
        let consecutiveCount = 0;
    
        for (let i = startIdx; i < endIdx; i++) {
            if (squares[i].style.backgroundImage === color) {
                consecutiveCount++;
                if (consecutiveCount === 3) {
                    return true; // Yatayda üçlü eşleşme bulundu
                }
            } else {
                consecutiveCount = 0; // Kesinti olduğunda sayacı sıfırla
            }
        }
    
        return false;
    }
    
    function checkVerticalMatch(newSquareId, color) {
        const col = newSquareId % width;
    
        let consecutiveCount = 0;
    
        for (let i = 0; i < width; i++) {
            const idx = i * width + col;
            if (squares[idx].style.backgroundImage === color) {
                consecutiveCount++;
                if (consecutiveCount === 3) {
                    return true; // Dikeyde üçlü eşleşme bulundu
                }
            } else {
                consecutiveCount = 0; // Kesinti olduğunda sayacı sıfırla
            }
        }
    
        return false;
    }
    

    //Dropping squares once some have been cleared
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                ClearAudioPlay();
                squares[i + width].style.backgroundImage =
                    squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundImage === "") {
                    let randomColor = Math.floor(
                        Math.random() * animalTypes.length
                    );
                    squares[i].style.backgroundImage = animalTypes[randomColor];
                }
            }
        }
    }

    ///-> Checking for Matches <-///

    //For Row of Four
    function checkRowForFour() {
        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkRowForFour();

    //For Column of Four
    function checkColumnForFour() {
        for (i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkColumnForFour();

    //For Row of Three
    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6,
                7,
                14,
                15,
                22,
                23,
                30,
                31,
                38,
                39,
                46,
                47,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkRowForThree();

    //For Column of Three
    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
    }
    checkColumnForThree();


    window.setInterval(function () {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}