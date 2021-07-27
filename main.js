const FIELD_WIDTH = 4
const FIELD_SIZE = 16
const ANIMATION_DURATION_DEFAULT = 1000 * 0.5
const ANIMATION_DURATION_FAST = 1000 * 0.1
const MOVE_ALL_RANDOM_ROUNDS = 50

async function simpleMove(unoccupied, element, speed) {
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
        }, speed)
    })
}

async function moveDown(unoccupiedIndex, elementIndex, speed) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutUp'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutDown'
        },
        speed
    )
}

async function moveUp(unoccupiedIndex, elementIndex, speed) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutDown'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutUp'
        },
        speed
    )
}

async function moveLeft(unoccupiedIndex, elementIndex, speed) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutRight'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutLeft'
        },
        speed
    )
}

async function moveRight(unoccupiedIndex, elementIndex, speed) {
    return simpleMove(
        {
            index: unoccupiedIndex,
            animation: 'animate__slideOutLeft'
        },
        {
            index: elementIndex,
            animation: 'animate__slideOutRight'
        },
        speed
    )
}

function whereCanMove(unoccupiedIndex, elementIndex) {
    return unoccupiedIndex - elementIndex
}

async function makeMove(selector, speed) {
    const element = $(selector)
    if (element.hasClass('unoccupied')) {
        return;
    }
    const elementIndex = element.data('index')
    const unoccupiedIndex = $('.unoccupied').data('index')
    switch (whereCanMove(unoccupiedIndex, elementIndex)) {
        case 1:
            await moveRight(unoccupiedIndex, elementIndex, speed)
            break;
        case -1:
            await moveLeft(unoccupiedIndex, elementIndex, speed)
            break;
        case FIELD_WIDTH:
            await moveDown(unoccupiedIndex, elementIndex, speed)
            break;
        case -1 * FIELD_WIDTH:
            await moveUp(unoccupiedIndex, elementIndex, speed)
            break;
    }
    if (!isGameOver()) {
        return
    }
    win()
}

function isGameOver() {
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

async function newGame(button) {
    disableNewGame(button)
    await moveAllPuzzlesRandom()
    $('.cell').on('click', async event => await makeMove(event.currentTarget, ANIMATION_DURATION_DEFAULT))
    enableNewGame(button)
}

function win() {
    alert('Congratulations! You won!')
    $('.cell').off('click')
}

function getRandomFromArray(array, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return array[Math.floor(Math.random() * (max - min + 1)) + min - 1];
}

function puzzlesNear(index, previousChosen) {
    const result = []
    let amplitudes = [FIELD_WIDTH, -1 * FIELD_WIDTH]
    amplitudes.forEach(amplitude => {
        let elementIndex = index - amplitude
        if (
            elementIndex > 0 &&
            elementIndex <= FIELD_SIZE &&
            elementIndex !== previousChosen
        ) {
            result.push(elementIndex)
        }
    })
    amplitudes = [-1, 1]
    amplitudes.forEach(amplitude => {
        let elementIndex = index - amplitude
        if (
            Math.ceil(elementIndex / FIELD_WIDTH) === Math.ceil(index / FIELD_WIDTH) &&
            elementIndex !== previousChosen
        ) {
            result.push(elementIndex)
        }
    })
    return result
}

async function moveAllPuzzlesRandom() {
    let index = MOVE_ALL_RANDOM_ROUNDS;
    const unoccupied = $('.unoccupied')
    let unoccupiedIndex = unoccupied.data('index')
    let previousChosen = 0
    while(index--) {
        const puzzles = puzzlesNear(unoccupiedIndex, previousChosen)
        const chosenElement = getRandomFromArray(puzzles, 1, puzzles.length)
        await makeMove('.cell' + chosenElement, ANIMATION_DURATION_FAST)
        previousChosen = unoccupiedIndex
        unoccupiedIndex = unoccupied.data('index')
    }
}

function disableNewGame(button) {
    button.off('click')
}

function enableNewGame(button) {
    button.on('click', event => newGame(button))
}

enableNewGame($('.new-game'))
