
baseConfig = {
  keyProvider: ["5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5"], // WIF string or array of keys..
  httpEndpoint: 'http://localhost:8888',
  expireInSeconds: 60,
  broadcast: false,
  debug: true,
  sign: true,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // 32 byte (64 char) hex string
};

eos = Eos(baseConfig);


eos.getTableRows(true, 'todoaccount', 'todoaccount', 'todos', 0, 0, 100).then(result => {
  var todos = result.rows;

  localStorage.clear('todo');
 
  todos.forEach(element => {
    if (element.completed == '0') {
      console.log(element)
      addFromEos(element.description);
    }
  });
});

function get_todos() {
  var todos = new Array;
  var todos_str = localStorage.getItem('todo');
  if (todos_str !== null) {
      todos = JSON.parse(todos_str); 
  }
  return todos;
}

function addFromEos(task) {
  var todos = get_todos();
  todos.push(task);
  localStorage.setItem('todo', JSON.stringify(todos));
  show();

  return false;
}


async function  add() {
  
  await eos.contract('todoaccount').then(todoaccount => todoaccount.create('bobross',task))
  addFromEos();
}

/*
function add() {
  var task = document.getElementById('task').value;

  var todos = get_todos();
  todos.push(task);
  localStorage.setItem('todo', JSON.stringify(todos));

  show();

  return false;
}
*/

function remove() {
  var id = this.getAttribute('id');
  var todos = get_todos();
  todos.splice(id, 1);
  localStorage.setItem('todo', JSON.stringify(todos));

  show();

  return false;
}

function show() {
  var todos = get_todos();

  var html = '<ul>';
  for(var i=0; i<todos.length; i++) {
      html += '<li>' + todos[i] + '<button class="remove" id="' + i  + '">x</button></li>';
  };
  html += '</ul>';

  document.getElementById('todos').innerHTML = html;

  var buttons = document.getElementsByClassName('remove');
  for (var i=0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', remove);
  };
}

document.getElementById('add').addEventListener('click', add);
show();