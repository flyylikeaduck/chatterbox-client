// YOUR CODE HERE:
var app = {
  init: function() {
    this.handleUsernameClick();
    this.handleSubmit();
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {

    var app = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.renderMessages(data.results);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, 
  clearMessages: function() {
    $('#chats').empty();
  },
  renderMessage: function(message) {
    var $message = $(`<div> <span class='username'> ${message.username} </span>: ${message.text} </div>`);
    $('#chats').append($message);
  }, 
  renderRoom: function(container) {
    $('#roomSelect').append(`<option value='${container}'> ${container} </option>`);
  }, 
  handleUsernameClick: function() {
    $('.username').on('click', function() {});
  }, 
  handleSubmit: function() {
    $('#send .submit').on('click', function() {});
  }, 
  renderMessages: function(messagesArr) {
    debugger;
    messagesArr.forEach(message => {
      if (message.username === undefined || message.username === null) {
        message.username = 'no name';
      } 
      if (message.text === undefined || message.text === null) {
        message.text = '';
      }

      message.username = util.safeTagsReplace(message.username);
      message.text = util.safeTagsReplace(message.text);
      this.renderMessage(message);
    });
  }
};