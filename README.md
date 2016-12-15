# hillPager
A simple pager.

Default options:

var defaultOptions = {
            debug:false, // true : show all logs of plugin
            classPager: 'pager', //you can define the class of pager 
            itemToShow: 3, // Item to show x page 
            goToFirst: true, // Btn go to first page 
            goToLast: true, // Btn go to last page 
            next: true, // Btn go to next page 
            prev: true, // Btn go to previous page
            hideButtons:false, //when return 0 items, hide buttons and title
            titleButtons:["<<","<",">",">>"], // << < > >> , if you want to customize titles of btns, if not keep empty
            pageStart: 0, //index of default page start (from 0)
            pageOf: {on:true,"page":"Page","of":"Of"}, //if you want to show page x of x
            ajax: {
                "on":false,
                "action":"/",
                "key_list_response":"list", //key of response list , default (result.LIST)
                "key_count_response":"count", //key of response count , default (result.COUNT)
                "start":{"on":true,"name":"start"}, //if you want to pass start to your service , "name": name of param
                "limit":{"on":true,"name":"limit"}, //if you want to pass limit to your service , "name": name of param
                "data":{},
                "callback":function(){
                    log('Callback Default AJAX Request custom');
                }
            }, 
            json: {
                "on":true,
                "action":"test.json", //path of json to load 
                "key_list_response":"list", //key of response list , default (result.LIST)
                "key_count_response":"count", //key of response count , default (result.COUNT)
                "callback":function(){
                    log('Callback Default JSON Request custom');
                }
            }
        };
