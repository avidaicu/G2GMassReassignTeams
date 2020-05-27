({
    /*
     * This methods sets the page numbers
     */
    paginationSettings : function(component, pageNumber){ 
        var pageSize = component.get("v.pageSize");
        var filteredOppList = component.get("v.accounts");
        var pagesTotalRecord = filteredOppList.length;
        var totalPages = Math.ceil(pagesTotalRecord/ pageSize);       
        var noOfPages = 5;
        var pageMultiplier = Math.floor(pageNumber/noOfPages);
        var startAt = (pageMultiplier * noOfPages) + 1;
        if (noOfPages > totalPages) {
            noOfPages = totalPages;
        }
        else if ((startAt + noOfPages) > totalPages) {
            startAt = totalPages - noOfPages + 1;
        } 
        var pagesArrayStarter = Array.apply(null, Array(noOfPages)).map(function () {})
        var pagesArray = pagesArrayStarter.map(function(x, i){return (i + startAt)});
        var pagesEndRecord = (pageSize * (pageNumber-1)) + pageSize;
        if (pagesEndRecord > pagesTotalRecord) pagesEndRecord = pagesTotalRecord;
        component.set('v.totalPages', parseInt(totalPages)); 
        component.set('v.currentPage', parseInt(pageNumber));
        component.set('v.pagesArray', pagesArray);
        component.set('v.pagesStartRecord', (pageSize * (pageNumber-1) + 1));
        component.set('v.pagesEndRecord', pagesEndRecord);
        component.set('v.pagesTotalRecord', pagesTotalRecord);
    },
    
    /*
     * This methods gives the page results  
     * based on pageNumber and the pageSize
     */
    pageOpp : function(component, pageNumber){ 
        var pageSize = component.get("v.pageSize");
        this.paginationSettings(component, pageNumber);
        var oList = component.get("v.accounts");
        var start = (pageNumber-1) * pageSize;
        var oPageList = oList.slice(start, (start + pageSize));
        component.set('v.thisPageOppList', oPageList);
    },
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.accounts");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse));
        this.pageOpp(cmp, 1);
        
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    findAccounts : function(component, event, helper) {
        component.set('v.isSending',true);
        var self = this;
        var action=component.get('c.fetchAccounts');
        
        var acc = component.get("v.acc");
        console.log('findAccounts is called...' + JSON.stringify(acc));
        var jsonAcc = JSON.stringify(acc);
        
        action.setParams({"jsonAcc": jsonAcc});
        console.log('params are set...' + jsonAcc);
        
        action.setCallback(this,function(response){
            var state=response.getState();
            var responseresults= response.getReturnValue().lstDataTableData
            console.log(state);
            if(state==="SUCCESS")
            { 
                component.set("v.acccolumns", response.getReturnValue().lstDataTableColumns);
                component.set('v.accounts', responseresults);
                var filteredOppLength = responseresults.length;
                var pageNumber = (filteredOppLength > 0) ? 1 : 0;   
                self.pageOpp(component, pageNumber);
                component.set('v.isSending',false);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                component.set('v.isError', true);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +   errors[0].message);
                        component.set('v.isError', true);
                    }
                } else {
                    console.log("Unknown error");
                }
            }     
        });
        $A.enqueueAction(action);  
    },
    
    findTeamMemberRoles : function(component, event, helper) {
        var action=component.get('c.fetchTeamMemberRole');
        action.setCallback(this,function(response){
            var state=response.getState(); console.log(state);console.log(response.getReturnValue());
            if(state==="SUCCESS")
            {   var result = response.getReturnValue();
             var teamRoleMap = [];
             for(var key in result){
                 teamRoleMap.push({key: key, value: result[key]});
             }
             component.set('v.listViewOptions', teamRoleMap);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                component.set('v.isError', true);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +  errors[0].message);
                        component.set('v.isError', true);
                    }
                } else {
                    console.log("Unknown error");
                }
            }     
        });
        $A.enqueueAction(action);  
    },
    
    getProductNames : function(component, event, helper) {
        var action=component.get('c.fetchProductNames ');
        action.setCallback(this,function(response){
            var state=response.getState(); console.log(state);console.log(response.getReturnValue());
            if(state==="SUCCESS")
            {   
                var result = response.getReturnValue();
                var products = [];
                for(var key in result){
                    products.push({key: key, value: result[key]});
                }
                component.set('v.products', products);
                console.log(component.get('v.products'));
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                component.set('v.isError', true);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +  errors[0].message);
                        component.set('v.isError', true);
                    }
                } else {
                    console.log("Unknown error");
                }
            }   
            
        });
        $A.enqueueAction(action);  
    },
    
    fetchCenterNames : function(component, event, helper) {
        var action=component.get('c.fetchCenterNames');
        action.setCallback(this,function(response){
            var state=response.getState(); console.log(state);console.log(response.getReturnValue());
            if(state==="SUCCESS")
            {   
                var result = response.getReturnValue();
                var centres = [];
                for(var key in result){
                    centres.push({key: key, value: result[key]});
                }
                component.set('v.centers', centres);
                console.log(state);console.log(component.get('v.centers'));
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                component.set('v.isError', true);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +  errors[0].message);
                        component.set('v.isError', true);
                    }
                } else {
                    console.log("Unknown error");
                }
            }     
        });
        $A.enqueueAction(action);  
    },
    
    submitSelectedRecords : function(component, event, helper) {
        console.log(component.find('selectMember').get('v.value'));
        console.log(component.find('selectCenter').get('v.value'));
        console.log(component.get("v.selItem"));
        if(component.find('selectMember').get('v.value') == 'Select Team Role'){
            alert('b'+'Please Select the Team Member Role.');
            component.set('v.message','Please Select the Team Member Role.');
        }
        else if(component.find('selectMember').get('v.value') == 'Centre Specialist' && component.find('selectCenter').get('v.value') =='Select Centre'){
            alert('c'+'Please Select Centre for the Centre Specialist Role.');
            component.set('v.message','Please Select Centre for the Centre Specialist Role.');
        }
            else{
                var action=component.get('c.submitSelectedRecords');
                action.setParams({"teamMember" : component.find('selectMember').get('v.value'),
                                  "centerName" : component.find('selectCenter').get('v.value'),
                                  "userId" : component.get("v.selItem"),
                                 });  
                action.setCallback(this,function(response){
                    var state=response.getState(); 
                    if(state==="SUCCESS")
                    {    	console.log(response.getReturnValue());
                    }
                    else if (state === "ERROR") {
                        var errors = response.getError();
                        component.set('v.isError', true);
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " +  errors[0].message);
                                component.set('v.isError', true);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                    }     
                });
                $A.enqueueAction(action);  
            }   
    },
})