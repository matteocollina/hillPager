/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(window).load(function() {
    //console.log('Page is Loaded');
});


$(document).ready(function () {
    
    
    //Example
    $('.hillPager').hillPager({
        debug:true,
        classPager: 'pager', //class of pager 
        itemToShow: 10, // Item to show x page 
        goToFirst: true, // Btn go to first page 
        goToLast: true, // Btn go to last page 
        next: true, // Btn go to next page 
        prev: true, // Btn go to previous page 
        titleButtons:["Primo","Precedente","Prossimo","Ultimo"],
        hideButtons:false,
        pageOf: {on:true,"page":"Pagina","of":"di"},
        ajax: {
                "on":false,
        }, 
        json: {
                "on":true,
                "action":"test.json", //path of json to load 
                "key_list_response":"list_test",
                "key_count_response":"count_test",
                "callback":function(pager,data){
                    $('.loader-ajax').fadeOut('slow');
                    
                    pager.html('');
                    var html = '';
                    for(var i=0;i<data.length;i++){
                        var it = data[i];
                        html+="<p>"+it.title+"</p>";
                    }
                    pager.append(html);
                }
        }
    });
    
   
   
   
   
   

});


