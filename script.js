const taskRootElm = document.querySelector('#task-item ul');
const taskAdditionButton = document.getElementById('task-addition-btn');
const taskInputTextElm = document.getElementById('input-task');
const taskInputDateElm = document.getElementById('input-date');
const objArr = [];
let seqNum = localStorage.getItem('taskItem') ? (JSON.parse(localStorage.getItem('taskItem'))).length + 1 : 1;

const init = () => {
	displayHtml();
}

taskAdditionButton.addEventListener('click', () => {
	createTaskItem();
});

const createTaskItem = () => {
	const taskTitle	= taskInputTextElm.value;
	const taskDueDate	= taskInputDateElm.value;

	createHtml(taskTitle, taskDueDate);
	const objVal = createObj(seqNum, taskTitle, taskDueDate);
	localStorageSetItem('taskItem', objVal);
	seqNum++;
}

const createHtml = (title, dueDate) => {
	const listElm = document.createElement('li');
	listElm.classList.add('task-item-body');
	listElm.innerHTML = `
		<button class="task-item-mark-completed">タスクを完了にする</button>
		<button class="task-item-info">
			${title}<br>
			<span>
				期限：<time>${dueDate}</time>
			</span>
		</button>
	`
	taskRootElm.appendChild(listElm);
}
const createObj = (seqNum, title, dueDate) => {
	const obj = ({
		"id": seqNum,
		"title": title,
		"due": dueDate
	});
	return obj;
}

const displayHtml = () => {
	const currentData = localStorageGetItem('taskItem');
	const listArr = [];
	for (const datum of currentData) {
		listArr.push(`
			<li class="task-item-body">
				<button class="task-item-mark-completed">タスクを完了にする</button>
				<button class="task-item-info">
					${datum.title}<br>
					<span>
						期限：<time>${datum.due}</time>
					</span>
				</button>
			</li>
		`);
	}
	taskRootElm.innerHTML = listArr.join('');
}

const localStorageSetItem = (key, value) => {
	if(localStorageGetItem(key)) {
		const currentData = localStorageGetItem(key);
		currentData.push(value);
		var newData = currentData;
	} else {
		var newData = createObj(value.id, value.title, value.due);
		objArr.push(newData);
		newData = objArr;
	}
	newData = JSON.stringify(newData);
	localStorage.setItem(key, newData);
}
const localStorageGetItem = (key) => {
	if(localStorage.getItem(key)) {
		var item = JSON.parse(localStorage.getItem(key));
	} else {
		return false;
	}
	return item;
}

init();
