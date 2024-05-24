/*
 * Name: Jiahao He, Bochao Yin
 * Date: 12/12/2023
 * Section: CSE 154 AD
 *
 * This is the js file for the user profile
 */
"use strict";
(function () {
  window.addEventListener("load", init);
  /**
   * sets up necessary functionality when page loads
   */
  async function init() {
    await populateAll();
    id("logout-1").addEventListener('click', logout);
    id("logout-2").addEventListener('click', logout);
    id('complete').addEventListener('click', checkPermision);
    id("search-term").addEventListener("input", async function () {
      try {
        await handleSearchTermInput();
      } catch (error) {
        console.error("Error handling input:", error);
      }
    });
    id("search-btn").addEventListener("click", search);
    id('switch-to-enroll').addEventListener('click', changeView);
    id('back-user-info').addEventListener('click', changeView);
    id('mode').addEventListener('click', changeMode);
    id('mode1').addEventListener('click', changeMode);
    id('find-tf-course').addEventListener('click', () => {
      window.location.href = "tofel.html";
    });
    id('find-gre-course').addEventListener('click', () => {
      window.location.href = "gre.html";
    });
    id('history').addEventListener('click', () => {
      populatingHistory();
      id('transaction').classList.remove('hidden');
      id('course').classList.add('hidden');
      id('user-info').classList.add('hidden');
    });
    id('go-back').addEventListener('click', () => {
      id('transaction').classList.add('hidden');
      id('course').classList.add('hidden');
      id('user-info').classList.remove('hidden');
    });
  }

  /**
   * display all of the courses
   */
  async function displayAllCourse() {
    try {
      const grePromise = displayCourse('gre');
      const tofelPromise = displayCourse('tofel');
      await Promise.all([grePromise, tofelPromise]);
      console.log('Both courses displayed successfully.');
    } catch (error) {
      console.error('An error occurred while displaying courses:', error);
    }
  }

  /**
   * populating the page
   */
  async function populateAll() {
    try {
      const displayPromise = display();
      await Promise.all([displayPromise, displayAllCourse()]);
      console.log('All display functions completed successfully.');
    } catch (error) {
      console.error('An error occurred while populating the page:', error);
    }
  }

  /**
   * search for the possible name.
   */
  function search() {
    let name = id("search-term").value;
    fetch("/course/profile/search?search=" + name)
      .then(statusCheck)
      .then(res => res.json())
      .then(displayTofelSearch)
      .catch(handleError);
  }

  /**
   * display the tofel search.
   * @param {Object} res - the response
   */
  function displayTofelSearch(res) {
    let totalNum = document.querySelectorAll("li");
    for (let i = 0; i < totalNum.length; i++) {
      totalNum[i].classList.add('hidden');
    }
    for (let i = 0; i < res.combinedResult.result1.length; i++) {
      let name = res.combinedResult.result1[i].course;
      id(name).classList.remove('hidden');
    }
    for (let i = 0; i < res.combinedResult.result2.length; i++) {
      let name = res.combinedResult.result2[i].course.replace(/\s+/g, '-');
      id(name).classList.remove('hidden');
    }
    id("email").classList.remove('hidden');
    id("username").classList.remove('hidden');
  }

  /**
   * change the color of the background
   */
  function changeMode() {
    let content = id('user-info');
    content.classList.toggle('section1');
    content.classList.toggle('section2');
    let mainPart = id('main');
    mainPart.classList.toggle('body1');
    mainPart.classList.toggle('body2');
    let logout1 = id('logout-1');
    logout1.classList.toggle('log-out');
    logout1.classList.toggle('log-out2');
    let logout2 = id('logout-2');
    logout2.classList.toggle('log-out');
    logout2.classList.toggle('log-out2');
  }

  /**
   * display the profile information.
   */
  function display() {
    fetch('/course/profile')
      .then(statusCheck)
      .then(res => res.json())
      .then(showResult)
      .catch(handleError);
  }

  /**
   * show the required result.
   * @param {Object} res - the response
   */
  function showResult(res) {
    const name = res.username;
    const email = res.email;
    let para = document.createElement('p');
    para.textContent = name;
    id('username').appendChild(para);
    let para2 = document.createElement('p');
    para2.textContent = email;
    id('email').appendChild(para2);
  }

  /**
   * display the target
   * @param {string} course - the name of the course
   */
  async function displayCourse(course) {
    fetch('/course/profile/findCourse/' + course)
      .then(statusCheck)
      .then(res => res.json())
      .then(data => showCourse(data, course))
      .then(checkComplete())
      .catch(handleError);
  }

  /**
   * if nothing is input, the button should be disabled.
   */
  async function handleSearchTermInput() {
    let trimmedValue = id("search-term").value.trim();
    id("search-btn").disabled = trimmedValue === '';
    if (trimmedValue === '') {
      let totalNum = document.querySelectorAll("#enrolled-course li");
      for (let i = 0; i < totalNum.length; i++) {
        totalNum[i].classList.remove('hidden');
      }
      id("email").classList.remove('hidden');
      id("username").classList.remove('hidden');
    }
  }

  /**
   * confirm the thing
   * @param {string} target - the name of the target
   * @param {string} course - the name of the course
   */
  function confirm(target, course) {

    /**
     * handle the yes respose;
     */
    function handleYesClick() {
      deleteCourse(target, course);
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
   * show the courses
   * @param {Object} res - the response
   * @param {string} course - the name of the course
   */
  async function showCourse(res, course) {
    for (let i = 0; i < res.length; i++) {
      let enrolledCourseList = document.getElementById('enrolled-course');
      let newLi = document.createElement('li');
      let newButton = document.createElement('button');

      let courseId = res[i].course.replace(/\s+/g, '-');
      newLi.id = courseId;
      newButton.id = "button-" + courseId;
      newButton.addEventListener('click', () => {
        confirm(newLi.id, course);
      });
      newButton.className = 'delete';
      newButton.appendChild(document.createTextNode('Delete'));
      let para = document.createElement('p');
      para.textContent = res[i].course;
      newLi.appendChild(para);
      newLi.appendChild(newButton);
      enrolledCourseList.appendChild(newLi);
    }
  }

  /**
   * populate the history part
   */
  function populatingHistory() {
    let email = qs('#email p').textContent;
    fetch('/course/history?email=' + email)
      .then(statusCheck)
      .then(res => res.json())
      .then(data => {
        helpPopulate(data);
      })
      .catch(handleError);
  }

  /**
   * check whether this one is complete
   */
  async function checkComplete() {
    fetch('/course/history/complete')
      .then(statusCheck)
      .then(res => res.json())
      .then(data => {
        populateCompleted(data);
      })
      .catch(handleError);
  }

  /**
   * check whether this one is complete
   * @param {Object} data - the required data
   */
  async function populateCompleted(data) {
    if (data.length === 0) {
      return null;
    }
    data.forEach((ele) => {
      let course = ele.course;
      let courseId = course.replace(/\s+/g, '-');
      let parent = id(courseId);
      if (parent) {
        parent.innerHTML = '';
        let para = document.createElement('p');
        para.textContent = 'Successfully completed the course: ' + course;
        parent.appendChild(para);
      } else {
        console.error('No element found with ID:', courseId);
      }
    });
  }

  /**
   * check the permission
   */
  function checkPermision() {
    let input = id('code');
    let code = parseInt(input.value);
    if (code !== '') {
      complete(code);
    }
  }

  /**
   * check whether this one is complete
   * @param {string} code - find the code.
   */
  function complete(code) {
    fetch('/course/history/search?code=' + code)
      .then(statusCheck)
      .then(res => res.text())
      .then(data => {
        markAsComplete(data);
      })
      .catch(handleError);
  }

  /**
   * check whether this one is complete
   * @param {Object} data - the required data
   */
  function markAsComplete(data) {
    const timeOut5 = 3000;
    let datas = data.split(':');
    if (datas[0] === 'successfully completed the course') {

      let para = document.createElement('p');
      para.textContent = data;
      const parent = id(datas[1].replace(/\s+/g, '-'));
      parent.innerHTML = '';
      parent.appendChild(para);
    } else {
      let parent = id('course');
      let para = document.createElement('p');
      para.textContent = 'fail to complete';
      parent.appendChild(para);
      setTimeout(function () {
        parent.removeChild(para);
      }, timeOut5);
    }
  }

  /**
   * help to populate
   * @param {Object} data - the required data
   */
  function helpPopulate(data) {
    let parent = qs('#transaction ol');
    parent.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      let transaction = data[i];
      let email = transaction.email;
      let course = transaction.course;
      let code = transaction.code;
      let status = transaction.status;
      let list = document.createElement('li');
      parent.appendChild(list);
      list.textContent = 'Transaction ' + (i + 1);
      let infoList = [email, course, code, status];
      let infoList2 = ['email: ', 'course: ', 'code: ', 'status: '];
      for (let j = 0; j < infoList.length; j++) {
        let para = document.createElement('p');
        para.textContent = infoList2[j] + infoList[j];
        list.appendChild(para);
      }
    }
  }

  /**
   * This function will be used to change the view from profile to enrollment
   */
  function changeView() {
    id('user-info').classList.toggle('hidden');
    id('course').classList.toggle('hidden');
  }

  /**
   * remove the target course from the enrollment
   * @param {string} target the id of the target course
   * @param {string} course the id of the target course
   */
  function deleteCourse(target, course) {
    id('enrolled-course').removeChild(id(target));
    let para = new FormData();
    console.log(target);
    let target2 = target.replaceAll('-', ' ');
    console.log(target2);
    para.append('course', target2);
    fetch('/course/profile/removecourse/' + course.replaceAll('-', ' '), {
      method: 'POST',
      body: para
    })
      .then(statusCheck)
      .then(res => res.text())
      .catch(handleError);
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
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Logout the page
   */
  function logout() {
    fetch('/logout', { method: 'POST' })
      .then(response => response.text())
      .then(result => {
        console.log(result);
        window.location.href = 'index.html';
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
      const main = id("main");
      main.innerHTML = "";
  }


})();