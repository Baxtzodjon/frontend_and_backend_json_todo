// fetch('http://localhost:9000/users')
//     .then(res => res.json())
//     .then(res => reload(res, cont))

axios.get('http://localhost:9000/users')
    .then(res => reload(res.data, cont))


// node js

// todo list 
let form = document.forms.create
let cont = document.querySelector('.container')
let todos = []

form.onsubmit = (e) => { // отправляет
    e.preventDefault(); // останавливает обновление

    let fm = new FormData(form)

    let todo = {
        id: String(Math.random()),
        title: fm.get('task'),
        isDone: false,
        time: new Date().toLocaleTimeString('uz-UZ', { hour12: false }) // он берет время
    }

    if (todo.title.trim() === "") {
        alert('Error')
        return
    }

    // fetch('http://localhost:9000/users', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(todo)
    // })

    axios.post('http://localhost:9000/users', todo)
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.error(error);
        });


    todos.push(todo)
    reload(todos, cont)
}

reload(todos, cont)

function reload(arr, place) {
    place.innerHTML = ''

    for (let item of arr) {
        // create
        let todo = document.createElement('div')
        let top_div = document.createElement('div')
        let title = document.createElement('span')
        let remove_btn = document.createElement('button')
        let time = document.createElement('span')
        let popup = document.createElement('a')

        // styling
        todo.classList.add('todo')
        title.id = 'for_underlining'
        top_div.classList.add('top')
        title.classList.add('title')
        time.classList.add('timer')
        remove_btn.classList.add('btn')
        popup.classList.add('link_popup')

        title.innerHTML = item.title
        remove_btn.innerHTML = "x"
        time.innerHTML = item.time

        popup.setAttribute('href', '#popup')

        // append
        top_div.append(popup, remove_btn)
        popup.append(title)
        todo.append(top_div, time)
        place.append(todo)

        // functions
        remove_btn.onclick = () => {
            // fetch('http://localhost:9000/users/' + item.id, {
            //     method: "delete"
            // }).then(res => res.json()).then(res => console.log(res))

            axios.delete(`${'http://localhost:9000/users/' + item.id}`)
                .then(res => console.log(res))


            let isSure = confirm('Are you sure ?')

            if (isSure) {
                let idx = arr.indexOf(item)
                todos.splice(idx, 1)
                todo.remove()
            }
        }

        todo.ondblclick = () => {
            let newTitle = prompt('Write new title ' + item.title)
            let newTime = new Date().toLocaleTimeString('uz-UZ', { hour12: false })

            // fetch('http://localhost:9000/users' + "/" + item.id, {
            //     method: "put",
            //     body: JSON.stringify({ title: newTitle, time: newTime }),

            //     headers: { // заголовки нашего запроса
            //         "Content-Type": "application/json"
            //     }
            // })
            // .then(res => console.log(res))


            axios.patch('http://localhost:9000/users' + "/" + item.id, {
                title: newTitle,
                time: newTime
            })
                .then(res => console.log(res))
                .catch(error => console.log(error))
                .finally(() => console.log('something done'))


            if (newTitle.length) {
                item.title = newTitle
                title.innerHTML = newTitle
            }
        }

        let underline = document.querySelectorAll('#for_underlining');

        underline.forEach(function (e) {
            e.addEventListener('click', function () {
                title.classList.toggle('strikethrough');
            })
        })

        let modal = document.querySelector('#popup');
        let span = document.querySelector('.title');
        let input = modal.querySelector('input');

        span.addEventListener('click', function () {
            /* modal.style.display = 'block'; */
            input.value = this.innerHTML;
            input.addEventListener('input', function () {
                span.innerHTML = this.value;
            });
        });

        input.addEventListener('input', function () {
            span.innerHTML = this.value;
        });

        input.addEventListener('change', function () {
            /* modal.style.display = 'none'; */
        });

        if (item.isDone) {
            input.modal = true
        }

        item.onclick = () => {
            if (input.modal) {
                arr.isDone = true
            } else {
                arr.isDone = false
            }
        }
    }
}
