console.clear()

// Функция сортировки массива по датам
// С условием, что даты находятся в формате дд.мм.гггг
const sortArray = (arr) => {
  return [...arr].sort((a, b) => {
    const aa = a.date.split('.').reverse().join(),
    bb = b.date.split('.').reverse().join();
    return aa < bb ? -1 : (aa > bb ? 1 : 0);
  })
}

// Берем массив из локального хранилища
// Либо записываем его туда, если изначально его там нет
let tableData;

if (localStorage['tableData']) {
  tableData = sortArray(JSON.parse(localStorage['tableData']))
} else {
  tableData = [
        {
          id: 1,
          date: '01.01.2019',
          company: 'Газпром',
          price: 2000
        },
        {
          id: 2,
          date: '01.01.2019',
          company: 'Автоваз',
          price: 2500
        },
        {
          id: 3,
          date: '05.01.2019',
          company: 'Сбербанк',
          price: 10000
        },
        {
          id: 4,
          date: '10.01.2019',
          company: 'Газпром',
          price: 2500
        },
        {
          id: 5,
          date: '07.10.2019',
          company: 'Автоваз',
          price: 2100
        }
    ];
    localStorage.setItem('tableData', JSON.stringify(tableData))
}

// Ищем input поля по отдельности
const dateInput = document.getElementById('date');
const companyInput = document.getElementById('company');
const priceInput = document.getElementById('price');

// Кнопка для добавления
const addBtn = document.getElementById('add__btn');

// Записываем input поля в одну переменную
const inputBr = document.querySelectorAll('.input_br');

// Берем таблицу и создаем контейнер tbody
const table = document.getElementById('table');
const tbody = document.createElement('tbody');

// Динамическое создание таблицы
function createTable() {
  for (let i = 0; i < tableData.length; i++) {

    const tr = document.createElement('tr');
    tr.insertAdjacentHTML('beforeend', `
      <td><input class="date" type="text" value="${tableData[i].date}"></td>
      <td><input class="company" type="text" value="${tableData[i].company}"></td>
      <td><input class="price" type="text" value="${tableData[i].price}"></td>
    `)

    tbody.append(tr);
    table.append(tbody)
  }
}

createTable();

// Отрисовка графика
const buildChart = () => {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Берем цены
  const prices = tableData.map(item => {
    return item.price
  })

  // Берем даты
  const dates = tableData.map(item => {
    return item.date
  })

  const chart = new Chart(ctx, {
      // Тип графика
      type: 'line',
  
      // Данные
      data: {
          labels: dates,
          datasets: [{
              label: 'График зависимости инструментов по датам',
              backgroundColor: '#6495ed',
              borderColor: '#05386b',
              data: prices
          }]
      },
  
      // Конфигурация
      options: {
            scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero: true
                  },
              }]
          }
      }
  });
}

buildChart()

// Показываем и скрываем модальное окно
// для добавления новой записи
const openModal = document.getElementById('open__modal');
const closeBtn = document.getElementById('close__modal');

const modal = document.querySelector('.modal');
const overlay = document.getElementById('overlay');

const closeModal = () => {
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

openModal.addEventListener('click', () => {
  modal.style.display = 'block';
  overlay.style.display = 'block';
})

closeBtn.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)
window.addEventListener('keyup', (e) => {
  if (e.key == 'Escape') closeModal()
})

// Кнопка для сохранения данных после изменения в таблице
const saveBtn = document.getElementById('save_btn');
saveBtn.addEventListener('click', ()=> {
    if (confirm('Сохранить изменения?')) saveChanges()
  }
)

// Добавляем новую запись в массив
addBtn.addEventListener('click', () => {

  // Проверяем поля на пустоту
  const checkIfNotEmpty = dateInput.value || companyInput.value || Number(priceInput.value);
  const errorMessageBox = document.querySelector('.error-message');
  if (!checkIfNotEmpty) {
    errorMessageBox.style.display = 'block';
    return false
  }

  // Валидация полей формы
  const validationTips = document.getElementById('validation');
  const dateRegExp = /^\d\d.\d\d.\d\d\d\d$/g;
  const companyRegExp = /^[а-яa-z\s]+$/gi;
  const isvalid = dateRegExp.test(dateInput.value) && companyRegExp.test(companyInput.value);
  if (!isvalid) {
    validationTips.style.display = 'block';
    return false
  }

  // Формирование объекта для добавления в массив
  let elem = {
    id: tableData.length + 1,
    date: dateInput.value,
    company: companyInput.value,
    price: Number(priceInput.value)
  }
  tableData.push(elem)

  // Закрываем модальное окно после добавления
  closeModal()

  // Обнуляем значения полей ввода после добавления
  for (let i=0; i < inputBr.length; i++) {
    inputBr[i].value = '';
  }

  // Записываем результат в локальное хранилище
  localStorage.setItem('tableData', JSON.stringify(tableData))

  // Очищаем tbody перед созданием там записей
  tbody.innerHTML = '';

  // Сортируем уже обновленный массив
  // чтобы при пересоздании таблицы и графика
  // данные там были сортированы по датам
  tableData = sortArray(JSON.parse(localStorage['tableData']))

  // Пересоздаем таблицу и график на основе обновленных данных
  createTable()
  buildChart() 
})

// Функция для сохранения данных после изменения
function saveChanges() {

  // Берем строки таблицы и превращаем их в объекты
  // и записываем в массив
  const tableRows = document.querySelectorAll('#table tbody tr');
  const arr = [...tableRows].map((item, pos) => {
    return {
      id: pos + 1,
      price: Number(item.querySelector('input.price').value),
      company: item.querySelector('input.company').value,
      date: item.querySelector('input.date').value,
    }
  })

  localStorage.setItem('tableData', JSON.stringify(arr))

  // Очищаем tbody перед созданием там записей
  tbody.innerHTML = '';

  // Сортируем уже обновленный массив
  // чтобы при пересоздании таблицы и графика
  // данные там были сортированы по датам
  tableData = sortArray(JSON.parse(localStorage['tableData']))

  // Пересоздаем таблицу и график на основе обновленных данных
  createTable()
  buildChart() 
}