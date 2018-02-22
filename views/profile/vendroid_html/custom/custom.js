// JavaScript Document
jQuery(document).ready(function($) {
    //Put Your Custom Jquery or Javascript Code Here
    //$('body').on('click', 'div', refreshSomething);



    function refreshSomething(e) {
        console.log(e);

        if (!$(e.target).data('refresh')) {
            return;
        }

        if ($(e.target).data('refresh') === 'refreshAndroid') {
            console.log("No update");
        }
        if ($(e.target).data('refresh') === 'refreshiOS') {
            console.log("Updating");
        }
    }
});


function dosth(device) {
	alert('a');
    //console.log($(device).data('ref'));
    $(device).parent().parent().parent().parent().hide();
}