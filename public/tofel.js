/*
 * Name: Jiahao He, Bochao Yin
 * Date: 12/12/2023
 * Section: CSE 154 AD
 *
 * This is the js file for the tofel page
 */
"use strict";
(function () {

  window.addEventListener("load", init);

  /**
   * set the functionality when page load including different buttons.
   */
  function init() {
    id("reading").addEventListener("click", function () {
      display("read");
    });
    id("listening").addEventListener("click", function () {
      display("listen");
    });
    id("speaking").addEventListener("click", function () {
      display("speak");
    });
    id("writing").addEventListener("click", function () {
      display("write");
    });
    id("all").addEventListener("click", function () {
      display("");
    });
    id("tofel-reading-vip-courses").addEventListener("click", function () {
      confirm("reading vip courses");
    });
    id("tofel-reading-courses").addEventListener("click", function () {
      confirm('reading courses');
    });
    tofelButton();
    otherTofelButton();
    releaseButton();
  }

  /**
   * Add the function of gramma for some button.
   */
  function tofelButton() {
    id("tofel-listening-vip-courses").addEventListener("click", function () {
      confirm('listening vip courses');
    });
    id("tofel-listening-courses").addEventListener("click", function () {
      confirm('listening courses');

    });
    id("tofel-speaking-vip-courses").addEventListener("click", function () {
      confirm('speaking vip courses');
    });
    id("tofel-speaking-courses").addEventListener("click", function () {
      confirm('speaking courses');
    });
  }

  /**
   * Add the function of gramma for some button.
   */
  function otherTofelButton() {
    id("tofel-writing-vip-courses").addEventListener("click", function () {
      confirm('writing vip courses');
    });
    id("tofel-writing-courses").addEventListener("click", function () {
      confirm('writing courses');
    });
    fillAll();
  }

  /**
   * display the information based on the appropreiate button
   * @param {string} subject - the subject of the corresponding information
   */
  function display(subject) {
    let courseList = ["read1", "read2", "speak1", "speak2",
      "listen1", "listen2", "write1", "write2"];
    for (let i = 0; i < courseList.length; i++) {
      if (courseList[i].includes(subject)) {
        id(courseList[i]).style.display = "block";
      } else {
        id(courseList[i]).style.display = "none";
      }
    }
  }

  /**
   * display the information of successfully registration,
   * and delete that after 3 seconds.
   * @param {string} courseName - the corresponding courseName
   */
  async function displaySuccess(courseName) {
    let qualify = await checkPermision(courseName);
    if (qualify) {
      let para = new FormData();
      para.append('course', "tofel " + courseName);
      fetch('/course/profile/enrollCourse/tofel', {
        method: 'POST',
        body: para
      })
        .then(statusCheck)
        .then(res => res.text())
        .then(() => {
          displaySuccessEnroll(courseName);
        })
        .catch(handleError);
    } else {
      return null;
    }
  }

  /**
   * check the permission.
   * @param {string} courseName - the name of the course
   */
  async function checkPermision(courseName) {
    const timeOut = 3000;
    let words = courseName.split(' ');
    if (words.indexOf('vip') > -1 && words.length >= 3) {
      let course = 'tofel ' + words[0] + ' ' + words[2];
      let encodedCourseName = encodeURIComponent(course);
      let url = '/course/history/search?course=' + encodedCourseName;

      try {
        let response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch: ' + response.statusText);
        }
        let data = await response.json();
        if (!data.status) {
          let parent = id('notification');
          let para = document.createElement('p');
          para.textContent = 'You should first complete the ' + course;
          parent.appendChild(para);
          setTimeout(() => parent.removeChild(para), timeOut);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * check the permission.
   * @param {string} courseName - the name of the course
   */
  function displaySuccessEnroll(courseName) {
    const delayTime = 3000;
    let not = id("notification");
    let newp = document.createElement("p");
    newp.textContent = "You are successfully enrolled in tofel " + courseName + "!";
    newp.classList.add("notification");
    not.appendChild(newp);
    setTimeout(function () {
      not.removeChild(newp);
    }, delayTime);
    disableButton();
    clearAll();
    fillAll();
  }

  /**
   * check the status of the response
   * @param {responset} response The Response object from an HTTP request
   * @returns {response}received response
   * @throws {error} if the promise is rejected, throw an error with response text
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * disable the button once it if clicked.
   * @param {string} name - the id of the button.
   */
  function disableButton() {
    fetch('/course/profile/findCourse/tofel')
      .then(statusCheck)
      .then(res => res.json())
      .then(helper)
      .catch(handleError);
  }

  /**
   * the confirm function;
   * @param {Object} res - the response
   */
  function helper(res) {
    for (let i = 0; i < res.length; i++) {
      let courseName = res[i].course;
      let convertedString = courseName.replace(/\s+/g, '-');
      id(convertedString).disabled = true;
    }
  }

  /**
   * release all of the button;
   */
  function releaseButton() {
    let allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      button.disabled = false;
    });
    disableButton();
  }

  /**
   * fill all the pages.
   */
  function fillAll() {
    let list1 = ["tofel-listening-vip", "tofel-listening", "tofel-reading", "tofel-reading-vip",
      "tofel-speaking", "tofel-speaking-vip", "tofel-writing", "tofel-writing-vip"];
    for (let i = 0; i < list1.length; i++) {
      fill(list1[i], list1[i]);
      checkZero(list1[i], list1[i]);
    }
  }

  /**
   * checkwhether the name is zero;
   * @param {string} name - the corresponding courseName
   * @param {string} name1 - the corresponding courseName
   */
  function checkZero(name, name1) {
    name = name.replace(/-/g, ' ');
    name += " courses";
    fetch('/tofel/course/left?left=' + name)
      .then(statusCheck)
      .then(res => res.json())
      .then(data => {
        zero(data, name1);
      })
      .catch(handleError);
  }

  /**
   * checkwhether the name is zero;
   * @param {object} res - the response
   * @param {string} name - the corresponding courseName
   */
  function zero(res, name) {
    if (res.numbers[0].number === 0) {
      name += "-courses";
      id(name).disabled = true;
    }
  }

  /**
   * helper function for the fillAll
   * @param {string} name - the corresponding courseName
   * @param {string} name1 - the corresponding courseName
   */
  function fill(name, name1) {
    name = name.replace(/-/g, ' ');
    name += " courses";
    fetch('/tofel/course/left?left=' + name)
      .then(statusCheck)
      .then(res => res.json())
      .then(data => {
        fulfill(data, name1);
      })
      .catch(handleError);
  }

  /**
   * helper function for fulfill
   * @param {object} res - the response
   * @param {string} name1 - the corresponding courseName
   */
  function fulfill(res, name1) {
    id(name1).textContent += res.numbers[0].number;
  }

  /**
   * the confirm function;
   * @param {string} course - the name of the course;
   */
  function confirm(course) {
    /**
     * handle the yes respose;
     */
    function handleYesClick() {
      displaySuccess(course);
      id('confirmation').classList.add('hidden');
      id('yes').removeEventListener('click', handleYesClick);
      id('no').removeEventListener('click', handleNoClick);
    }

    /**
     * handle the no respose;
     */
    function handleNoClick() {
      id('confirmation').classList.add('hidden');
      id('yes').removeEventListener('click', handleYesClick);
      id('no').removeEventListener('click', handleNoClick);
    }

    id('yes').addEventListener('click', handleYesClick);
    id('no').addEventListener('click', handleNoClick);

    id('confirmation').classList.remove('hidden');
  }

  /**
   * clear the page
   */
  function clearAll() {
    let list1 = ["tofel-listening-vip", "tofel-listening", "tofel-reading", "tofel-reading-vip",
      "tofel-speaking", "tofel-speaking-vip", "tofel-writing", "tofel-writing-vip"];
    for (let i = 0; i < list1.length; i++) {
      id(list1[i]).textContent = "Course left: ";
    }
  }

  /**
   * handle and display the error
   * @param {error} error the error we received
   */
  function handleError(error) {
    console.error(error);
    let errorMsg = document.createElement('p');
    errorMsg.textContent = error;
    errorMsg.id = 'error-message';
    id('error').classList.remove('hidden');
    id('error').appendChild(errorMsg);
  }

  /**
   * select the query by id
   * @param {string} id - the id of the element
   * @return {HTMLElement} DOM object associated with id
   */
  function id(id) {
    return document.getElementById(id);
  }
})();