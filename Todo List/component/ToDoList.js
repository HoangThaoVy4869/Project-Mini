import html from "../core.js";
import TodoItem from "./ToDoItem.js"

function ToDoList(){

    return html`
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
            </ul>
        </section>
    `
}

export default ToDoList