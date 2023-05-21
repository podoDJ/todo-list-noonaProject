// 유저가 값을 입력한다.
// + 버튼을 클릭하면 할 일이 추가된다.
// delete버튼을 누르면 할 일이 삭제된다.
// check버튼을 누르면 할 일이 끝나면서 밑줄이 간다.
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만 나온다.
// 전체 탭을 누르면 다시 전체아이템으로 돌아옴.

// Check 버튼에 대해 추가되는 내용
// 1. Check 버튼을 클릭하는 순간 false => true로 변경
// 2. true이면 끝난걸로 간주하고 밑줄 보여주기
// 3. false이면 안 끝난걸로 간주하고 그대로 두기.

let taskInput = document.getElementById('task-input');
let addButton = document.getElementById('add-button');
let taskList = [];


// 이하 tabIndicator까지는 tab 클릭하면 언더바가 움직이는 함수.
let underline = document.getElementById('under-line')
let tabs = document.querySelectorAll(".task-tabs div");

tabs.forEach((tab) => tab.addEventListener("click", (e) => tabIndicator(e)));
function tabIndicator(e) {
  underline.style.left = e.currentTarget.offsetLeft + "px"; //우변 뜻 : 타겟한 아이템이 왼쪽에서부터 어디에 붙어있는지
  underline.style.width = e.currentTarget.offsetWidth + "px"; //우변 뜻 : 타겟한 아이템의 너비가 얼마난지
  underline.style.top = e.currentTarget.offsetTop + (e.target.offsetHeight - 4) + "px";  //우변 뜻 : 타겟한 아이템이 높이가 얼마난지
}

let mode = 'all'
let filterList = []

addButton.addEventListener('click',addTask)

//왜 i = 1인가? console.log(tabs)를 치면 tabs의 0변쨰는 그냥 underline이며, 걔는 id를 줄 필요가 없기 때문이다.
for (let i = 1 ; i < tabs.length ; i++) {
  // function(event){filter(event)} : 탭 같은 경우에도 내가 무슨 탭을 선택했는지 알아야 함. event를 해서 event에 있는 타겟으로 갖고온다는 의미
  tabs[i].addEventListener("click",function(event){filter(event)})
}

function addTask() {
  //let taskContent = taskInput.value;
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false //task 끝났어? 기본값은 아직 안 끝났어!
  }
  //taskList.push(taskContent);
  taskList.push(task);
  console.log(taskList)
  render()
}

// 그림을 그려주는 함수를 만들어보자.
// taskContent를 썼을 때는 <div>${taskList[i]}</div>만 사용
function render() {
  let  list = [];
  if (mode == "all") {
    list = taskList
  } else if (mode == "ongoing" || mode == "done") {
    list = filterList
    console.log(list)
  }
  let resultHTML = '';
  for (let i = 0 ; i < list.length ; i++) {
    // taskList[i]의 속성인 isComplete가 true면 task-done 클래스의 스타일 적용
    if(list[i].isComplete == true) {
      resultHTML += `<div class="task">
                      <div class="task-done">${list[i].taskContent}</div>
                      <div>
                        <button onclick="toggleComplete('${list[i].id}')">Check</button>
                        <button onclick="deleteTask('${list[i].id}')">Delete</button>
                      </div>
                    </div>`
    } else {
    // taskList[i]의 속성인 isComplete가 false면 task-done 클래스 없는 애로 출력
    resultHTML += `<div class="task">
                    <div>${list[i].taskContent}</div>
                    <div>
                      <button onclick="toggleComplete('${list[i].id}')">Check</button>
                      <button onclick="deleteTask('${list[i].id}')">Delete</button>
                    </div>
                  </div>`
    }
  }

  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  console.log("id:", id);
  for(let i = 0 ; i < taskList.length ; i++) {
    // taskList 오브젝트의 i번째 아이의 id가 toggleComplete(id)의 id랑 똑같다.
    if(taskList[i].id == id) {
      // !는 아니다 라는 뜻. !taskList[i].isComplete은 taskList[i].isComplete의 반대편이라는 뜻이다.
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render() // toggleComplete(id)가 끝나면 render()를 불러 줘야 취소선 실행이 됨.
  console.log(taskList);
}

function deleteTask(id) {
  console.log("삭제하자.")
  for (let i = 0 ; i < taskList.length ; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1)
      break
    }
  }
  render();
  console.log(taskList)
}

function filter(event) {
  mode = event.target.id
  // event.target : event가 발생한 컴포넌트만 타켓 / event.target.id : 앞의 컴포넌트의 id값만 타겟
  console.log("filter 클릭댐", event.target.id)
  if (mode == 'all') {
    render();
  } else if (mode == 'ongoing') {
    for (let i = 0 ; i < taskList.length ; i++) {
      if(taskList[i].isComplete == false) {
        filterList.push(taskList[i])
      }
    }
    render();
  } else if (mode == 'done') {
    for (let i = 0 ;  i < taskList.length ; i++)
      if(taskList[i].isComplete == true) {
        filterList.push(taskList[i])
      }
      render();
  }
  
}

function randomIDGenerate() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}