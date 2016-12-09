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
        classPager: 'pager', //class of pager 
        itemToShow: 3, // Item to show x page 
        goToFirst: true, // Btn go to first page 
        goToLast: true, // Btn go to last page 
        next: true, // Btn go to next page 
        prev: true, // Btn go to previous page 
        ajax: {
                "on":false,
        }, 
        json: {
                "on":true,
                "action":"test.json", //path of json to load 
                "callback":function(pager,data){
                    console.log('Callback JSON Request custom');
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
        /*
        onChangePage: function (page,itemToShow,callback) {            
            // example call url 
            var start = page * itemToShow,
                limit = itemToShow;
                        
            console.log('onChangePage page : ' + page + ' | start : '+start + ' limit:'+limit);
    
            // example call
            $.getJSON("test.json").success(function (result) {
                // example success
                $('.loader-ajax').fadeOut('slow');
                var list = [];
                $.each(result.list, function (i, field) {
                    if (i >= parseInt(start) && i <= parseInt(limit)) {
                        list.push(field);
                    }
                });
                console.dir(list);
                //Inserisci i dati nel html + fetch 
                callback(list,page);
            });
        }
        */
    });
    
   
   
   
   
   

});


