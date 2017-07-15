// YOUR CODE HERE:
var app = {
  init: function() {
    this.bindEvents();
    this.render();
  },
  render: function() { 
    this.clearMessages();
    this.fetch();
  },
  bindEvents: function() {
    this.handleUsernameClick();
    this.handleRoomChange();
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
      data: {'order': '-createdAt', 'limit': '100'},
      contentType: 'application/json',
      success: function (data) {
        app.renderMessages(data.results);
        app.renderRooms(data.results);
        app.filterRooms($('#roomSelect').val());
        util.store('messages', data.results);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, 
  clearMessages: function() {
    $('#chats ul').empty();
    $('#roomSelect').empty();
  },
  renderMessage: function(message) {
    if (!message.roomname) {
      message.roomname = '';
    }
    var $message = $(`<li class="${message.roomname.split(' ').join('-')}"><span class='username'>${message.username}</span>: ${message.text}</li>`);
    $('#chats ul').append($message);
  }, 
  handleUsernameClick: function() {
    $('.username').on('click', function() {});
  }, 
  handleRoomChange: function() {
    var app = this;
    $('#roomSelect').on('change', function() {
      app.filterRooms($(this).val());
      $('#send input').focus();
    });
  },
  handleSubmit: function() {
    var app = this;
    $('#send .submit').on('click', function() {
      // craft message obj
      var message = {
        // search for the inputted text
        username: window.location.search.split('=')[1],
        text: $('#send input').val(),
        roomname: $('#roomSelect option:selected').text()
      };
      
      //$('#chats ul').prepend(message);
      // make the AJAX call 
      app.send(message);
      app.clearMessages();
      $('#chats ul').ready(function() {
        app.fetch();
      });
      
      // clear input 
      $('#send input').val('');
    });
  }, 
  renderMessages: function(messagesArr) {
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
  },
  renderRooms: function(messagesArr) {
    var results = messagesArr.reduce(function(roomArr, message) {
      if (message.roomname !== undefined && message.roomname !== null && (message.roomname).trim() !== '') {
        if (roomArr.indexOf(message.roomname) < 0) {
          message.roomname = util.safeTagsReplace(message.roomname);
          roomArr.push(message.roomname);
        }
      }
      return roomArr;
    }, [])
    .map(roomname => `<option value="${roomname.split(' ').join('-')}">${roomname}</option>`)
    .join('');

    
    $('#roomSelect').append(results);
  },
  filterRooms: function(room) {
    // filter messages to appear when room is clicked
    $(`.${room}`).show();
    $(`#chats li:not(.${room})`).hide();
  }
  
};