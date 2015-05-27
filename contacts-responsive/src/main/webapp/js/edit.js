/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

CONTACTS.namespace('CONTACTS.edit.getContactById');
CONTACTS.namespace('CONTACTS.edit.buildContactDetail');

/**
 * It is recommended to bind to this event instead of DOM ready() because this will work regardless of whether 
 * the page is loaded directly or if the content is pulled into another page as part of the Ajax navigation system.
 * 
 * The first thing you learn in jQuery is to call code inside the $(document).ready() function so everything 
 * will execute as soon as the DOM is loaded. However, in jQuery Mobile, Ajax is used to load the contents of 
 * each page into the DOM as you navigate, and the DOM ready handler only executes for the first page. 
 * To execute code whenever a new page is loaded and created, you can bind to the pagecreate event. 
 * 
 * 
 * These functions perform the GET. They display the list, detailed list, and fill in the update form.
 * 
 * @author Joshua Wilson
 */
$(document).ready (function(mainEvent) {
    //Initialize the vars in the beginning so that you will always have access to them.
    var getCurrentTime = CONTACTS.util.getCurrentTime,
        restEndpoint = CONTACTS.app.restEndpoint;
    
    console.log(getCurrentTime() + " [js/edit.js] (document) - start");
    
    // This is called by the on click event list above.
    // Retrieve employee detail based on employee id.
    CONTACTS.edit.getContactById = function (contactID) {
        console.log(getCurrentTime() + " [js/edit.js] (getContactById) - start");
        console.log(getCurrentTime() + " [js/edit.js] (getContactById) - contactID = " + contactID);
    
        var jqxhr = $.ajax({
            url: restEndpoint + "/" + contactID.toString(),
            cache: false,
            type: "GET"
        }).done(function(data, textStatus, jqXHR) {
            console.log(getCurrentTime() + " [js/edit.js] (getContactById) - success on ajax call");
            CONTACTS.edit.buildContactDetail(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(getCurrentTime() + " [js/edit.js] (getContactById) - error in ajax" +
                        " - jqXHR = " + jqXHR.status +
                        " - textStatus = " + textStatus +
                        " - errorThrown = " + errorThrown);
        });
        console.log(getCurrentTime() + " [js/edit.js] (getContactById) - end");
    };
    
    // This is called by CONTACTS.edit.getContactById.
    // Display contact detail for editing on the Edit page.
    CONTACTS.edit.buildContactDetail = function(contact) {
        console.log(getCurrentTime() + " [js/edit.js] (buildContactDetail) - start");
        
        // The intl-Tel-Input plugin stores the lasted used country code and uses it to predetermin the flag to be 
        // displayed. So we remove the plugin before the data gets loaded in the Edit form and then initialize it after. 
        $("#contacts-edit-input-tel").intlTelInput("destroy");
        
        // Put each field value in the text input on the page.
        $('#contacts-edit-input-firstName').val(contact.firstName);
        $('#contacts-edit-input-lastName').val(contact.lastName);
        $('#contacts-edit-input-tel').val(contact.phoneNumber);
        $('#contacts-edit-input-email').val(contact.email);
        $('#contacts-edit-input-date').val(contact.birthDate);
        $('#contacts-edit-input-id').val(contact.id);
        
        // The intl-Tel-Input plugin needs to be initialized everytime the data gets loaded into the Edit form so that 
        // it will correctly validate it and display the correct flag.
        $('#contacts-edit-input-tel').intlTelInput({nationalMode:false});
        
        console.log(getCurrentTime() + " [js/edit.js] (buildContactDetail) - end");
        // Add in a line to visually see when we are done.
        console.log("-----------------------------Update Page---------------------------------------");
    };
    
    console.log(getCurrentTime() + " [js/edit.js] (Get ID and fill in Edit form) - start");
    
    CONTACTS.edit.getContactById(CONTACTS.util.getQueryVariable("id"));
    
    console.log(getCurrentTime() + " [js/edit.js] (Get ID and fill in Edit form) - end");
        
    console.log(getCurrentTime() + " [js/edit.js] (document) - end");
});


