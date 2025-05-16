// script.js 파일에 저장하세요

// --- HTML 요소들을 가져옵니다 ---
// querySelector나 getElementById를 사용하여 웹페이지의 특정 요소들을 JavaScript 객체로 가져옵니다.
const itemInput = document.getElementById('item-name-input'); // 과목/프로젝트 입력 칸 (ID: item-name-input)
const categorySelect = document.getElementById('item-category-select'); // 점(.)을 추가했어요!
const addButton = document.getElementById('add-item-button'); // 추가 버튼 (ID: add-item-button)

// 각 기간별 목록 (ul 태그) 요소를 가져옵니다.
// 각 카테고리 div (ID: day-list 등) 안에서 첫 번째 ul 태그를 찾습니다.
const dayList = document.getElementById('day-list').querySelector('ul');
const weekList = document.getElementById('week-list').querySelector('ul');
const monthList = document.getElementById('month-list').querySelector('ul');
const yearList = document.getElementById('year-list').querySelector('ul');

// 모든 목록 항목들을 포함하는 전체 영역 요소를 가져옵니다.
// 이벤트 위임을 사용하여 삭제 및 체크박스 기능을 처리하기 위해 필요합니다.
const itemsListArea = document.querySelector('.items-list-area');


// --- 데이터를 관리할 배열 변수 선언 ---
// 웹사이트의 모든 항목 정보를 이 배열에 저장하고 관리할 거예요.
let items = [];


// --- 데이터를 LocalStorage에 저장하는 함수 ---
function saveItems() {
    // items 배열을 JSON 문자열로 변환하여 'studyItems'라는 이름으로 localStorage에 저장합니다.
    localStorage.setItem('studyItems', JSON.stringify(items));
    console.log("데이터 저장 완료:", items); // 확인을 위한 로그 출력
}

// --- 저장된 데이터를 LocalStorage에서 불러오는 함수 ---
function loadItems() {
    // 'studyItems'라는 이름으로 localStorage에 저장된 데이터(문자열)를 가져옵니다.
    const storedItems = localStorage.getItem('studyItems');

    // 저장된 데이터가 있다면
    if (storedItems) {
        // JSON 문자열을 JavaScript 객체 배열로 다시 변환합니다.
        items = JSON.parse(storedItems);
        console.log("데이터 불러오기 완료:", items); // 확인을 위한 로그 출력

        // 기존 화면에 표시된 목록을 모두 비웁니다.
        clearAllLists();

        // 불러온 데이터 배열을 순회하면서 각 항목을 화면에 표시합니다.
        items.forEach(item => {
            addItemToDOM(item); // 각 항목을 DOM (화면)에 추가하는 함수 호출
        });
    } else {
        // 저장된 데이터가 없으면 items 배열을 비워둡니다. (이미 비어있지만 명시적으로)
        items = [];
        console.log("저장된 데이터가 없습니다.");
    }
}

// --- 항목 데이터를 받아 화면(DOM)에 li 요소를 추가하는 함수 ---
// 이 함수는 loadItems 함수와 항목 추가 시 모두 사용될 거예요.
function addItemToDOM(item) {
    const newItem = document.createElement('li');

    // li 요소에 데이터 id 속성을 추가하여 해당 항목의 고유 ID를 저장합니다.
    // data-id 속성은 JavaScript에서 dataset.id로 접근할 수 있습니다.
    newItem.dataset.id = item.id;

    // innerHTML로 체크박스, 항목 이름, 삭제 버튼을 만듭니다.
    // 체크박스의 checked 속성은 item.completed 값에 따라 설정됩니다.
    newItem.innerHTML = `
        <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''}>
        <span>${item.name}</span>
        <button class="delete-button">삭제</button>
    `;

    // 어떤 카테고리 목록(ul)에 추가할지 결정합니다.
    let targetList;
    switch (item.category) {
        case 'day': targetList = dayList; break;
        case 'week': targetList = weekList; break;
        case 'month': targetList = monthList; break;
        case 'year': targetList = yearList; break;
        default: targetList = dayList; // 기본값 설정
    }

    // 해당 카테고리 목록에 새로운 항목을 추가합니다.
    targetList.appendChild(newItem);
}

// --- 모든 목록(ul)의 자식 요소(li)를 비우는 함수 ---
function clearAllLists() {
    dayList.innerHTML = '';
    weekList.innerHTML = '';
    monthList.innerHTML = '';
    yearList.innerHTML = '';
}


// --- '추가' 버튼 클릭 이벤트 리스너 ---
// 사용자가 '추가' 버튼을 클릭했을 때 실행될 코드를 정의합니다.
addButton.addEventListener('click', function() {
    // 1. 입력된 과목/프로젝트 이름과 선택된 기간 카테고리 값을 가져옵니다.
    const itemName = itemInput.value.trim(); // 입력 값 가져오고 공백 제거
    const selectedCategory = categorySelect.value; // 선택된 기간 값 가져오기

    // 2. 입력 값이 비어있는지 확인합니다.
    if (itemName === '') {
        alert('과목 또는 프로젝트 이름을 입력해주세요!'); // 비어있으면 경고창 표시
        return; // 함수 실행 중단
    }

    // 3. 새로운 항목에 대한 데이터 객체를 생성합니다.
    const newItemData = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // 고유 ID 생성 (시간 + 랜덤 문자열)
        name: itemName,
        category: selectedCategory,
        completed: false // 처음 추가될 때는 미완료 상태
    };

    // 4. 데이터 배열에 새로운 항목을 추가합니다.
    items.push(newItemData);

    // 5. 데이터를 localStorage에 저장합니다.
    saveItems();

    // 6. 화면(DOM)에 새로운 항목을 추가합니다.
    addItemToDOM(newItemData); // 새로 만든 addItemToDOM 함수 사용

    // 7. 입력 칸 초기화
    itemInput.value = ''; // 입력 칸 내용 삭제
    itemInput.focus(); // 입력 칸에 커서 위치시키기
});


// --- '삭제' 및 '체크박스' 클릭 이벤트 리스너 (이벤트 위임 사용) ---
// 목록 항목들이 들어있는 전체 영역(itemsListArea)에 클릭 이벤트 리스너를 추가합니다.
// 이를 통해 동적으로 생성된 요소들의 클릭 이벤트도 처리할 수 있습니다.
itemsListArea.addEventListener('click', function(event) {
    const target = event.target; // 실제로 클릭된 요소

    // 1. 클릭된 요소가 'delete-button' 클래스를 가지고 있는지 확인 (삭제 버튼 처리)
    if (target.classList.contains('delete-button')) {
        const listItem = target.closest('li'); // 가장 가까운 li 부모 찾기

        if (listItem) {
            const itemIdToDelete = listItem.dataset.id; // li 요소에 저장된 data-id 값 가져오기

            // 1-1. items 배열에서 해당 ID를 가진 항목을 찾아서 제거합니다.
            items = items.filter(item => item.id !== itemIdToDelete);

            // 1-2. 변경된 items 배열을 localStorage에 저장합니다.
            saveItems();

            // 1-3. 화면(DOM)에서 해당 li 요소를 제거합니다.
            listItem.remove();
        }
    }

    // 2. 클릭된 요소가 'item-checkbox' 클래스를 가지고 있는지 확인 (체크박스 처리)
    if (target.classList.contains('item-checkbox')) {
         const listItem = target.closest('li'); // 가장 가까운 li 부모 찾기

         if (listItem) {
             const itemIdToUpdate = listItem.dataset.id; // li 요소에 저장된 data-id 값 가져오기
             const isCompleted = target.checked; // 체크박스의 현재 상태 (true/false)

             // 2-1. items 배열에서 해당 ID를 가진 항목의 completed 상태를 업데이트합니다.
             items = items.map(item => {
                 if (item.id === itemIdToUpdate) {
                     // 해당 항목을 찾았으면 completed 속성만 업데이트하여 새로운 객체를 반환
                     return { ...item, completed: isCompleted };
                 }
                 return item; // 다른 항목은 그대로 반환
             });

             // 2-2. 변경된 items 배열을 localStorage에 저장합니다.
             saveItems();

             // 2-3. (CSS에서 체크박스 상태에 따라 글자 스타일 변경하는 코드가 이미 있으므로 화면 업데이트는 자동으로 됩니다.)
         }
    }
});


// --- 타이머 관련 변수 및 요소 가져오기 (기존 코드 유지) ---
const timerDisplay = document.getElementById('timer-display');
const startPauseTimerButton = document.getElementById('start-pause-timer');
const resetTimerButton = document.getElementById('reset-timer');

let timerInterval = null; // setInterval 함수의 ID를 저장할 변수
let timeRemaining = 0; // 남은 시간 (초 단위)
let timerState = 'idle'; // 타이머 상태: 'idle', 'running', 'paused'

// --- 스톱워치 관련 변수 및 요소 가져오기 (기존 코드 유지) ---
const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopStopwatchButton = document.getElementById('start-stop-stopwatch');
const resetStopwatchButton = document.getElementById('reset-stopwatch');

let stopwatchInterval = null; // setInterval 함수의 ID를 저장할 변수
let elapsedTime = 0; // 경과 시간 (밀리초 단위)
let stopwatchState = 'idle'; // 스톱워치 상태: 'idle', 'running'
let startTime = 0; // 스톱워치가 시작된 시점의 타임스탬프

// --- 시간을 HH:MM:SS 형태로 포맷하는 헬퍼 함수 (기존 코드 유지) ---
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 각 부분이 항상 두 자리가 되도록 앞에 0을 붙여줍니다.
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

// --- 타이머 기능 구현 (기존 코드 유지) ---

// 타이머 시간을 화면에 업데이트하는 함수
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining * 1000); // 초 단위를 밀리초로 변환하여 포맷
}

// 타이머 시작/일시정지 버튼 클릭 처리
startPauseTimerButton.addEventListener('click', function() {
    if (timerState === 'idle' || timerState === 'paused') {
        // 타이머 시작 또는 다시 시작
        timerState = 'running';
        startPauseTimerButton.textContent = '일시정지'; // 버튼 텍스트 변경

        // 초기 설정 시간 (예: 25분 = 1500초) 또는 사용자 입력 값 사용
        // 여기서는 간단하게 처음 시작할 때 1500초(25분)으로 설정해봅시다.
        if (timeRemaining <= 0 && timerState === 'running') { // timeRemaining이 0 이하일 때만 초기 시간 설정
             timeRemaining = 1500; // 25분 설정
             updateTimerDisplay(); // 설정된 시간 바로 표시
        }


        // 1초마다 실행되는 타이머 설정
        timerInterval = setInterval(function() {
            timeRemaining--; // 남은 시간 1초 감소
            updateTimerDisplay(); // 화면 업데이트

            // 시간이 0보다 작거나 같아지면 타이머 중지
            if (timeRemaining <= 0) {
                timeRemaining = 0; // 0으로 맞추고
                updateTimerDisplay(); // 화면 업데이트
                resetTimer(); // 타이머 초기화 상태로
                alert('타이머 종료!'); // 알림 (선택 사항)
            }
        }, 1000); // 1000밀리초 = 1초
    } else if (timerState === 'running') {
        // 타이머 일시정지
        timerState = 'paused';
        startPauseTimerButton.textContent = '계속'; // 버튼 텍스트 변경
        clearInterval(timerInterval); // 타이머 중지
    }
});

// 타이머 초기화 버튼 클릭 처리
resetTimerButton.addEventListener('click', function() {
    resetTimer(); // 타이머 초기화 함수 호출
});

// 타이머를 초기 상태로 되돌리는 함수
function resetTimer() {
    clearInterval(timerInterval); // 실행 중인 타이머 중지
    timerInterval = null; // 인터벌 ID 초기화
    timeRemaining = 0; // 남은 시간 0으로 설정
    timerState = 'idle'; // 상태를 초기화
    updateTimerDisplay(); // 화면 업데이트 (00:00:00으로 표시)
    startPauseTimerButton.textContent = '시작'; // 버튼 텍스트 변경
}

// --- 스톱워치 기능 구현 (기존 코드 유지) ---

// 스톱워치 시간을 화면에 업데이트하는 함수
function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatTime(elapsedTime); // 경과 시간을 포맷하여 표시
}

// 스톱워치 시작/정지 버튼 클릭 처리
startStopStopwatchButton.addEventListener('click', function() {
    if (stopwatchState === 'idle') {
        // 스톱워치 시작
        stopwatchState = 'running';
        startStopStopwatchButton.textContent = '정지'; // 버튼 텍스트 변경

        // 시작 시간 기록: Date.now()는 현재 시간을 밀리초로 반환합니다.
        // 이미 경과된 시간이 있다면 (정지 후 재시작), 현재 시간에서 경과된 시간을 빼서 실제 시작 시점을 계산합니다.
        startTime = Date.now() - elapsedTime;

        // 100밀리초 (0.1초) 마다 실행되는 스톱워치 설정 (더 부드러운 업데이트)
        stopwatchInterval = setInterval(function() {
            // 현재 시간에서 시작 시점을 빼서 총 경과된 시간을 계산합니다.
            elapsedTime = Date.now() - startTime;
            updateStopwatchDisplay(); // 화면 업데이트
        }, 100); // 100밀리초 = 0.1초
    } else if (stopwatchState === 'running') {
        // 스톱워치 정지 (일시정지 기능 없음, 정지 후 다시 시작하면 이어서 진행)
        stopwatchState = 'idle'; // 상태를 'idle'로 변경하여 이어서 시작 가능하게 함
        startStopStopwatchButton.textContent = '시작'; // 버튼 텍스트 변경
        clearInterval(stopwatchInterval); // 스톱워치 중지
    }
});

// 스톱워치 초기화 버튼 클릭 처리
resetStopwatchButton.addEventListener('click', function() {
    resetStopwatch(); // 스톱워치 초기화 함수 호출
});

// 스톱워치를 초기 상태로 되돌리는 함수
function resetStopwatch() {
    clearInterval(stopwatchInterval); // 실행 중인 스톱워치 중지
    stopwatchInterval = null; // 인터벌 ID 초기화
    elapsedTime = 0; // 경과 시간 0으로 설정
    stopwatchState = 'idle'; // 상태를 초기화
    updateStopwatchDisplay(); // 화면 업데이트 (00:00:00으로 표시)
    startStopStopwatchButton.textContent = '시작'; // 버튼 텍스트 변경
}


// --- 페이지 로딩 시 데이터 불러오기 및 초기 설정 ---
// 웹페이지가 완전히 로드되면 실행될 함수들을 정의합니다.
document.addEventListener('DOMContentLoaded', function() {
    loadItems(); // 스터디 플래너 목록 데이터 불러오기

    // 타이머와 스톱워치 초기 화면을 00:00:00으로 설정
    updateTimerDisplay();
    updateStopwatchDisplay();
});
