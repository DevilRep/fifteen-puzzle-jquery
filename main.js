const FIELD_WIDTH = 4
const ANIMATION_DURATION = 1000

async function simpleMove (unoccupied, element) {
    return new Promise((resolve, reject) => {
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
            resolve()
        }, ANIMATION_DURATION)
    })
}

async function moveDown (unoccupiedIndex, elementIndex) {
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

async function moveUp (unoccupiedIndex, elementIndex) {
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

async function moveLeft (unoccupiedIndex, elementIndex) {
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

async function moveRight (unoccupiedIndex, elementIndex) {
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

async function makeMove (event) {
    const element = $(event.currentTarget)
    if (element.hasClass('unoccupied')) {
        return;
    }
    const elementIndex = element.data('index')
    const unoccupiedIndex = $('.unoccupied').data('index')
    switch (whereCanMove(unoccupiedIndex, elementIndex)) {
        case 1:
            await moveRight(unoccupiedIndex, elementIndex)
            break;
        case -1:
            await moveLeft(unoccupiedIndex, elementIndex)
            break;
        case FIELD_WIDTH:
            await moveDown(unoccupiedIndex, elementIndex)
            break;
        case -1 * FIELD_WIDTH:
            await moveUp(unoccupiedIndex, elementIndex)
            break;
    }
    if (isGameOver()) {
        gameOver()
    }
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
