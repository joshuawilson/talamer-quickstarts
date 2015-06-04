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

CONTACTS.namespace('CONTACTS.app.getContacts');
CONTACTS.namespace('CONTACTS.app.buildContactList');
CONTACTS.namespace('CONTACTS.app.restEndpoint');
CONTACTS.namespace('CONTACTS.app.filterList');

CONTACTS.app.restEndpoint = 'rest/contacts';

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
    
    console.log(getCurrentTime() + " [js/app.js] (document) - start");
    
    // This is called on page load and by the CONTACTS.submissions
    // Uses JAX-RS GET to retrieve current contact list. 
    CONTACTS.app.getContacts = function () {
        console.log(getCurrentTime() + " [js/app.js] (getContacts) - start");
        var jqxhr = $.ajax({
            url: restEndpoint,
            cache: false,
            type: "GET"
        }).done(function(data, textStatus, jqXHR) {
            console.log(getCurrentTime() + " [js/app.js] (getContacts) - succes on ajax call");
            CONTACTS.app.buildContactList(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(getCurrentTime() + " [js/app.js] (getContacts) - error in ajax - " +
                        " - jqXHR = " + jqXHR.status +
                        " - textStatus = " + textStatus +
                        " - errorThrown = " + errorThrown);
        });
        console.log(getCurrentTime() + " [js/app.js] (getContacts) - end");
    };

    // This is called by CONTACTS.app.getContacts.
    // Display contact list on page one.
    CONTACTS.app.buildContactList = function (contacts) {
        console.log(getCurrentTime() + " [js/app.js] (buildContactList) - start");
        var contactList = "",
            contactDetailList = "";
        
        // The data from the AJAX call is not sorted alphabetically, this will fix that.
        contacts.sort(function(a,b){
              var aName = a.firstName.toLowerCase() + a.lastName.toLowerCase();
              var bName = b.firstName.toLowerCase() + b.lastName.toLowerCase(); 
              return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        });
        
        // Pull the info out of the Data returned from the AJAX request and create the HTML to be placed on the page.
        $.each(contacts, function(index, contact) {
            // Create the HTML for the List only view.
            contactList = contactList.concat(
                "<li id=list-contact-ID-" + contact.id.toString() + " class=contacts-list-item >" +
                    "<a href='contacts-edit.html?id=" + contact.id.toString() + "' >" + contact.firstName.toString() + " " + contact.lastName.toString() + "</a>" +
                "</li>");
            // Create the HTML for the Detailed List view.
            contactDetailList = contactDetailList.concat(
                "<li id=detail-contact-ID-" + contact.id.toString() + " class=contacts-detail-list-item >" +
                    "<a href='contacts-edit.html?id=" + contact.id.toString() + "' >" + contact.firstName.toString() + " " + contact.lastName.toString() +
                    "<div class='detialedList'>" +
                        "<p><strong>" + contact.email.toString() + "</strong></p>" +
                        "<p>" + contact.phoneNumber.toString() + "</p>" +
                        "<p>" + contact.birthDate.toString() + "</p>" +
                    "</div>"+ "</a>"  +
                 "</li>");
        });
        
        // Check if it is the List view or Detailed view and add the contacts to the list.
        if ( $('#contacts-display-listview').hasClass('contacts-list')) {
            console.log(getCurrentTime() + " [js/app.js] (#contacts-display-listview) - append.listview - start");
            $('#contacts-display-listview').append(contactList);
            console.log(getCurrentTime() + " [js/app.js] (#contacts-display-listview) - append.listview - end");
        } 
        
        // Check if it is the List view or Detailed view and add the contacts to the list.
        if ( $('#contacts-display-detail-listview').hasClass('contacts-list')) {
            console.log(getCurrentTime() + " [js/app.js] (#contacts-display-detail-listview) - append.listview - start");
            $('#contacts-display-detail-listview').append(contactDetailList);
            console.log(getCurrentTime() + " [js/app.js] (#contacts-display-detail-listview) - append.listview - end");
        } 
        
        console.log(getCurrentTime() + " [js/app.js] (buildContactList) - end");
        // Add in a line to visually see when we are done.
        console.log("-----------------------------List Page---------------------------------------");
    };
    
    /**
     * Take the list of contacts and the filter string and if the string is found reduce the list to match
     */
    CONTACTS.app.filterList = function() {
    	
    	$('.filter-form').submit(function(event) {
    		event.preventDefault();
			var value = $(this).find('input').val().toLowerCase();
	        var list = $('.contacts-list li');
	
	        list.hide();
	        list.filter(function() {
	            return $(this).text().toLowerCase().indexOf(value) > -1;
	        }).show();
    	});
        
    };
    
    // Clear the Search field and restore all the list items.
    $('#clear_input').click(function () {
        $('.filter-form').find('input').focus();
        $('.filter-form').find('input').val('');
        $('.contacts-list li').show();
    });

    // Fetches the initial Contact data.
    CONTACTS.app.getContacts();
    CONTACTS.app.filterList();

    console.log(getCurrentTime() + " [js/app.js] (document) - end");
});


