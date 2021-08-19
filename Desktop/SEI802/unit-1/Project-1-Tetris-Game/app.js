document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') //assigning to const grid & finding class names of the .grid
    // Array.from collects the divs in the grid and turns them into an array.
    let grids = Array.from(document.querySelectorAll('.grid div')) //collecting all the divs inside the element w/ class names of .grid
    const width = 10
    let otherRandom = 0
    const showScore = document.querySelector('#thescore')
    const startButton = document.querySelector('#startButton')
    const tetrisMenu = document.querySelector('.transfer')
    const menu = document.querySelector('.menuMain')
    const span = document.getElementsByClassName('closeXButton')[0]

    

    let timerId
    let tetScore = 0

    // Setting a variable for the colors of each TetroPiece in order below
    const tetColors = [
        'pink', // color for the zTetroPiece
        'purple', // color for the tTetroPiece
        'skyblue', // color for the iTetroPiece
        'green', // color for the lTetroPiece
        'yellow' // color for the oTetroPiece
    ]
    
    //The Tetro Pieces
   
    const zTetroPiece = [
        [0, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetroPiece = [ 
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const iTetroPiece = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const lTetroPiece = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const oTetroPiece = [ // oTetropiece stays the same, no rotations
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const theTetroPieces = [zTetroPiece, tTetroPiece, iTetroPiece, lTetroPiece, oTetroPiece]

    let currentPosition = 4
    let currentRotation = 0

    // Here selects a random TetroPiece and first rotation
    let random = Math.floor(Math.random()*theTetroPieces.length)
    let current = theTetroPieces[random][currentRotation]
    
    // Drawing out the TetroPiece
    function drawTet() {
        current.forEach(index => {
            grids[currentPosition + index].classList.add('tetropiece')
            grids[currentPosition + index].style.backgroundColor = tetColors[random]
        })
    }

    // Undrawing the TetroPiece
    function undrawTet(){
        current.forEach(index => {
            grids[currentPosition + index].classList.remove('tetropiece')
            grids[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Moving the TetroPieces around the grid, times and intervals
    timerId = setInterval(goDown, 1000) // Making the TetroPiece move down every second //

    // The controls, assigning the functions to keycodes
    function controls(e) {
        if(e.keyCode === 37) {
            goLeft()
        } else if (e.keyCode === 38) {
            rotateTet()
        } else if (e.keyCode === 39) {
            goRight()
        } else if (e.keyCode ===40) {
            goDown()
        }
    }
    document.addEventListener('keyup', controls)

    // The  goDown function
    function goDown() {
        undrawTet() // undrawing the shape from its
        currentPosition += width // currentPosition and add a whole width from the currentPosition
        drawTet() // draw once again its currentPosition
        freezeTet() // adding the freezeTet to the move down function so that it invokes check every second
    }

    // Here is the freezeTet function
    function freezeTet() {
        if(current.some(index => grids[currentPosition + index + width].classList.contains('occupied'))) { //checking if the next space below is occupied
            console.log('NOTE: Browser thinks the space under this piece is occupied');
            current.forEach(index => grids[currentPosition + index].classList.add('occupied')) 

            // Create a new tetroPiece coming down
            random = otherRandom
            otherRandom = Math.floor(Math.random() * theTetroPieces.length) 
            current = theTetroPieces[random][currentRotation]
            currentPosition = 4
            drawTet() // drawing new random tetroPiece
            showShapeTet()
            addTetScore()
            gameOverTet()
         }
    }

    // Move the tetroPiece to the left, whether it's at the edge or there is a stoppage
    function goLeft(){
        undrawTet()
        const leftSide = current.some(index => (currentPosition + index) % width === 0) //true statement-the tetroPiece is on the leftSide of the grid

        if(!leftSide) currentPosition -=1 //if the tetroPiece isn't on the leftSide 

        if(current.some(index => grids[currentPosition + index].classList.contains('occupied'))) {
            currentPosition +=1 //adding one to the currentPosition so it moves back to original space in the array
        }

        drawTet() //drawing the tetroPiece
    }

    // Move the tetroPiece to the right, whether it's at the edge or there is a stoppage
    function goRight() {
        undrawTet()
        const rightSide = current.some(index => (currentPosition + index) % width === width -1)

        if(!rightSide) currentPosition +=1 //if not at the rightSide, then move each grid of the tetroPiece +1 down the array

        if(current.some(index => grids[currentPosition + index].classList.contains('occupied'))) { //if .some of the grids that make up the tetroPiece are suddenly in a grid that contains the class "occupied" , */
            currentPosition -=1 //it needs to be pushed back a space in the array, which is -=1
        }

        drawTet()
    }

    // Rotating of the tetroPiece using rotateTet function
    function rotateTet() {
        undrawTet()
        currentRotation ++
        if(currentRotation === current.length) { // if the currentRotation reaches 4, reset it back to 0
            currentRotation = 0
        }
        current = theTetroPieces[random][currentRotation]
        drawTet()
    }

    // Show the Next Up tetroPiece in the smallGrid show box
    const showGrids = document.querySelectorAll('.smallGrid div') //using querySelectorAll-want all the divs inside the div with the class .smallGrid div
    const showWidth = 4 //how big the smallGrid is 
    const showIndex = 0 //setting index at 0
    

    // The tetroPieces at first rotation - showing the tetroPieces
    const nextUpTetroPieces = [
        [0, showWidth, showWidth+1, showWidth*2+1], // the zTetroPiece
        [1, showWidth, showWidth+1, showWidth+2], // the tTetroPiece
        [1, showWidth+1, showWidth*2+1, showWidth*3+1], // the iTetroPiece
        [1, showWidth+1, showWidth*2+1, 2], // the lTetroPiece
        [0, 1, showWidth, showWidth+1] // the oTetroPiece
    ]

    // Show the shape in the smallGrid box
    function showShapeTet() {
        // Remove any of a tetroPiece from the whole grid
        showGrids.forEach(grid => {
            grid.classList.remove('tetropiece')
            grid.style.backgroundColor = ''
        })
        nextUpTetroPieces[otherRandom].forEach( index => {
            showGrids[showIndex + index].classList.add('tetropiece')
            showGrids[showIndex + index].style.backgroundColor = tetColors[otherRandom]
        })
    }

    // The functionality to the startButton
    startButton.addEventListener('click', () => { //attaching the startButton to the addEventListener
        if (timerId) {
            clearInterval(timerId)
            timerId =  null //timerId set to null
        } else { // or else when start button is pressed 
            drawTet() //then the tetroPiece is drawn
            timerId = setInterval(goDown, 1000) //invoking the goDown every 1000 milisecs
            otherRandom = Math.floor(Math.random()*theTetroPieces.length) //choose the next random shape to show in the smallGrid
            showShapeTet() //invoking the showShapeTet function here
            
        }
    })


    // Add the score
    function addTetScore() {
        for (let i = 0; i < 199; i +=width) { //using for loop method 
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] //defining the row

            if(row.every(index => grids[index].classList.contains('occupied'))) { // if every grids in the defined row contains a div with the class of occupied and is true
                tetScore +=10 // then add 10 points to the score
                showScore.innerHTML = tetScore //shows the score(tetScore)
                row.forEach(index => { //forEach item of the row, removing the class 'occupied'
                    grids[index].classList.remove('occupied')
                    grids[index].classList.remove('tetropiece')
                    grids[index].style.backgroundColor = ''
                })
                const removeGrids = grids.splice(i, width) //removing the row using the splice method
                grids = removeGrids.concat(grids)
                grids.forEach(cell => grid.appendChild(cell)) //append new grids for the grid
            }
        }
    }

    // The Game Over function
    function gameOverTet() { 
        if(current.some(index => grids[currentPosition + index].classList.contains('occupied'))) { //if the current tetropiece position contains the class of 'occupied' then it's Game Over
            showScore.innerHTML = 'Game Over' //then it will be shown Game over in the Your score section
            clearInterval(timerId) //then timerId is cleared, when the goDown function comes to a stop
        }
    }

    // Styles to the eventListeners menu display
    tetrisMenu.addEventListener('click', () => {
        menu.style.display = 'flex'
      })
      span.addEventListener('click', () => {
        menu.style.display = 'none'
      })
    
    })




