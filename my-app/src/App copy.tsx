import React, { useState } from 'react';
import './App.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { filteredTodoListState, todoListFilterState, todoListState, todoListStatesState, TodoListType } from './store/store';

const TodoList = () => {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />

      {todoList.map((todoItem: TodoListType) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}

      
    </>
  );
}

const TodoItemCreator = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const setTodoList = useSetRecoilState<TodoListType[]>(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList: TodoListType[]) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue('');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

const TodoItem = ({ item }: { item: TodoListType }) => {
  const [todoList, setTodoList] = useRecoilState<TodoListType[]>(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: e.target.value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

const TodoListFilters = () => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show UnCompleted">Uncompleted</option>
      </select>
    </>
  );
}

const TodoListStats = () => {
  const todoListStats = useRecoilValue(todoListStatesState);

  return (
    <>
      <div>
        ??? ??????: {todoListStats.totalNum}
        <br/>
        ?????? ??????: {todoListStats.completedTodoNum}
        <br/>
        ?????????????????? ??????: {todoListStats.unCompletedTodoNum}
        <br/>
        ??????: {todoListStats.completedTodoPercentage}
        <br/>
      </div>
    </>
  )
}

function replaceItemAtIndex(arr: TodoListType[], index: number, newValue: TodoListType) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr: TodoListType[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

// ????????? Id ????????? ?????? ????????????
let id = 0;
function getId() {
  return id++;
}

export default TodoList;
