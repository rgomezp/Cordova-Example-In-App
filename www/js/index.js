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
    }
};

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("706eae1b-7c2c-4e92-907d-c90dc6416a63")
    .handleNotificationOpened(notificationOpenedCallback)
    .handleInAppMessageClicked((result)=>{console.log("clicked!", result)})
    .endInit();

    document.getElementById('sendTags').addEventListener('click', sendTags);
    document.getElementById('getTags').addEventListener('click', getTags);
    document.getElementById('printSubscription').addEventListener('click', printSubscription);
    document.getElementById('trig1').addEventListener('click', addTrigger1);
    document.getElementById('trig2').addEventListener('click', addTrigger2);
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

function addTrigger1(){
  window.plugins.OneSignal.addTrigger("trig1", "true");
}

function addTrigger2(){
  window.plugins.OneSignal.addTrigger("trig2", "true");
}

app.initialize();