const deleteBtns = document.querySelectorAll('.delete-button');
for (let i = 0; i < deleteBtns.length; i++) {
    const btn = deleteBtns[i];
    btn.onclick = function(e) {
        const todoId = e.target.dataset['id'];
        fetch('/todos/' + todoId, {
            method: 'DELETE'
        })
            .then(function() {
                const item = e.target.parentElement;
                item.remove();
            })
    }
}
const checkboxes = document.querySelectorAll('.check-completed');
for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    checkbox.onchange = function(e) {
        const newCompleted = e.target.checked;
        const todoId = e.target.dataset['id'];
        fetch('/todos/' + todoId + '/set-completed', {
            method: 'POST',
            body: JSON.stringify({
                'completed': newCompleted
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function() {
                document.getElementById('error').className = 'hidden';
            })
            .catch(function() {
                document.getElementById('error').className = '';
            })
    }
}
const descInput = document.getElementById('description');
const activeList = document.getElementById('active_list');
document.getElementById('form').onsubmit = function(e) {
    e.preventDefault();
    const desc = descInput.value;
    const listID = activeList.value;
    descInput.value = '';
    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'description': desc,
            'list_id': listID
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(jsonResponse => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.className = 'check-completed';
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-id', jsonResponse.id);
            li.appendChild(checkbox);

            const text = document.createTextNode(' ' + jsonResponse.description);
            li.appendChild(text);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.setAttribute('data-id', jsonResponse.id);
            deleteBtn.innerHTML = '&cross;';
            li.appendChild(deleteBtn);

            document.getElementById('todos').appendChild(li);
            document.getElementById('error').className = 'hidden';
        })
        .catch(function() {
            console.error('Error occurred');
            document.getElementById('error').className = '';
        });
}