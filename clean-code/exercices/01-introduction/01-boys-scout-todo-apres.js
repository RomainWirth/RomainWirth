const tasks = [];

function validateTaskInput(title) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Le titre est obligatoire et doit etre une chaine non vide.');
  }
}

function addTask(title, priority = 'normale') {
  validateTaskInput(title);

  tasks.push({
    title: title.trim(),
    priority,
    done: false,
    createdAt: new Date(),
  });
}

function getAllTasks() {
  return [...tasks];
}

function markTaskAsDone(index) {
  if (index < 0 || index >= tasks.length) {
    throw new Error('Index de tache invalide.');
  }

  tasks[index].done = true;
}

function deleteTask(index) {
  if (index < 0 || index >= tasks.length) {
    throw new Error('Index de tache invalide.');
  }

  tasks.splice(index, 1);
}

function displayTasks() {
  if (tasks.length === 0) {
    console.log('Aucune tache.');
    return;
  }

  tasks.forEach((task, index) => {
    const status = task.done ? '[x]' : '[ ]';
    console.log(`${index}. ${status} ${task.title} (priorite: ${task.priority})`);
  });
}

addTask('Faire les courses', 'haute');
addTask('Appeler le plombier');
markTaskAsDone(0);
displayTasks();
console.log(getAllTasks());
