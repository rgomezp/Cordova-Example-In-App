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
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },

    paused: false
};

// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});

    var notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
        .startInit("77e32082-ea27-42e3-a898-c72e141824ef")
        .inFocusDisplaying(1)
        .handleNotificationOpened(notificationOpenedCallback)
        .handleInAppMessageClicked((result) => {
            console.log("clicked!!", JSON.stringify(result))
        })
        .endInit();

    window.plugins.OneSignal.pauseInAppMessages(true);
    window.plugins.OneSignal.setLocationShared(false);

    document.getElementById('sendTags').addEventListener('click', sendTags);
    document.getElementById('getTags').addEventListener('click', getTags);
    document.getElementById('printSubscription').addEventListener('click', printSubscription);
    document.getElementById('postNotification').addEventListener('click', postNotification);

    document.getElementById('set_external_user_id_button').addEventListener('click', setExternalUserId);
    document.getElementById('remove_external_user_id_button').addEventListener('click', removeExternalUserId);

    document.getElementById('add_trigger_button').addEventListener('click', addTrigger);
    document.getElementById('remove_trigger_button').addEventListener('click', removeTrigger);
    document.getElementById('get_trigger_button').addEventListener('click', getTrigger);

    document.getElementById('send_outcome_button').addEventListener('click', sendOutcome);
    document.getElementById('send_unique_outcome_button').addEventListener('click', sendUniqueOutcome);
    document.getElementById('send_outcome_with_value_button').addEventListener('click', sendOutcomeWithValue);

    document.getElementById('pauseIAM').addEventListener('click', () => {
        const paused = !app.paused;
        console.log("will pause:", paused);
        window.plugins.OneSignal.pauseInAppMessages(paused);
        app.paused = paused;
    });
}, false);

function sendTags() {
    window.plugins.OneSignal.sendTags({key1: "test", isAggie: "true"})
}

function getTags() {
    window.plugins.OneSignal.getTags(function (json) {
        console.log(JSON.stringify(json));
        document.getElementById('tags').innerHTML = "Tags: " + JSON.stringify(json);
    });
}

function printSubscription() {
    window.plugins.OneSignal.getPermissionSubscriptionState((status) => {
        document.getElementById('subscription').innerHTML = "Subscription State: " + status.subscriptionStatus.subscribed;
        document.getElementById('userId').innerHTML = "userId: " + status.subscriptionStatus.userId;
    });
}

function postNotification() {
    window.plugins.OneSignal.getPermissionSubscriptionState((status) => {
        let notificationJson = {
            "contents": {"en" : "Test message"},
            "": "",
            "include_player_ids": [status.subscriptionStatus.userId]
        };
        window.plugins.OneSignal.postNotification(notificationJson,
            (result) => {
                console.log("NOTIFICATION POST SUCCESS");
            },
            (error) => {
                console.log("NOTIFICATION POST ERROR");
            }
        );
    });
}

function setExternalUserId() {
    var externalUserId = document.getElementById('external_user_id').value;
    window.plugins.OneSignal.setExternalUserId(externalUserId, (results) => {
        console.log('Results of setting external user id: ' + JSON.stringify(results));
    });
}

function removeExternalUserId() {
    window.plugins.OneSignal.removeExternalUserId((results) => {
        console.log('Results of removing external user id: ' + JSON.stringify(results));
    });
}

function addTrigger() {
    var triggerKey = document.getElementById('add_trigger_key').value;
    var triggerValue = document.getElementById('add_trigger_value').value;
    console.log("Adding trigger key:", triggerKey, "with trigger value:", triggerValue);
    window.plugins.OneSignal.addTrigger(triggerKey, triggerValue);

    checkTrigger(triggerKey);
}

function checkTrigger(triggerKey) {
    window.plugins.OneSignal.getTriggerValueForKey(triggerKey, function (triggerValue) {
        console.log(triggerKey, triggerValue);
    });
}

function removeTrigger() {
    var triggerKey = document.getElementById('remove_trigger_key').value;
    console.log("Removing trigger with key:", triggerKey);
    window.plugins.OneSignal.removeTriggerForKey(triggerKey);

    checkTrigger(triggerKey);
}

function getTrigger() {
    var triggerKey = document.getElementById('get_trigger_key').value;
    checkTrigger(triggerKey);
}

function sendOutcome() {
    var outcomeName = document.getElementById('send_outcome_name').value;
    window.plugins.OneSignal.sendOutcome(outcomeName, function (response) {
        console.log("Successfully sent normal outcome event!");
        printOutcomeEvent(response);
    });
}

function sendUniqueOutcome() {
    var uniqueOutcomeName = document.getElementById('send_unique_outcome_name').value;
    window.plugins.OneSignal.sendUniqueOutcome(uniqueOutcomeName, function (response) {
        console.log("Successfully sent unique outcome event!");
        printOutcomeEvent(response);
    });
}

function sendOutcomeWithValue() {
    var outcomeName = document.getElementById('send_outcome_with_value_name').value;
    var outcomeValue = document.getElementById('send_outcome_with_value_value').value;
    window.plugins.OneSignal.sendOutcomeWithValue(outcomeName, outcomeValue, function (response) {
        console.log("Successfully sent outcome event with value!");
        printOutcomeEvent(response);
    });
}

function printOutcomeEvent(response) {
    console.log(response.session + "\n" +
    response.notification_ids + "\n" +
    response.id + "\n" +
    response.timestamp + "\n" +
    response.weight);
}

app.initialize();
