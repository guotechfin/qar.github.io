#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var child_process = require('child_process');

var CWD = path.resolve(__filename, '..');
var POSTS_PATH = path.resolve(CWD, './_posts');

var cmd = process.argv[2];
console.log('DEBUG: execute command " ' + cmd + ' "');

switch (cmd) {
  case 'new':
    createNewPost();
    break;
  case 'deploy':
    deploy();
    break;
  default:
    handleUnknownCMD();
    break;
}

function createNewPost() {
  var dateString = moment().format('YYYY-MM-DD'); 
  var postName = 'untitled-post';
  var postfix = 'md';

  var postFullName = dateString + '-' + postName + '.' + postfix;
  var postFullPath = path.resolve(POSTS_PATH, postFullName);

  var postConfig = {
    layout: 'post',
    title: 'Untitled Post',
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    categories: []
  };

  var template = [
    '---',
    'layout     : ' + postConfig.layout,
    'title      : ' + postConfig.title,
    'date       : ' + postConfig.date,
    'categories : ' + postConfig.categories,
    '---'
  ].join('\n') + '\n';

  fs.writeFileSync(postFullPath, template);
  var vim = child_process.spawn('vim',[postFullPath], {stdio: 'inherit'});
  vim.on('close', function(code) {
    if (code === 0) {
      child_process.exec("git add " + postFullPath, function(err, stdout, stderr) { });
    }
  });
}

function handleUnknownCMD() {
  console.log('Unknown command');
  console.log('Try "power new" or "power deploy"');
}

function deploy() {
  // Commit
  child_process.exec("git commit -m '[Power] Automaticlly updated at '" + moment().format(), function(err, stdout, stderr) {
    // Push 
    child_process.exec("git push origin source", function(err, stdout, stderr) {
      // Go to _site
      console.log('Building ...');
      child_process.exec("jekyll build", function(err, stdout, stderr) {
        process.chdir('./_site');
        child_process.exec("git add -A", function(err, stdout, stderr) {
          child_process.exec("git commit -m '[Power] Automaticlly commited at '" + moment().format(), function(err, stdout, stderr) {
            child_process.exec("git push origin master", function(err, stdout, stderr) {
              process.chdir('..');
              console.log('Blog updated successfully');
            });
          });
        });
      });
    });
  });
}

