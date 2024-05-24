/*
 * Name: Jiahao He, Bochao Yin
 * Date: 12/12/2023
 * Section: CSE 154 AD
 *
 * This is the js file for sign-in page
 */
"use strict";
(function () {
  window.addEventListener("load", init);

  let inputEmail;

  /**
   * sets up necessary functionality when page loads
   */
  function init() {
    loadUsername();
    id('sign-in').addEventListener('click', function (event) {
      event.preventDefault();
      signIn()
        .then(userInfo => {
          const data = userInfo;
          displayStatus(data);
        });
    });
  }

  /**
   * reflect the information
   * @param {JSON} info the required information;
   */
  function showInfo(info) {
    id('home').classList.add('hidden');
    id('information').classList.remove('hidden');
    qs('#information p').textContent = info;
    qs('#information p').classList.add('showInfo');
  }

  /**
   * reflect the information
   * @param {JSON} data the user data;
   */
  function displayStatus(data) {
    const timeOut2 = 2000;
    if (data === 'Password is not right') {
      showInfo(data);
      setTimeout(function () {
        window.location.href = 'sign-in.html';
      }, timeOut2);
    } else if (data === 'Sorry you do not have an account') {
      showInfo(data);
      setTimeout(function () {
        window.location.href = "sign-up.html";
      }, timeOut2);
    } else if (data === 'Successfully Logged in!') {
      showInfo(data);
      if (inputEmail === localStorage.getItem('savedUsername')) {
        setTimeout(function () {
          window.location.href = "profile.html";
        }, timeOut2);
      } else {
        let save = helper();
        save[0].addEventListener('click', function () {
          saveUsername(inputEmail);
          window.location.href = 'profile.html';
        });
        save[1].addEventListener('click', function () {
          window.location.href = 'profile.html';
        });
      }
    }
  }

  /**
   * help this function.
   * @return {list} return the data.
   */
  function helper() {
    let save = document.createElement('button');
    save.textContent = 'save';
    let no = document.createElement('button');
    no.textContent = 'no';
    let para = document.createElement('p');
    para.textContent = 'Do you want to save your email?';
    id('information').appendChild(para);
    id('information').appendChild(save);
    id('information').appendChild(no);
    return [save, no];
  }

  /**
   * sign in functionality;
   * @return {JSON} return the data.
   */
  function signIn() {
    let email = id('email').value;
    inputEmail = email;
    let password = id('password').value;
    return fetch('/course/signin/' + email + '/' + password)
      .then(statusCheck)
      .then(res => res.text())
      .then(data => {
        return data;
      })
      .catch(handleError);
  }

  /**
   * reflect the information
   * @param {string} email the user email;
   */
  function saveUsername(email) {
    localStorage.setItem('savedUsername', email);
  }

  /**
   * load the user name;
   */
  function loadUsername() {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      id('email').value = savedUsername;
    }
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
})();