export let layThongTinTuForm = () => {
  let name = document.getElementById("newTask").value.trim();
  let complete = false;
  return {
    name: name,
    complete: complete,
  };
};
export let pushListJob = (data) => {
  let listJob = [];
  data.forEach((item) => {
    if (item.complete == false) {
      listJob.push(item);
    }
  });
  return listJob;
};
