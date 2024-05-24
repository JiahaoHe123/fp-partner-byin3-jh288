/*
 * Name: Jiahao He, Bochao Yin
 * Date: 12/12/2023
 * Section: CSE 154 AD
 *
 * This is the js file for the sign-up page
 */
"use strict";

(function () {
  window.addEventListener("load", init);

  /**
   * sets up necessary functionality when page loads
   */
  function init() {
    const timeOut1 = 2000;
    id("sign-up").addEventListener('click', function (event) {
      event.preventDefault();
      signUp()
        .then(userInfo => {
          const data = userInfo;
          if (data === 'You already have an account!') {
            showInfo(userInfo);
            setTimeout(function () {
              window.location.href = 'sign-in.html';
            }, timeOut1);
          } else {
            showInfo(userInfo);
            setTimeout(function () {
              window.location.href = "profile.html";
            }, timeOut1);
          }
        });
    });
    id('password').addEventListener('input', checkPassword);
    id('confirm-password').addEventListener('input', checkSame);
  }

  /**
   * sign up functionality;
   * @return {JSON} return the data.
   */
  function signUp() {
    let email = id('email').value;
    let userName = id('username').value;
    let password = id('password').value;
    let password2 = id('confirm-password').value;
    if (password === password2) {
      let para = new FormData();
      para.append('email', email);
      para.append('Username', userName);
      para.append('Password', password);
      return fetch('/course/signup', {
        method: 'POST',
        body: para
      })
        .then(statusCheck)
        .then(res => res.text())
        .then(data => {
          return data;
        })
        .catch(handleError);
    }
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
   * check whether those two are the same;
   */
  function checkSame() {
    let password = id('password').value;
    let password2 = id('confirm-password').value;
    if (password !== password2) {
      id('confirm-password').classList.add('red');
      id('sign-up').disabled = true;
    } else if (password === password2) {
      id('confirm-password').classList.remove('red');
      id('sign-up').disabled = false;
    }
  }

  /**
   * check whether password is nice.
   */
  function checkPassword() {
    const length1 = 8;
    let password = id('password').value;
    if (password.length < length1 && password > 0) {
      id('note').textContent = "The password should contain at least 8 characters!";
      id('sign-up').disabled = true;
    } else {
      id('note').textContent = '';
      id('sign-up').disabled = false;
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