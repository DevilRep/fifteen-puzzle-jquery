const FIELD_WIDTH = 4
const ANIMATION_DURATION = 1000

function simpleMove (unoccupied, element) {
    const elementOnDom = $('.cell' + element.index)
    elementOnDom.addClass(element.animation)
    const unoccupiedElement = $('.unoccupied')
    unoccupiedElement.addClass(unoccupied.animation)
    setTimeout(() => {
        elementOnDom
            .removeClass([element.animation, 'cell' + element.index])
            .addClass('cell' + unoccupied.index)
            .data('index', unoccupied.index)
        unoccupiedElement
            .removeClass([unoccupied.animation, 'cell' + unoccupied.index])
            .addClass('cell' + element.index)
            .data('index', element.index)
    }, ANIMATION_DURATION)
}

function moveDown (unoccupiedIndex, elementIndex) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutUp'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutDown'
        }
    )
}

function moveUp (unoccupiedIndex, elementIndex) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutDown'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutUp'
        }
    )
}

function moveLeft (unoccupiedIndex, elementIndex) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutRight'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutLeft'
        }
    )
}

function moveRight (unoccupiedIndex, elementIndex) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutLeft'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutRight'
        }
    )
}

function whereCanMove (unoccupiedIndex, elementIndex) {
    return unoccupiedIndex - elementIndex
}

function makeMove (event) {
    const element = $(event.currentTarget)
    if (element.hasClass('unoccupied')) {
        return;
    }
    const elementIndex = element.data('index')
    const unoccupiedIndex = $('.unoccupied').data('index')
    switch (whereCanMove(unoccupiedIndex, elementIndex)) {
        case 1:
            moveRight(unoccupiedIndex, elementIndex)
            break;
        case -1:
            moveLeft(unoccupiedIndex, elementIndex)
            break;
        case FIELD_WIDTH:
            moveDown(unoccupiedIndex, elementIndex)
            break;
        case -1 * FIELD_WIDTH:
            moveUp(unoccupiedIndex, elementIndex)
            break;
    }
    setTimeout(() => {
        if (isGameOver()) {
            gameOver()
        }
    }, 1100)
}

function isGameOver () {
    let isElementOnWrongPlace = false
    $('.cell').each((index, element) => {
        if (isElementOnWrongPlace) {
            return
        }
        element = $(element)
        isElementOnWrongPlace = !element.hasClass('cell' + element.attr('data-index'))
    })
    return !isElementOnWrongPlace
}

function newGame () {
    $('.cell').click(makeMove)
}

function gameOver () {
    alert('Game over!')
    $('.cell').off('click')
}

$('#new-game').click(newGame)
