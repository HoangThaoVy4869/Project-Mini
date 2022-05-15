import html from "../core.js";

import Header from "../component/Header.js"
import ToDoList from "../component/ToDoList.js"

function App() {

    return html`
        <section class="todoapp">
            ${Header()}
            ${ToDoList()}
        </section>
    `
}

export default App()