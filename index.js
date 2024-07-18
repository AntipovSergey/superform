const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        const removableElement = userCard.querySelector(
            `div[data-user = '${userEmail}']`
        )

        removableElement.parentElement.remove()

        if (Object.keys(storage).length <= 1) {
            localStorage.removeItem('users')
        } else {
            delete storage[userEmail]
            localStorage.setItem('users', JSON.stringify(storage))
        }
    })

    changeBtn.addEventListener('click', () => {
        const changableName = document.querySelector('#name')
        const changableSecondName = document.querySelector('#secondName')
        const changablePhone = document.querySelector('#phone')
        const changableEmail = document.querySelector('#email')

        const { name, secondName, phone, email } = storage[userEmail]

        changableName.value = name
        changableSecondName.value = secondName
        changablePhone.value = phone
        changableEmail.value = email
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, phone, email }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${phone}</p>
                <p class="email">${email}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newPhone = document.querySelector('#phone')

    const users = document.querySelector('.users')

    if (
        !newEmail.value ||
        !newName.value ||
        !newSecondName.value ||
        !newPhone.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newPhone)
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        phone: newPhone.value,
        email: newEmail.value,
    }

    /* eslint-disable-next-line */
    for (const email in storage) {
        if (email === newEmail.value) {
            storage[email] = data
            const changableElement = users.querySelector(
                `div[data-user = '${email}']`
            )
            const [changedName, changedSecondName, changedPhone, changedEmail] =
                Array.from(changableElement.firstElementChild.children)
            changedName.innerText = storage[email].name
            changedSecondName.innerText = storage[email].secondName
            changedPhone.innerText = storage[email].phone
            changedEmail.innerText = storage[email].email
            localStorage.setItem('users', JSON.stringify(storage))
            resetInputs(newName, newSecondName, newPhone, newEmail)
            return
        }
    }

    storage[newEmail.value] = data

    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    const userCardValue = createCard(data)
    userCard.innerHTML = userCardValue
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newPhone, newEmail)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
