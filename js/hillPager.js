/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * All rights reserved : Matteo Collina
 * Linkedin: https://it.linkedin.com/in/matteo-collina-98ab73ab
 */


(function ($) {
    $.fn.hillPager = function (pagerOptions) {
        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).hillPager(pagerOptions);
            });
            return this;
        }

        // SETUP private variabls;
        var pagers = this;

        // setup options
        var defaultOptions = {
            classPager: 'pager', //you can define the class of pager 
            itemToShow: 3, // Item to show x page 
            maxBtnToShow : 2, //Max quantity of button showed
            goToFirst: true, // Btn go to first page 
            goToLast: true, // Btn go to last page 
            next: true, // Btn go to next page 
            prev: true, // Btn go to previous page 
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
                    console.log('Callback Default AJAX Request custom');
                }
            }, 
            json: {
                "on":true,
                "action":"test.json", //path of json to load 
                "key_list_response":"list", //key of response list , default (result.LIST)
                "key_count_response":"count", //key of response count , default (result.COUNT)
                "callback":function(){
                    console.log('Callback Default JSON Request custom');
                }
            }
        };
        var options = $.extend({}, defaultOptions, pagerOptions);

        // SETUP private functions;
        var intialize = function () {
            console.log('Init hillPager');
            pagers.changePage();
            return pagers;
        };
        
        //TRUE : Ajax Request - FALSE : Json Get
        var isAjax = function(){
            return pagers.getOptions().ajax.on;
        };
        var isJson = function(){
            return pagers.getOptions().json.on;
        };
        var getAction = function(){
            return isAjax() ? pagers.getOptions().ajax.action 
                            : pagers.getOptions().json.action;
        };
        var getDataAjax = function(start,limit){
            var data = JSON.parse(JSON.stringify(pagers.getOptions().ajax.data));
            if(pagers.getOptions().ajax.start && pagers.getOptions().ajax.start.on){
                var startObj = {};
                startObj.name = pagers.getOptions().ajax.start.name;
                startObj.value = start;
                data.push(startObj);
            }
            if(pagers.getOptions().ajax.limit && pagers.getOptions().ajax.limit.on){
                var limitObj = {};
                limitObj.name = pagers.getOptions().ajax.limit.name;
                limitObj.value = limit;
                data.push(limitObj);
            }
            return data;
        };
        var getKeyListResponse = function(){
            return isAjax() ? pagers.getOptions().ajax.key_list_response 
                            : pagers.getOptions().json.key_list_response;
        };
        var getKeyCountResponse = function(){
            return isAjax() ? pagers.getOptions().ajax.key_count_response 
                            : pagers.getOptions().json.key_count_response;
        };
        var callCustomCallback = function(pagers,data){
            return isAjax() ? pagers.getOptions().ajax.callback(pagers,data)
                            : pagers.getOptions().json.callback(pagers,data);
        };
        
        
        var getStartRequest = function(page){
            var start = page * (pagers.getOptions().itemToShow);
            return start;
        };
        var getLimitRequest = function(page){
            return isAjax() ? getStartRequest(page+1) 
                            : getStartRequest(page+1)-1 ;
        };
        
        //get number of pages
        var getCountPages = function(tot){
            return Math.ceil(tot / pagers.getOptions().itemToShow);
        };
        
        //get div that contains btns
        var getButtonPager = function (){
            var pager = $('.'+pagers[0].className);
            
            var classPagerBtns = pagers.getOptions().classPager;
            var pagerBtns = $('.'+classPagerBtns);
            //if not exist => create section uttons pager
            if(pagerBtns.length == 0){
                pagerBtns = pager.append('<div class="'+classPagerBtns+'"></div>');
            }
            return pagerBtns;
        };
        
        //get data-id
        var existPage = function(page){
            var index = getIndexPage(page);
            return getButtonPager().children("[data-id='"+index+"']").length > 0 ? true : false;
        };
        //get data-id
        var getIndexPage = function(page){
            return parseInt(page.data('id'));
        };
        // set changePage event onclick
        var setActionToBtnPage = function(btn){
            btn.off("click");
            btn.on("click", function () {
                 pagers.changePage(getIndexPage($(this)));
            });
        };
        
        //remove all buttons
        var resetButtonPager = function (){
            getButtonPager().children('.first,.prev,.next,.goToLast,.page,.other').remove();
        };
        //Logic setting buttons of pager:
        //count : tot items
        //currentPage : from 0 to count-1
        /*
         * 1)delete all btns 
         * 2)re-add btns with logic max btns
         */
        var setButtonPager = function (currentPage,count) {
            resetButtonPager();
            
            var goToFirst = pagers.getOptions().goToFirst,
                    goToLast = pagers.getOptions().goToLast,
                    next = pagers.getOptions().next,
                    prev = pagers.getOptions().prev;
            
            var totPages = getCountPages(count),
                maxBtnShow = pagers.getOptions().maxBtnToShow;

            //1) go to first page btn
            var goToFirstBtn = getButtonPager().children('.first');
            if (goToFirst && goToFirstBtn.length == 0) {
                getButtonPager().append('<button class="first">FIRST</button>');
                goToFirstBtn = getButtonPager().children('.first');
                
                //action
                goToFirstBtn.off("click");
                goToFirstBtn.on("click", function () {
                     pagers.changePage(0);
                });
            }
            currentPage == 0 ? disableBtn(goToFirstBtn) : enableBtn(goToFirstBtn);
            
            //2) go to previous page btn
            var prevBtn = getButtonPager().children('.prev');
            if (prev && prevBtn.length == 0) {
                getButtonPager().append('<button class="prev">PREV</button>');
                prevBtn = getButtonPager().children('.prev');
                
                //action
                prevBtn.off("click");
                prevBtn.on("click", function () {
                     pagers.changePage(currentPage-1);
                });
            }
            currentPage == 0 ? disableBtn(prevBtn) : enableBtn(prevBtn);


            //pages
            for (var i = 0; i < totPages; i++) {
                var numPagina = i,
                        titlePagina = i + 1;
                
                //SET ... on start
                /*
                var otherPrevBtn = getButtonPager().children('.other-prev');
                if(numPagina > 0 && otherPrevBtn.length == 0){
                    var otherPrev = $('<button class="other other-prev">...</button>');
                    getButtonPager().append(otherPrev);
                    otherPrevBtn = getButtonPager().children('.other-prev');
                }
                */

                var page = $('<button class="page" data-id="' + numPagina + '">' + titlePagina + '</button>');
                if (!existPage(page)) {
                    getButtonPager().append(page);
                    setActionToBtnPage(page);
                }
                
                //SET ... on end
                var otherPrevNext = getButtonPager().children('.other-next');
                if(numPagina == totPages-3 && otherPrevNext.length == 0){
                    var otherNext = $('<button class="other other-next">...</button>');
                    getButtonPager().append(otherNext);
                    otherPrevNext = getButtonPager().children('.other-next');
                }
                
                //SET Style current page
                page = $('[data-id="'+getIndexPage(page)+'"]');
                if(numPagina == currentPage){
                    setCurrentPageStyle(page);
                }else{
                    unsetCurrentPageStyle(page);
                }
            }

            //3) go to next page
            var nextBtn = getButtonPager().children('.next');
            if (next && nextBtn.length == 0) {
                getButtonPager().append('<button class="next">NEXT</button>');
                nextBtn = getButtonPager().children('.next');
                
                //action
                nextBtn.off("click");
                nextBtn.on("click", function () {
                     pagers.changePage(currentPage+1);
                });
            }
            currentPage == totPages-1 ? disableBtn(nextBtn) : enableBtn(nextBtn);
            
            //4) go to last page
            var goToLastBtn = getButtonPager().children('.goToLast');
            if (goToLast && goToLastBtn.length == 0) {
                getButtonPager().append('<button class="goToLast">LAST</button>');
                goToLastBtn = getButtonPager().children('.goToLast');
                
                //action
                goToLastBtn.off("click");
                goToLastBtn.on("click", function () {
                     pagers.changePage(totPages-1);
                });
            }
            currentPage == totPages-1 ? disableBtn(goToLastBtn) : enableBtn(goToLastBtn);
        };
        var enableBtn = function(btn){
            stateBtn(btn,true);
        };
        var disableBtn = function(btn){
            stateBtn(btn,false);
        };
        var stateBtn = function(btn,state){
          state ? btn.removeClass('not-active') : btn.addClass('not-active');
        };
        
        var setCurrentPageStyle = function(btn){
            styleCurrentPageStyle(btn,true);
        };
        var unsetCurrentPageStyle = function(btn){
            styleCurrentPageStyle(btn,false);
        };
        var styleCurrentPageStyle = function(btn,state){
           state ? btn.addClass('active-page') : btn.removeClass('active-page');
        };
        
        var callbackRequest = function(data,count,currentPage){
            callCustomCallback(pagers,data);
            //Crea Pager
            setButtonPager(currentPage,count);
            
            if(pagers.getOptions().pageOf.on){
                var pageTitle = pagers.getOptions().pageOf.page,
                    pageOf = pagers.getOptions().pageOf.of,   
                    text = pageTitle + ' ' + (currentPage+1) + ' ' + pageOf + ' ' + count;
                getButtonPager().append('<p class="pageOf">'+text+'</p>');
            }
        };

        
        // PUBLIC functions
        this.changePage = function (page) {            
            
            // change page
            if(!page){
                page = pagers.getOptions().pageStart;
            }
            
            var start = getStartRequest(page);
            var limit = getLimitRequest(page);
            
            if(isJson()){
                //"list" : list of items
                //"count" : count of all items not filtered
                $.getJSON(getAction()).success(function (result) {
                    if(!result[getKeyCountResponse()]){
                       console.log('Error : Miss "'+getKeyCountResponse()+'" params in your response data'); 
                    }else if(!result[getKeyListResponse()]){
                       console.log('Error : Miss "'+getKeyListResponse()+'" params in your response data'); 
                    }else{
                        var list = [];
                        $.each(result[getKeyListResponse()], function (i, field) {
                            if (i >= parseInt(start) && i <= parseInt(limit)) {
                                list.push(field);
                            }
                        });
                        callbackRequest(list,result[getKeyCountResponse()],page); 
                        
                        if(pagers.getOptions().itemToShow > result[getKeyCountResponse()]){
                           console.log('Notice : "itemToShow" > Response list length'); 
                        }else if(pagers.getOptions().itemToShow == 0){
                           console.log('"itemToShow" is set to 0'); 
                        }
                    }
                });
            }else if(isAjax()){
                console.log('Calling ' + getAction() + ' With Data: ' );
                console.dir(getDataAjax(start,limit));
                $.ajax(
                        {
                            method: "POST",
                            url: getAction(),
                            data: getDataAjax(start,limit)
                        }
                ).done(function (data) {
                    var data = $.parseJSON(data);
                    if(!data[getKeyCountResponse()]){
                       console.log('Error : Miss "'+getKeyCountResponse()+'" params in your response data'); 
                    }else if(!data[getKeyListResponse()]){
                       console.log('Error : Miss "'+getKeyListResponse()+'" params in your response data'); 
                    }else{
                        callbackRequest(data[getKeyListResponse()],data[getKeyCountResponse()],page); 
                    }
                }).fail(function () {
                    console.log('Fail Ajax Request');
                });
            }else{
                console.log('Request must be ajax or json');
            }
        };

        this.getOptions = function () {
            return options;
        };

        return intialize();
    };
})(jQuery);


