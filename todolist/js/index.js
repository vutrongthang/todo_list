const BARE_URL = "https://62f8b7a13eab3503d1da1abc.mockapi.io";
import { layThongTinTuForm, pushListJob } from "./main.js";
import { removeVietnameseTones } from "./validator.js";
let listJob = [];

let batLoading = () => {
  document.getElementById("loading").style.display = "flex";
};
let tatLoading = () => {
  document.getElementById("loading").style.display = "none";
};

let renderList = (list) => {
  let unCompleteTask = "";
  let completeTask = "";
  list.forEach((item) => {
    let content = `
    <li > ${item.name}  
      <span>
        <button onclick="deleteTask('${item.id}')">
          <i class="fa fa-trash-alt"></i>
        </button>
        <button onclick="completeTask('${item.id}')" >
          <i class="fa fa-check-circle"></i>
        </button>
      </span>
    </li>
    `;
    if (item.complete == false) {
      unCompleteTask += content;
    } else {
      completeTask += content;
    }
  });
  document.getElementById("todo").innerHTML = unCompleteTask;
  document.getElementById("completed").innerHTML = completeTask;
};

let renderListJob = () => {
  batLoading();
  axios({
    url: `${BARE_URL}/list`,
    method: "GET",
  })
    .then((res) => {
      tatLoading();
      listJob = pushListJob(res.data);
      renderList(res.data);
    })
    .catch((err) => {
      tatLoading();
      console.log("err: ", err);
    });
};
renderListJob();

let addItem = () => {
  let data = layThongTinTuForm();
  batLoading();
  axios({
    url: `${BARE_URL}/list`,
    method: "POST",
    data: data,
  })
    .then((res) => {
      tatLoading();
      document.getElementById("newTask").value = "";
      renderListJob();
    })
    .catch((err) => {
      tatLoading();
      console.log("err: ", err);
    });
};

let deleteTask = (id) => {
  batLoading();
  axios({
    url: `${BARE_URL}/list/${id}`,
    method: "DELETE",
  })
    .then((res) => {
      tatLoading();
      let listJob = res.data;
      renderListJob();
    })
    .catch((err) => {
      tatLoading();
      console.log("err: ", err);
    });
};

let completeTask = (id) => {
  axios({
    url: `${BARE_URL}/list/${id}`,
    method: "GET",
  })
    .then((res) => {
      let listJob = res.data;
      if (listJob.complete == false) {
        listJob.complete = true;
      } else {
        listJob.complete = false;
      }
      console.log("listJob: ", listJob);
      updateTask(listJob, id);
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};

let updateTask = (data, id) => {
  let dataForm = data;
  axios({
    url: `${BARE_URL}/list/${id}`,
    method: "PUT",
    data: dataForm,
  })
    .then((res) => {
      renderListJob();
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};

// Sắp xếp tăng
let upSort = () => {
  listJob.sort((a, b) => {
    if (
      removeVietnameseTones(a.name).toUpperCase() <
      removeVietnameseTones(b.name).toUpperCase()
    ) {
      return -1;
    } else if (
      removeVietnameseTones(a.name).toUpperCase() >
      removeVietnameseTones(b.name).toUpperCase()
    ) {
      return 1;
    } else {
      return 0;
    }
  });
  renderList(listJob);
};

// Sắp xếp giảm

let downSort = () => {
  listJob.sort((a, b) => {
    if (
      removeVietnameseTones(a.name).toUpperCase() >
      removeVietnameseTones(b.name).toUpperCase()
    ) {
      return -1;
    } else if (
      removeVietnameseTones(a.name).toUpperCase() <
      removeVietnameseTones(b.name).toUpperCase()
    ) {
      return 1;
    } else {
      return 0;
    }
  });
  renderList(listJob);
};

window.upSort = upSort;
window.downSort = downSort;
window.completeTask = completeTask;
window.deleteTask = deleteTask;
window.addItem = addItem;
