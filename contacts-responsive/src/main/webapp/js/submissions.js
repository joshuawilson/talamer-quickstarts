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

CONTACTS.namespace('CONTACTS.submissions.submitCreate');
CONTACTS.namespace('CONTACTS.submissions.submitUpdate');
CONTACTS.namespace('CONTACTS.submissions.deleteContact');

/**
 * Listen for and handle the Create, Update, and Delete actions of the app.
 * 
 * @author Joshua Wilson
 */
$(document).ready(function() {
    //Initialize the vars in the beginning so that you will always have access to them.
    var getCurrentTime = CONTACTS.util.getCurrentTime,
        restEndpoint = CONTACTS.app.restEndpoint,
        run;

    /**
     * This is used to transform Form data into JSON.
     */
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
    //Initialize all the AJAX form events.
    run = function () {
        console.log(getCurrentTime() + " [js/submissions.js] (run) - start");
        //Fetches the initial contact data
        CONTACTS.submissions.submitCreate();
        CONTACTS.submissions.submitUpdate();
        CONTACTS.submissions.deleteContact();
        console.log(getCurrentTime() + " [js/submissions.js] (run) - end");
    };
    
    /**
     * Attempts to register a new contact using a JAX-RS POST.  
     */
    CONTACTS.submissions.submitCreate = function() {
        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - start");
        
        $("#contacts-add-form").submit(function(event) {
            console.log(getCurrentTime() + " [js/submissions.js] (submitCreate - submit event) - checking if the form is valid");
            // Ensure that the form has been validated.
            CONTACTS.validation.addContactsFormValidator.form();
            // If there are any validation error then don't process the submit. 
            if (CONTACTS.validation.addContactsFormValidator.valid()){
                console.log(getCurrentTime() + " [js/submissions.js] (submitCreate - submit event) - started");
                event.preventDefault();
                
                // Transform the form fields into JSON.
                // Must pull from the specific form so that we get the right data in case another form has data in it.
                var serializedForm = $("#contacts-add-form").serializeObject();
                console.log(getCurrentTime() + " [js/submissions.js] (submitCreate - submit event) - serializedForm.birthDate = " + serializedForm.birthDate);
                // Turn the object into a String.
                var contactData = JSON.stringify(serializedForm);
                console.log(getCurrentTime() + " [js/submissions.js] (submitCreate - submit event) - contactData = " + contactData);
                
                /* The jQuery XMLHttpRequest (jqXHR) object returned by $.ajax() as of jQuery 1.5 is a superset of
                 *   the browser's native XMLHttpRequest object. For example, it contains responseText and responseXML
                 *   properties, as well as a getResponseHeader() method. When the transport mechanism is something
                 *   other than XMLHttpRequest (for example, a script tag for a JSONP request) the jqXHR object
                 *   simulates native XHR functionality where possible.
                 *
                 *  The jqXHR objects returned by $.ajax() as of jQuery 1.5 implement the Promise interface, giving
                 *   them all the properties, methods, and behavior of a Promise (see Deferred object for more
                 *   information). These methods take one or more function arguments that are called when the
                 *   $.ajax() request terminates. This allows you to assign multiple callbacks on a single request,
                 *   and even to assign callbacks after the request may have completed. (If the request is already
                 *   complete, the callback is fired immediately.)
                 */
                var jqxhr = $.ajax({
                    url: restEndpoint,
                    contentType: "application/json",
//                    dataType: "json",
                    data: contactData,
                    type: "POST"
                }).done(function(data, textStatus, jqXHR) {
                    console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - ajax done");
                    
                    // Reset this flag when the form passes validation. 
                    CONTACTS.validation.formEmail = null;
                    
                    // Clear the form or else the next time you go to add a contact the last one will still be there.
                    $('#contacts-add-form')[0].reset();
                    
                    // Remove errors display as a part of the validation system.
                    $('.invalid').remove();
                    
                    location.href = "index.html";
                    
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    // Remove any errors that are not a part of the validation system.
                    $('.invalid').remove();
                    
                    // Check for server side validation errors.  This should catch the email uniqueness validation.
                    if ((jqXHR.status === 409) || (jqXHR.status === 400)) {
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - error in ajax - " +
                                "Validation error updating contact! " + jqXHR.status);
//                            console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - error in ajax" +
//                                        " - jqXHR = " + jqXHR.status +
//                                        ", textStatus = " + textStatus +
//                                        ", errorThrown = " + errorThrown +
//                                        ", responseText = " + jqXHR.responseText);
                        
                        // Get the contact.
                        var contact = $("#contacts-add-form")[0];
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // We only want to set this flag if there is actual email error.
                        $.each(errorMsg, function(index, val) {
                            if (index === 'email'){
                                // Get the contact email and set it for comparison in the form validation.
                                $.each(contact, function(index, val){
                                    // This will look for an element with the name of 'email' and pull it's value.
                                    if (val.name == "email"){
                                        CONTACTS.validation.formEmail = val.value;
                                        return false;
                                    }
                                });
                            }
                        });
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-add-form", errorMsg);
                        
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - error in ajax - " +
                                "Validation error displayed in the form for the user to fix! ");
                    } else if (jqXHR.status >= 200 && jqXHR.status < 300 || jqXHR.status === 304) {
                        // It should not reach this error as long as the dataType: is not set. Or if it is set to something
                        // like JSON then the Server method must return data.
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - ajax error on 20x with error message: "
                                + errorThrown.message);
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - ajax error because the REST service doesn't return" +
                                "any data and this app expects data.  Fix the REST app or remove the 'dataType:' option from the AJAX call.");
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-add-form", errorMsg);
                        
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - ajax error on 20x - " +
                                "after displayServerSideErrors()");
                    } else {
                        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - error in ajax" +
                                    " - jqXHR = " + jqXHR.status +
                                    ", textStatus = " + textStatus +
                                    ", errorThrown = " + errorThrown +
                                    ", responseText = " + jqXHR.responseText);
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-add-form", errorMsg);
                    }
                });
            }
        });
        console.log(getCurrentTime() + " [js/submissions.js] (submitCreate) - end");
    };
    

    /**
     * Attempts to update a contact using a JAX-RS PUT.  
     */
    CONTACTS.submissions.submitUpdate = function() {
        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - start");
        
        $("#contacts-edit-form").submit(function(event) {
            console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate - submit event) - checking if the form is valid");
            
            // Ensure that the form has been validated.
            CONTACTS.validation.editContactsFormValidator.form();
            // If there are any validation error then don't process the submit. 
            if (CONTACTS.validation.editContactsFormValidator.valid()){
                console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate - submit event) - started");
                event.preventDefault();
                
                // Obtain the contact ID, to use in constructing the REST URI.
                var contactId = $("#contacts-edit-input-id").val();

                // Transform the form fields into JSON.
                // Must pull from the specific form so that we get the right data in case another form has data in it.
                var serializedForm = $("#contacts-edit-form").serializeObject();
                console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate - submit event) - serializedForm.birthDate = " + serializedForm.birthDate);
                // Turn the object into a String.
                var contactData = JSON.stringify(serializedForm);
                console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate - submit event) - contactData = " + contactData);
                
                /* The jQuery XMLHttpRequest (jqXHR) object returned by $.ajax() as of jQuery 1.5 is a superset of
                 *   the browser's native XMLHttpRequest object. For example, it contains responseText and responseXML
                 *   properties, as well as a getResponseHeader() method. When the transport mechanism is something
                 *   other than XMLHttpRequest (for example, a script tag for a JSONP request) the jqXHR object
                 *   simulates native XHR functionality where possible.
                 *
                 *  The jqXHR objects returned by $.ajax() as of jQuery 1.5 implement the Promise interface, giving
                 *   them all the properties, methods, and behavior of a Promise (see Deferred object for more
                 *   information). These methods take one or more function arguments that are called when the
                 *   $.ajax() request terminates. This allows you to assign multiple callbacks on a single request,
                 *   and even to assign callbacks after the request may have completed. (If the request is already
                 *   complete, the callback is fired immediately.)
                 */
                var jqxhr = $.ajax({
                    url: restEndpoint + "/" + contactId,
                    contentType: "application/json",
                    dataType: "json",
                    data: contactData,
                    type: "PUT"
                }).done(function(data, textStatus, jqXHR) {
                    console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - ajax done");
                    
                    // Reset this flag when the form passes validation. 
                    CONTACTS.validation.formEmail = null;
                    
                    // Remove errors display as a part of the validation system.
                    $('.invalid').remove();
                    
                    location.href = "index.html";
                    
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    // Remove any errors that are not a part of the validation system.
                    $('.invalid').remove();
                    
                    // Check for server side validation errors.  This should catch the email uniqueness validation.
                    if ((jqXHR.status === 409) || (jqXHR.status === 400)) {
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - error in ajax - " +
                                "Validation error updating contact! " + jqXHR.status);
//                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - error in ajax" +
//                                    " - jqXHR = " + jqXHR.status +
//                                    ", textStatus = " + textStatus +
//                                    ", errorThrown = " + errorThrown +
//                                    ", responseText = " + jqXHR.responseText);
                        
                        // Get the contact.
                        var contact = $("#contacts-edit-form")[0];
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // We only want to set this flag if there is actual email error.
                        $.each(errorMsg, function(index, val) {
                            if (index === 'email'){
                                // Get the contact email and set it for comparison in the form validation.
                                $.each(contact, function(index, val){
                                    // This will look for an element with the name of 'email' and pull it's value.
                                    if (val.name == "email"){
                                        CONTACTS.validation.formEmail = val.value;
                                        return false;
                                    }
                                });
                            }
                        });
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-edit-form", errorMsg);
                        
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - error in ajax - " +
                                "Validation error displayed in the form for the user to fix! ");
                    } else if (jqXHR.status >= 200 && jqXHR.status < 300 || jqXHR.status === 304) {
                        // It should not reach this error as long as the dataType: is not set. Or if it is set to something
                        // like JSON then the Server method must return data.
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - ajax error on 20x with error message: "
                                + errorThrown.message);
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - ajax error because the REST service doesn't return" +
                                "any data and this app expects data.  Fix the REST app or remove the 'dataType:' option from the AJAX call.");
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-edit-form", errorMsg);
                        
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - ajax error on 20x - " +
                                "after displayServerSideErrors()");
                    } else {
                        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - error in ajax" +
                                    " - jqXHR = " + jqXHR.status +
                                    ", textStatus = " + textStatus +
                                    ", errorThrown = " + errorThrown +
                                    ", responseText = " + jqXHR.responseText);
                        
                        // Extract the error messages from the server.
                        var errorMsg = $.parseJSON(jqXHR.responseText);
                        
                        // Apply the error to the form.
                        CONTACTS.validation.displayServerSideErrors("#contacts-edit-form", errorMsg);
                    }
                });
            }
        });
        console.log(getCurrentTime() + " [js/submissions.js] (submitUpdate) - end");
    };
    
    /**
     * Attempts to delete a contact using a JAX-RS DELETE.  
     */
    CONTACTS.submissions.deleteContact = function() {
        console.log(getCurrentTime() + " [js/submissions.js] (deleteContact) - start");
        
        $("#confirm-delete-button").click(function(event) {
            console.log(getCurrentTime() + " [js/submissions.js] (deleteContact - submit event) - started");
            // You must not preventDefault on a click on a link as that will prevent it from changing pages. 
//            event.preventDefault();

            // Obtain the contact ID, to use in constructing the REST URI.
            var contactId = $("#contacts-edit-input-id").val();
            
            /* The jQuery XMLHttpRequest (jqXHR) object returned by $.ajax() as of jQuery 1.5 is a superset of
             *   the browser's native XMLHttpRequest object. For example, it contains responseText and responseXML
             *   properties, as well as a getResponseHeader() method. When the transport mechanism is something
             *   other than XMLHttpRequest (for example, a script tag for a JSONP request) the jqXHR object
             *   simulates native XHR functionality where possible.
             *
             *  The jqXHR objects returned by $.ajax() as of jQuery 1.5 implement the Promise interface, giving
             *   them all the properties, methods, and behavior of a Promise (see Deferred object for more
             *   information). These methods take one or more function arguments that are called when the
             *   $.ajax() request terminates. This allows you to assign multiple callbacks on a single request,
             *   and even to assign callbacks after the request may have completed. (If the request is already
             *   complete, the callback is fired immediately.)
             */
            var jqxhr = $.ajax({
                url: restEndpoint + "/" + contactId,
                contentType: "application/json",
                type: "DELETE"
            }).done(function(data, textStatus, jqXHR) {
                console.log(getCurrentTime() + " [js/submissions.js] (deleteContact) - ajax done");
                
                // Reset this flag when the form passes validation. 
                CONTACTS.validation.formEmail = null;
                
                // Remove errors display as a part of the validation system. 
                CONTACTS.validation.editContactsFormValidator.resetForm();
                
                // Remove errors display as a part of the validation system.
                $('.invalid').remove();
                
                // Now that it has been deleted return to the main list page.
                location.href = "index.html";
                
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // Remove any errors that are not a part of the validation system.
                $('.invalid').remove();
                
                console.log(getCurrentTime() + " [js/submissions.js] (deleteContact) - error in ajax" +
                        " - jqXHR = " + jqXHR.status +
                        ", textStatus = " + textStatus +
                        ", errorThrown = " + errorThrown +
                        ", responseText = " + jqXHR.responseText);
                
                // Extract the error messages from the server.
                var errorMsg = $.parseJSON(jqXHR.responseText);
                
                // Apply the error to the form.
                CONTACTS.validation.displayServerSideErrors("#contacts-edit-form", errorMsg);
            });
        });
        
        console.log(getCurrentTime() + " [js/submissions.js] (deleteContact) - end");
    };
    
    //Set up each of these event listeners.
    run();
});
