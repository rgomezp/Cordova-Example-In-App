/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    paused: false
};

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});

  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal.setLocationShared(false);

  window.plugins.OneSignal
    .startInit("77e32082-ea27-42e3-a898-c72e141824ef")
    .handleNotificationOpened(notificationOpenedCallback)
    .handleInAppMessageClicked((result)=>{console.log("clicked!!", JSON.stringify(result))})
    .endInit();

   window.plugins.OneSignal.pauseInAppMessages(app.paused);

  window.plugins.OneSignal.promptLocation();

    document.getElementById('sendTags').addEventListener('click', sendTags);
    document.getElementById('getTags').addEventListener('click', getTags);
    document.getElementById('printSubscription').addEventListener('click', printSubscription);

    document.getElementById('add_trigger_button').addEventListener('click', addTrigger);
    document.getElementById('remove_trigger_button').addEventListener('click', removeTrigger);
    document.getElementById('get_trigger_button').addEventListener('click', getTrigger);

    document.getElementById('pauseIAM').addEventListener('click', ()=>{
      const paused = !app.paused;
      console.log("will pause:", paused);
      window.plugins.OneSignal.pauseInAppMessages(paused);
      app.paused = paused;
    });
}, false);

function sendTags(){
  window.plugins.OneSignal.sendTags({key1:"test", isAggie:"true"})
}

function getTags(){
  window.plugins.OneSignal.getTags(function(json){
    console.log(JSON.stringify(json));
    document.getElementById('tags').innerHTML = "Tags: "+JSON.stringify(json);
  });
}

function printSubscription(){
  window.plugins.OneSignal.getPermissionSubscriptionState((status)=>{
    document.getElementById('subscription').innerHTML = "Subscription State: "+status.subscriptionStatus.subscribed;
    document.getElementById('userId').innerHTML = "userId: "+status.subscriptionStatus.userId;
  });
}

function addTrigger(){
    var triggerKey = document.getElementById('add_trigger_key').value;
    var triggerValue = document.getElementById('add_trigger_value').value;
    console.log("Adding trigger key:", triggerKey, "with trigger value:", triggerValue);
    window.plugins.OneSignal.addTrigger(triggerKey, triggerValue);
    
    checkTrigger(triggerKey);
}

function checkTrigger(triggerKey){
    window.plugins.OneSignal.getTriggerValueForKey(triggerKey, function (triggerValue) {
       console.log(triggerKey, triggerValue);
    });
}

function removeTrigger(){
    var triggerKey = document.getElementById('remove_trigger_key').value;
    console.log("Removing trigger with key:", triggerKey);
    window.plugins.OneSignal.removeTriggerForKey(triggerKey);
    
    checkTrigger(triggerKey);
}

function getTrigger(){
    var triggerKey = document.getElementById('get_trigger_key').value;
    checkTrigger(triggerKey);
}

app.initialize();
