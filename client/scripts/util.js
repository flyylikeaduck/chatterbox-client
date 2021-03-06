var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '.': '2e'
};

var util = {
  uuid: function() {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },
  toBase64: function (fileElement, cb) {
    var file = fileElement.files[0];
    var reader = new FileReader();

    reader.onloadend = e => cb(file.name, e.target.result);

    reader.readAsDataURL(file);
  },
  pluralize: function (count, word) {
    return count === 1 ? word : word + 's';
  },
  store: function (namespace, data) {
    if (arguments.length > 1) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      var store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    }
  },
  replaceTag: function(tag) {
    return tagsToReplace[tag] || tag;
  },
  safeTagsReplace: function(str) {
    return str.replace(/[&<>]/g, this.replaceTag);
  },
  safeClassNames: function(str) {
    return str.replace('.', 'period').replace('#', 'hash').split(' ').join('-');
  }
};