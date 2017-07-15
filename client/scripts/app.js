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
    this.handleShowAllRooms();
    this.handleCreateRoom();
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
        var currentRoom = localStorage.currentRoom.replace(/"/g, '');
        app.filterRooms(currentRoom);
        util.store('messages', data.results);
        $('#roomSelect').find(`option[value="${currentRoom}"]`).attr('selected', 'selected').change();
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
    var $message = $(`<li class="${message.roomname.replace('.', 'period').replace('#', 'hash').split(' ').join('-')}"><span class='username'>${message.username}</span>: ${message.text}</li>`);
    $('#chats ul').append($message);
  }, 
  handleUsernameClick: function() {
    $('.username').on('click', function() {});
  }, 
  handleRoomChange: function() {
    var app = this;
    $('#roomSelect').on('change', function() {
      var room = $(this).val();
      app.filterRooms(room);
      util.store('currentRoom', room);
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
      
      if (message.roomname === undefined || message.roomname === null) {
        message.roomname = '';
      }
      

      message.username = util.safeTagsReplace(message.username);
      message.text = util.safeTagsReplace(message.text);
      message.roomname = util.safeTagsReplace(message.roomname);
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
    .sort()
    .map(roomname => `<option value="${roomname.replace('.', 'period').replace('#', 'hash').split(' ').join('-')}">${roomname}</option>`)
    .join('');
    
    $('#roomSelect').append(results);
  },
  filterRooms: function(room) {
    // filter messages to appear when room is clicked
    $(`.${room}`).show();
    $(`#chats li:not(.${room})`).hide();
  },
  
  // see all chats (maybe button?)
  handleShowAllRooms: function() {
    $('.showAll').on('click', function() {
      $('#chats li').show();
    });
  },
  // create new room button  with prompt
  handleCreateRoom: function() {
    var app = this;
    $('.createRoom').on('click', function() {
      var room = prompt('What is the room name?');
      // set new room as selected room
      $('#roomSelect').prepend(`<option selected value="${room.split(' ').join('-')}">${room}</option>`);
      
      //app.setSelectedRoom(room);
      util.store('currentRoom', room);
      // window.location.search += `&room=${room}`;
    });
  }
  // setSelectedRoom: function(room) {
  //   $('#roomSelect').find(`option[value="${room}"]`).attr('selected', 'selected').change();
  // }
  
  
  // add our submission with that new roomname
  
  
  // click userName and add friend
  
  // display all messages sent by friends in bold (or some other indicator --- <3 symbol?)
  
  

  
};