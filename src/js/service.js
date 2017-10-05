import axios from "axios";

function getCurrent() {
  axios.get('#')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  return;
}
