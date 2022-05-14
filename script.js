const taskRootElm = document.getElementById('task-item');
const taskRootCompletedListElm = document.querySelector('.list-completed');
const rightContainerElm = document.getElementById('right-container');
const taskAdditionButton = document.getElementById('task-addition-btn');
const taskInputTextElm = document.getElementById('input-task');
const taskInputDateElm = document.getElementById('input-date');
const btnDelete = document.getElementById('btn-delete');
const taskDetailContainerElm = document.querySelector('.task-detail');
const taskDetailDuedateElm = document.querySelector('.task-detail-duedate');
const taskDetailTitleElm = document.querySelector('.task-detail-title');
const flagCompleted = false;
const objArr = [];
let seqNum = localStorage.getItem('taskItem') ? (JSON.parse(localStorage.getItem('taskItem'))).length + 1 : 1;

taskRootElm.addEventListener('click', (e) => {
	const parentElm = e.target.closest('.task-item-body')
	const taskId = getTaskIdInHtml(parentElm);
	const taskArr = getTaskInData(taskId);

	// タスクを完了にする
	if (e.target.classList.contains('task-item-mark-completed') === true) {
		toggleComplete(parentElm, taskId, taskArr[0]);
		location.reload();

		// parentElm.classList.add('completed');
		// taskArr[0].completed = true;

		// // タスクを入れ替え
		// localStorageEditItem('taskItem', taskId, taskArr[0]);

		// // アイコンを完了マークに変更する
		// const childElm = e.target.children[0];
		// childElm.classList.remove('bi-circle');
		// childElm.classList.add('bi-check-circle-fill');
		// localStorageSortItem();
	}

	const targetTaskItemInfo = e.target.closest('.task-item-info');
	if(targetTaskItemInfo) {
		rightContainerElm.classList.remove('d-none');
		taskDetailTitleElm.focus();
		const taskValElm = targetTaskItemInfo.querySelector('.task-title');
		const taskDuedateElm = targetTaskItemInfo.querySelector('.task-duedate');
		taskDetailTitleElm.value = taskValElm.textContent;
		taskDetailDuedateElm.textContent = taskDuedateElm.textContent;
		taskDetailContainerElm.dataset.taskDetailId = taskId;
	}
});

/**
 * 完了・未完了を切り替えます。
 */
function toggleComplete(liElm, taskId, taskObj) {
	liElm.classList.toggle('completed');
	taskObj.completed = !taskObj.completed;

	const elmIconCompleted = liElm.querySelector('.circle');
	if(elmIconCompleted.classList.contains('bi-circle') === true) {
		elmIconCompleted.classList.remove('bi-circle');
		elmIconCompleted.classList.add('bi-check-circle-fill');
	} else {
		elmIconCompleted.classList.remove('bi-check-circle-fill');
		elmIconCompleted.classList.add('bi-circle');
	}
	
	localStorageEditItem('taskItem', taskId, taskObj);
}

taskDetailTitleElm.addEventListener('keyup', (keyEvent) => {
	// console.log(keyEvent);
	const key = keyEvent.key;
	const taskDetailId = (keyEvent.target.closest('.task-detail')).dataset.taskDetailId;
	if(key === 'Enter') {
		// タスク編集セクションから取ったIDと、タスク一覧のIDとで一致してるものを探す
		const taskIdArr = [...document.querySelectorAll('[data-id]')];
		const newData = taskIdArr.filter((g) => {
			return taskDetailId === g.dataset.id;
		});
		const taskValElm = newData[0].querySelector('.task-title');
		// console.log(taskDetailId)
		const taskArr = getTaskInData(taskDetailId);
		taskValElm.textContent = taskDetailTitleElm.value;
		taskArr[0].title = taskDetailTitleElm.value;
		// console.log(taskArr);
		localStorageEditItem('taskItem', taskDetailId, taskArr[0]);
		location.reload();
	}
});

const toggleBtnElm = document.querySelector('.task-detail-toggle');
toggleBtnElm.addEventListener('click', () => {
	rightContainerElm.classList.add('d-none');
});

const init = () => {
	displayHtml();
}

taskAdditionButton.addEventListener('click', () => {
	createTaskItem();
});

btnDelete.addEventListener('click', () => {
	deleteAllItems();
});

/**
 * data属性に設定されたIDを返します。
 * @param {HTMLElement} elm data属性にidが設定されている要素
 * @returns {Number} タスクのID
 */
function getTaskIdInHtml(elm) {
	const dataId = Number(elm.dataset.id);
	return dataId;
}

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
	listElm.classList.add('list-group-item');
	listElm.classList.add('list-group-item-action');
	listElm.dataset.id = seqNum;
	listElm.innerHTML = `
		<div class="btn-group">
			<button class="btn task-item-mark-completed" aria-label="タスクを完了にする">
				<i class="bi bi-circle circle"></i>		
			</button>
			<button class="btn task-item-info">
				<span class="task-title">${title}</span><br>
				<span class="${dueDate ? '' : 'd-none'}">
					期限：<time class="task-duedate">${dueDate}</time>
				</span>
			</button>
		</div>
	`
	taskRootElm.appendChild(listElm);
}
const createObj = (seqNum, title, dueDate) => {
	const obj = ({
		"id": seqNum,
		"title": title,
		"due": dueDate,
		"completed": false
	});
	return obj;
}

const displayHtml = () => {
	const currentData = localStorageGetItem('taskItem');
	const listArr = [];
	const listCompletedArr = [];
	for (const datum of currentData) {
		if(datum.completed) {
			listCompletedArr.push(`
				<li class="completed task-item-body list-group-item list-group-item-action" data-id="${datum.id}">
					<div class="btn-group">
						<button class="btn task-item-mark-completed" aria-label="タスクを完了にする">
							<i class="bi circle bi-check-circle-fill"></i>
						</button>
						<button class="btn task-item-info">
							<span class="task-title">${datum.title}</span><br>
							<span class="${datum.due ? '' : 'd-none'}">
								期限：<time class="task-duedate">${datum.due}</time>
							</span>
						</button>
					</div>
				</li>
			`);
		} else {
			listArr.push(`
				<li class="task-item-body list-group-item list-group-item-action" data-id="${datum.id}">
					<div class="btn-group">
						<button class="btn task-item-mark-completed" aria-label="タスクを完了にする">
							<i class="bi circle bi-circle"></i>
						</button>
						<button class="btn task-item-info">
							<span class="task-title">${datum.title}</span><br>
							<span class="${datum.due ? '' : 'd-none'}">
								期限：<time class="task-duedate">${datum.due}</time>
							</span>
						</button>
					</div>
				</li>
			`);
		}
	}
	taskRootElm.querySelector('ul:not(.list-completed)').innerHTML = listArr.join('');
	// taskRootElm.innerHTML = listArr.join('');
	taskRootCompletedListElm.innerHTML = listCompletedArr.join('');
}

/**
 * IDでソートしてlocalStorageを入れ替える
 * @returns {void} 返り値なし
 */
function localStorageSortItem() {
	const currentData = localStorageGetItem('taskItem');
	const sortedArr = currentData.sort((a,b) => {
		console.log(a)
		console.log(b)
		return a.id - b.id
	});

	// ソートした内容でlocalStorageを全入れ替え
	localStorage.removeItem('taskItem');
	for(const datum of sortedArr) {
		localStorageSetItem('taskItem', datum);
	}
}

/**
 * 指定IDをのぞいた配列を返します。
 * @param {number} id タスクID
 * @returns {Array} タスク除去後の配列
 */
function getRemovedData(id) {
	const currentDataArr = localStorageGetItem('taskItem');
	const newData = currentDataArr.filter((e) => {
		return id !== e.id;
	});

	return newData;
}

/**
 * 指定IDに合致する配列を返します。
 * @param {number} id タスクID
 * @returns {Array} 指定タスクIDに合致した配列
 */
function getTaskInData(id) {
	id = Number(id);
	const currentDataArr = localStorageGetItem('taskItem');
	const filteredData = currentDataArr.filter((e) => {
		return id === e.id;
	});
	return filteredData;
}

/**
 * ローカルストレージにタスク情報を追加します。
 * @param {string} key タスクID
 * @param {object} value タスク情報
 * @returns {void} 返り値なし
 */
function localStorageSetItem(key, value) {
	if (localStorageGetItem(key)) {
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

/**
 * 指定キーに紐づくバリュー（配列）を返します。
 * @param {string} key ローカルストレージのキーの名前
 * @returns {Array} バリューの配列
 */
function localStorageGetItem(key) {
	if (localStorage.getItem(key)) {
		var item = JSON.parse(localStorage.getItem(key));
	} else {
		return false;
	}
	return item;
}

/**
 * 指定IDのタスクを削除し、内容を書き換えたタスクを追加します。
 * @param {string} key タスクのキー
 * @param {number} id タスクID
 * @param {object} target 書き換え済みのタスク情報
 * @returns {void} 返り値なし
 */
function localStorageEditItem(key, id, target) {
	const pushTarget = target;
	const removedData = getRemovedData(id);
	removedData.push(pushTarget);
	var newData = removedData;
	newData = JSON.stringify(newData);
	localStorage.setItem(key, newData);
}

/**
 * ローカルストレージに保存した情報をすべて削除します。
 * @returns {void} 返り値なし
 */
function deleteAllItems() {
	localStorage.clear();
	location.reload();
}

init();
