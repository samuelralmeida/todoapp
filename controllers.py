from flask import Blueprint, render_template, request, redirect, url_for, jsonify, abort
import sys

from extensions import db
from models import Todo, TodoList

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return redirect(url_for('main.get_list_todos', list_id=1))


@main.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    try:
        description = request.get_json()['description']
        list_id = request.get_json()['list_id']
        todo = Todo(description=description)
        active_list = TodoList.query.get(list_id)
        todo.list = active_list
        todo.insert()
        body['description'] = todo.description
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(500)
    return jsonify(body)


@main.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    error = False
    try:
        todo = Todo.query.filter_by(id=todo_id).one_or_none()
        todo.delete()
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(500)
    return jsonify({'success': True})


@main.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
    error = False
    try:
        completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = completed
        todo.update()
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(500)
    return redirect(url_for('index'))


@main.route('/lists/<list_id>')
def get_list_todos(list_id):
    error = False
    try:
        lists = TodoList.query.all()
        active_list = TodoList.query.get(list_id)
        todos = Todo.query.filter_by(list_id=list_id).order_by('id').all()
    except:
        error = True
        print(sys.exc_info())
    if error:
        abort(500)
    return render_template('index.html', lists=lists, active_list=active_list, todos=todos)
